<template>
  <div>
    <el-row>
      <el-form inline>
        <el-form-item>
          <el-button @click="edit(null)"
                     icon="el-icon-plus"
                     circle
                     size="small"
                     type="success"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="exportConfig(tableData)"
                     circle
                     icon="el-icon-download"
                     size="small"
                     type="info"></el-button>
        </el-form-item>
        <el-form-item>
          <el-upload accept=".json"
                     :before-upload="importConfig">
            <el-button circle
                       icon="el-icon-upload"
                       size="small"
                       type="primary"></el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <vxe-table :row-config="{ keyField: 'id' }"
                 show-overflow="tooltip"
                 :data="tableData"
                 style="width: 100%">
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
                    title="provider"
                    width="220">
        </vxe-column>
        <vxe-column field="connectionString"
                    title="provider"
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
    </el-row>
    <ConAddModal></ConAddModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { MessageBox } from 'element-ui';

  import _ from "lodash";
  import ConAddModal from '@/components/ConAddModal.vue';
  import * as DbUtils from '@/utils/DbUtils';
  import XlsxUpload from "./components/XlsxUpload.vue";

  import { useSetup } from './utils/index';
  import store from '@/store';
  import { useRouter } from '@/router';
  import { useRx } from '@/mixins/RxBusMixins';

  export default defineComponent({
    components: {
      ConAddModal,
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
        const reader = new FileReader();
        reader.onload = async (event) => {
          const list: any[] = JSON.parse(event.target.result as string);
          const plist = list.map(item => {
            delete item.id;
            return DbUtils.DbConfigUpdate(item);
          });
          await Promise.all(plist);
          this.refresh();
        }
        reader.readAsText(file);
        return false;
      }

      async function remove(row) {
        await MessageBox.confirm('是否删除?');
        await DbUtils.DbConfigRemove(row.id);
        return refresh();
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
      };
    },
  });
</script>
