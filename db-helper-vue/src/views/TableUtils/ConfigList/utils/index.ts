import { ref } from 'vue';
import { Message } from 'element-ui';
import moment from 'moment';
import _ from 'lodash';

import { IColumn, TableConfig } from '@/models/Index';

import * as FileUtils from '@/utils/FileUtils';
import http from '@/utils/AxiosUtils';

import { ExportDbDatas } from "@/utils/ImportDataUtils";
import Ef6Utils from "@/utils/TableUtils/Ef6";
import MarkdownUtils from "@/utils/TableUtils/Markdown";

import { getTables } from '@/api';

async function GetTableColumns(config: TableConfig, table: string = null) {
  const rsp = await http.post<IColumn[]>('/api/sql/tablecolumns', Object.assign({ table }, config));
  if (rsp.code !== 0) throw new Error([table, rsp.msg].join(' : '));
  return rsp.data;
}

export function useSetup() {
  const loading = ref(false);

  async function exportDatas(item: TableConfig) {
    loading.value = true;

    try {
      const names = await getTables(item);
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
    try {
      const list = await GetTableColumns(item);
      FileUtils.ColumnsExport(list, item.name);
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
        text: ['namespace Models', '{', Ef6Utils(k, v), '}'].join('\r\n'),
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