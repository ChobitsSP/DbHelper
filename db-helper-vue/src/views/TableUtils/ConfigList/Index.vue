﻿<template>
  <div>
    <el-form size="small"
             inline>
      <el-form-item>
        <el-button @click="edit(null)"
                   icon="el-icon-plus"
                   circle
                   type="success"></el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="exportConfig(tableData)"
                   circle
                   icon="el-icon-download"
                   type="info"></el-button>
      </el-form-item>
      <el-form-item>
        <el-upload accept=".json"
                   action=""
                   :before-upload="importConfig">
          <el-button circle
                     icon="el-icon-upload"
                     type="primary"></el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <vxe-table :row-config="{ keyField: 'id' }"
               :data="tableData"
               class="my-table">
      <vxe-column field="id"
                  title="id"
                  width="60">
      </vxe-column>
      <vxe-column field="name"
                  title="name"
                  width="200">
        <template #default="{ row }">
          <el-link size="small"
                   @click="edit(row)">{{ row.name }}</el-link>
        </template>
      </vxe-column>
      <vxe-column field="providerName"
                  title="类型"
                  :formatter="providerNameFormatter"
                  width="80">
      </vxe-column>
      <vxe-column field="connectionString"
                  title="连接"
                  min-width="220">
      </vxe-column>
      <vxe-column title="操作"
                  width="240"
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
  import XlsxUpload from "./components/XlsxUpload.vue";
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

      return {
        ...setup,
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

        providerNameFormatter,
      };
    },
  });
</script>