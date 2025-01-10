import { ref } from 'vue';
import { Message, MessageBox } from 'element-ui';
import moment from 'moment';
import _ from 'lodash';

import { IColumn, TableConfig } from '@/models/Index';

import * as FileUtils from '@/utils/FileUtils';
import http from '@/utils/AxiosUtils';
import * as DbUtils from '@/utils/DbUtils';

import { ExportDbDatas } from "@/utils/ImportDataUtils";
import Ef6Utils from "@/utils/TableUtils/Ef6";
import MarkdownUtils from "@/utils/TableUtils/Markdown";

import { getTables } from '@/api';
import { useRx } from '@/mixins/RxBusMixins';

async function GetTableColumns(config: TableConfig, table: string = null) {
  const rsp = await http.post<IColumn[]>('/api/sql/tablecolumns', Object.assign({ table }, config));
  if (rsp.code !== 0) throw new Error([table, rsp.msg].join(' : '));
  return rsp.data;
}

export function useSetup(props) {
  const loading = ref(false);
  const rxHub = useRx();

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

  async function importColComment(list: IColumn[], config: TableConfig) {
    loading.value = true;

    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      const req = {
        table: row.table,
        column: row.name,
        comment: row.comments,
        providerName: config.providerName,
        connectionString: config.connectionString,
      };
      const rsp = await http.post('/api/sql/UpdateColumnComment', req);
      if (rsp.code !== 0) {
        console.error({
          row,
          error: rsp.msg,
        });
      }
    }

    loading.value = false;
  }

  async function exportStruct(item: TableConfig) {
    loading.value = true;
    try {
      const list = await GetTableColumns(item);
      await FileUtils.ColumnsExport(list, item.name);
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

  const menuConfig = {
    body: {
      options: [
        [
          { code: 'edit', name: '编辑' },
          { code: 'export_struct', name: '导出结构' },
          { code: 'export_ef', name: '导出ef' },
          { code: 'export_md', name: '导出md' },
          // { code: 'export_data', name: '导出数据' },
          { code: 'remove', name: '删除', prefixConfig: { icon: 'vxe-icon-delete-fill', className: 'color-red' } },
        ]
      ]
    }
  }

  function edit(item) {
    rxHub.emit('ShowEditDialog', {
      item,
      callback: props.refresh,
    });
  }

  function contextMenuClickEvent({ menu, row }) {
    if (loading.value) return;

    if (menu.code === 'export_struct') {
      return exportStruct(row);
    }
    if (menu.code === 'export_ef') {
      return exportEf(row);
    }
    if (menu.code === 'export_md') {
      return exportMd(row);
    }
    if (menu.code === 'remove') {
      return remove(row);
    }
    if (menu.code === 'edit') {
      return edit(row);
    }
    if (menu.code === 'export_data') {
      return exportDatas(row);
    }
  }

  async function remove(row) {
    await MessageBox.confirm('是否删除?');
    await DbUtils.DbConfigRemove(row.id);
    return props.refresh();
  }

  return {
    loading,

    importColComment,

    edit,
    menuConfig,
    contextMenuClickEvent,
  };
}