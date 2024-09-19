import { ref } from 'vue';
import { Message } from 'element-ui';
import moment from 'moment';
import _ from 'lodash';

import { IColumn } from '@/models/Index';

import * as FileUtils from '@/utils/FileUtils';
import http from '@/utils/AxiosUtils';
import { ExportExcel } from "@/utils/CsvExport";

import { ExportDbDatas } from "@/utils/ImportDataUtils";
import Ef6Utils from "@/utils/TableUtils/Ef6";
import MarkdownUtils from "@/utils/TableUtils/Markdown";

interface TableConfig {
  name: string;
}

async function GetTableNames(config: TableConfig) {
  const rsp = await http.post<string[]>('/api/sql/tablenames', config);
  if (rsp.code !== 0) throw new Error(rsp.msg);
  return rsp.data;
}

async function GetTableColumns(config: TableConfig, table: string = null) {
  const rsp = await http.post<IColumn[]>('/api/sql/tablecolumns', Object.assign({ table }, config));
  if (rsp.code !== 0) throw new Error([table, rsp.msg].join(' : '));
  return rsp.data;
}

export function useSetup(item: TableConfig) {
  const loading = ref(false);

  async function exportDatas(item: TableConfig) {
    loading.value = true;

    try {
      const names = await GetTableNames(item);
      await ExportDbDatas(item, names);
    } catch (err: any) {
      Message.error(err.message);
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function importColComment(list: any[], row: TableConfig) {
    loading.value = true;

    for (let i = 0; i < list.length; i++) {
      const item = Object.assign({}, list[i], row);
      const rsp = await http.post("/api/sql/UpdateColumnComment", item);
      if (rsp.code !== 0) {
        console.error({
          item,
          error: rsp.msg,
        });
      }
    }

    loading.value = false;
  }

  async function exportAll(item: TableConfig) {
    loading.value = true;

    const exportDic = {
      "id": "id",
      "table": "表名",
      "name": "列名",
      "type": "类型",
      "null_able": "可空",
      "comments": "备注",
      "character_maximum_length": "最大长度",
      "numeric_precision": "数字长度",
      "numeric_scale": "小数位数",
    };

    try {
      const list = await GetTableColumns(item);
      const row1 = Object.keys(exportDic).map(key => exportDic[key]);
      const rows = _.chain(list)
        .map(col => {
          return Object.keys(exportDic).map(key => col[key]);
        })
        .value();
      ExportExcel([row1, ...rows], ["dbinfo", item.name, moment().format("YYYYMMDDHHmmss")].join("_"));
    } catch (err: any) {
      Message.error(err.message);
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  /** 导出数据库markdown文件 */
  async function exportMd(item: TableConfig) {
    loading.value = true;

    try {
      const list = await GetTableColumns(item);
      const arr = _.chain(list).groupBy(t => t.table).map((v, k) => [
        MarkdownUtils(k, v),
        '',
      ]).flatten().value();
      const fileName = ["dbinfo", item.name, moment().format("YYYYMMDDHHmmss")].join("_");
      FileUtils.downloadFile(arr.join('\r\n'), fileName + '.md');
    } catch (err: any) {
      Message.error(err.message);
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function exportEf(item: TableConfig) {
    loading.value = true;

    try {
      const list = await GetTableColumns(item);

      const files = _.chain(list).groupBy(t => t.table).map((v, k) => ({
        name: k + '.cs',
        text: ['namespace Models', '{', Ef6Utils(k, list), '}'].join('\r\n'),
      })).value();
      const names = _.chain(list).map(t => t.table).uniq().value();

      await FileUtils.ExportEfCode(files, names);
    } catch (err: any) {
      Message.error(err.message);
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,

    exportDatas,
    importColComment,
    exportAll,
    exportMd,
    exportEf,

    exportConfig(list: any[]) {
      FileUtils.downloadFile(JSON.stringify(list), 'config.json');
    },
  };
}