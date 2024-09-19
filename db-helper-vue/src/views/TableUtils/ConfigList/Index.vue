<template>
  <div>
    <el-row>
      <el-form inline>
        <el-form-item>
          <el-button @click="edit(null)" icon="el-icon-plus" circle size="small" type="success"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="exportConfig(tableData)" circle icon="el-icon-download" size="small"
            type="info"></el-button>
        </el-form-item>
        <el-form-item>
          <el-upload accept=".json" :before-upload="importConfig">
            <el-button circle icon="el-icon-upload" size="small" type="primary"></el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <vxe-table size="small" resizable :row-config="{ keyField: 'id' }" stripe show-overflow="tooltip"
        :data="tableData" border style="width: 100%">
        <vxe-column field="id" title="id" width="60">
        </vxe-column>
        <vxe-column field="name" title="name" width="200">
          <template #default="{ row }">
            <el-link size="small" @click="edit(row)">{{ row.name }}</el-link>
          </template>
        </vxe-column>
        <vxe-column field="providerName" title="provider" width="220">
        </vxe-column>
        <vxe-column field="connectionString" title="provider" min-width="220">
        </vxe-column>
        <vxe-column title="操作" width="240" fixed="right">
          <template #default="{ row }">
            <vxe-button size="mini" :loading="loading" transfer>
              <template #default>操作</template>
              <template #dropdowns>
                <vxe-button mode="text" content="编辑" @click="edit(row)"></vxe-button>
                <vxe-button mode="text" content="导出结构" @click="exportAll(row)"></vxe-button>
                <vxe-button mode="text" content="导出数据" @click="exportDatas(row)"></vxe-button>
                <vxe-button mode="text" content="导出md" @click="exportMd(row)"></vxe-button>
                <vxe-button mode="text" content="导出ef" @click="exportEf(row)"></vxe-button>
                <vxe-button mode="text" status="danger" content="删除" @click="remove(row)"></vxe-button>
              </template>
            </vxe-button>
            <XlsxUpload :loading="loading" style="margin-left:10px;" @input="arr => importColComment(arr, row)">
            </XlsxUpload>
          </template>
        </vxe-column>
      </vxe-table>
    </el-row>
    <ConAddModal ref="ConAddModal" @callback="refresh"></ConAddModal>
  </div>
</template>

<script>
import _ from "lodash";
import ConAddModal from '@/components/ConAddModal.vue';
import * as DbUtils from '@/utils/DbUtils';
import XlsxUpload from "./components/XlsxUpload.vue";

import { useSetup } from './utils/index';

export default {
  components: {
    ConAddModal,
    XlsxUpload,
  },
  setup() {
    const setup = useSetup();
    return {
      ...setup,
    };
  },
  data() {
    return {
      tableData: [],
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      this.tableData = await DbUtils.DbConfigList();
    },
    async remove(row) {
      await this.$confirm('是否删除');
      await DbUtils.DbConfigRemove(row.id);
      this.refresh();
    },
    link(row) {
      this.$store.commit('SET_CONINFO', row)
      this.$router.push({ name: 'TableList' })
    },
    edit(item) {
      this.$refs.ConAddModal.open(item)
    },
    onCommand(row, cmd) {
      const func = this[cmd];
      if (typeof func === 'function') {
        func(row);
      }
    },
    importConfig(file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const list = JSON.parse(event.target.result);

        const plist = list.map(item => {
          delete item.id;
          return DbUtils.DbConfigUpdate(item);
        });

        await Promise.all(plist);
        this.refresh();
      }
      reader.readAsText(file);
      return false;
    },
  }
}
</script>
