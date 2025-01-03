﻿<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-button @click="edit(null)"
                   icon="el-icon-plus"
                   type="success">Add</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="exportConfig(tableData)"
                   icon="el-icon-download"
                   type="info">Export</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload accept=".json"
                   action=""
                   :before-upload="importConfig">
          <el-button icon="el-icon-upload"
                     type="primary">Import</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <vxe-table ref="tableRef"
               :row-config="{ keyField: 'id', drag: true }"
               :data="tableData"
               @row-dragend="rowDragendEvent"
               class="my-table">
      <vxe-column field="id"
                  title="id"
                  width="60">
      </vxe-column>
      <vxe-column field="name"
                  title="name"
                  drag-sort
                  width="200">
        <template #default="{ row }">
          <span class="span-link"
                @click="edit(row)">{{ row.name }}</span>
        </template>
      </vxe-column>
      <vxe-column field="providerName"
                  title="type"
                  :formatter="providerNameFormatter"
                  :filters="DbTypes"
                  width="80">
      </vxe-column>
      <vxe-column field="connectionString"
                  title="connectionString"
                  min-width="220">
        <template #default="{ row }">
          <span class="span-link"
                v-copy="row.connectionString">{{ row.connectionString }}</span>
        </template>
      </vxe-column>
      <vxe-column title="action"
                  width="220"
                  fixed="right">
        <template #default="{ row }">
          <vxe-button size="mini"
                      :loading="loading"
                      transfer>
            <template #default>操作</template>
            <template #dropdowns>
              <vxe-button mode="text"
                          content="编辑"
                          @click="edit(row)"></vxe-button>
              <vxe-button mode="text"
                          content="导出结构"
                          @click="exportAll(row)"></vxe-button>
              <vxe-button mode="text"
                          content="导出数据"
                          @click="exportDatas(row)"></vxe-button>
              <vxe-button mode="text"
                          content="导出md"
                          @click="exportMd(row)"></vxe-button>
              <vxe-button mode="text"
                          content="导出ef"
                          @click="exportEf(row)"></vxe-button>
              <vxe-button mode="text"
                          status="danger"
                          content="删除"
                          @click="remove(row)"></vxe-button>
            </template>
          </vxe-button>
          <XlsxUpload :loading="loading"
                      style="margin-left:10px;"
                      label="导入列注释"
                      size="mini"
                      @input="arr => importColComment(arr, row)">
          </XlsxUpload>
        </template>
      </vxe-column>
    </vxe-table>
    <ConfigEditDialog></ConfigEditDialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { MessageBox } from 'element-ui';

  import ConfigEditDialog from '@/components/ConfigEditDialog.vue';
  import * as DbUtils from '@/utils/DbUtils';
  import XlsxUpload from "@/components/XlsxUpload.vue";
  import { DbTypes } from '@/data';

  import { useSetup } from './utils/index';
  import store from '@/store';
  import { useRouter } from '@/router';
  import { useRx } from '@/mixins/RxBusMixins';

  import { LoadJson } from '@/utils/FileUtils';

  export default defineComponent({
    components: {
      ConfigEditDialog,
      XlsxUpload,
    },
    setup() {
      const router = useRouter();
      const rxHub = useRx();
      const setup = useSetup();

      const tableRef = ref();
      const tableData = ref([]);

      async function refresh() {
        tableData.value = await DbUtils.DbConfigList();
      }
      refresh();

      async function importConfig(file) {
        const list = await LoadJson<any[]>(file);
        const plist = list.map(item => {
          delete item.id;
          return DbUtils.DbConfigUpdate(item);
        });
        await Promise.all(plist);
        await refresh();
        return false;
      }

      async function remove(row) {
        await MessageBox.confirm('是否删除?');
        await DbUtils.DbConfigRemove(row.id);
        return refresh();
      }

      function providerNameFormatter({ cellValue }) {
        return DbTypes.find(t => t.value === cellValue)?.label;
      }

      async function rowDragendEvent({ newRow, oldRow }) {
        await DbUtils.DbConfigDrag(oldRow.id, newRow.id);
        return refresh();
      }

      return {
        ...setup,

        tableRef,
        tableData,

        remove,
        link(row) {
          store.commit('SET_CONINFO', row)
          router.push({ name: 'TableList' })
        },
        edit(item) {
          rxHub.emit('ShowEditDialog', {
            item,
            callback: refresh,
          });
        },
        importConfig,

        DbTypes,
        providerNameFormatter,

        rowDragendEvent,
      };
    },
  });
</script>

<style scoped>
  .span-link {
    cursor: pointer;
    color: #409eff;
  }
</style>