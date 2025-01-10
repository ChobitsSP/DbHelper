<template>
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
    <vxe-table :row-config="{ keyField: 'id', drag: true }"
               :data="tableData"
               @row-dragend="rowDragendEvent"
               :min-height="400"
               :menu-config="menuConfig"
               @menu-click="contextMenuClickEvent"
               :loading="loading"
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
                  width="150">
        <template #default="{ row }">
          <XlsxUpload style="margin-left:10px;"
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

  import ConfigEditDialog from '@/components/ConfigEditDialog.vue';
  import * as DbUtils from '@/utils/DbUtils';
  import XlsxUpload from "@/components/XlsxUpload.vue";
  import { DbTypes } from '@/data';

  import { useSetup } from './utils/index';
  import { useConfigData } from './utils/ConfigData';

  export default defineComponent({
    components: {
      ConfigEditDialog,
      XlsxUpload,
    },
    setup() {
      const setup = useSetup({
        refresh,
      });
      const setupConfigData = useConfigData({
        refresh,
      });

      const tableData = ref([]);
      async function refresh() {
        tableData.value = await DbUtils.DbConfigList();
      }
      refresh();

      function providerNameFormatter({ cellValue }) {
        return DbTypes.find(t => t.value === cellValue)?.label;
      }

      async function rowDragendEvent({ newRow, oldRow }) {
        await DbUtils.DbConfigDrag(oldRow.id, newRow.id);
        return refresh();
      }

      return {
        ...setup,
        ...setupConfigData,

        tableData,

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