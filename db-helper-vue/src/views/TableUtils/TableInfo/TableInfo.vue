<template>
  <div>
    <el-row>
      <el-form inline
               size="small">
        <el-form-item>
          <el-button type="primary"
                     @click="$emit('refresh')">刷新</el-button>
          <el-button type="success"
                     @click="ExportTable">导出</el-button>
          <el-button type="success"
                     @click="ExportList">导出数据</el-button>
          <XlsxUpload :loading="loading"
                      style="margin-left:10px;"
                      @input="ImportData"></XlsxUpload>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isHump">isHump</el-checkbox>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <TableTabs></TableTabs>
    </el-row>
    <el-row>
      <el-table v-loading="loading"
                :data="tableData"
                border
                size="small"
                ref="table"
                style="width: 100%"
                :default-sort="{ prop: 'id', order: 'ascending' }">
        <el-table-column prop="id"
                         label="id"
                         sortable
                         width="75"></el-table-column>
        <el-table-column prop="name"
                         label="name"
                         sortable
                         width="255"></el-table-column>
        <el-table-column prop="type"
                         label="type"
                         sortable
                         width="230"></el-table-column>
        <el-table-column prop="null_able"
                         sortable="custom"
                         label="null_able"
                         width="130">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.null_able"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="comments"
                         label="comments"
                         sortable></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <TempEditor :tablename="$route.params.table"></TempEditor>
    </el-row>
    <ExportModal ref="ExportModal"></ExportModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import router from '@/router/index';
  import { useMainStore } from '@/store/main';

  import TableTabs from '@/components/TableTabs.vue'
  import ExportModal from '@/components/ExportModal/Index.vue'
  import TempEditor from '@/components/TempEditor/Index.vue'
  import XlsxUpload from './components/XlsxUpload.vue'
  import CsvExport from '@/utils/CsvExport';
  import axios from '@/utils/AxiosUtils';
  import { RowTypeTrans } from '@/utils/ImportDataUtils';

  export default defineComponent({
    components: {
      TableTabs,
      ExportModal,
      TempEditor,
      XlsxUpload,
    },
    props: {
      tableName: String,
    },
    setup(props, context) {
      const { coninfo, columns: tableData, isHump } = useMainStore();

      // data
      const loading = ref(false);
      const table = ref();
      const ExportModal = ref();

      // methods
      const change = (val: string) => {
        const route = router.currentRoute;
        router.push({ name: route.name, params: { table: val } });
      };

      const ExportTable = () => {
        const columns = table.value.$children.filter((t: any) => t.prop != null);
        CsvExport(tableData.value, columns);
      };

      const ExportList = () => {
        ExportModal.value.open();
      };

      const ImportData = async (rows: any[]) => {
        if (rows.length === 0) return;
        let list = RowTypeTrans(rows, tableData.value);

        const url = '/api/sql/TableDataAdd';

        const params = {
          ...coninfo.value,
          table: props.tableName,
          import_cols: Object.keys(list[0]),
          import_datas: list,
        };

        loading.value = true;

        const rsp = await axios.post(url, params);

        if (rsp.code !== 0) {
          alert(rsp.msg);
        }

        loading.value = false;
      };

      return {
        loading,
        coninfo,
        tableData,
        isHump,

        table,
        ExportModal,

        change,
        ExportTable,
        ExportList,
        ImportData,
      };
    },
  });
</script>