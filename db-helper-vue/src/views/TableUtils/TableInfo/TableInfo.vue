<template>
  <div>
    <el-row>
      <el-form inline>
        <el-form-item>
          <el-button type="primary"
                     @click="$emit('refresh')">刷新</el-button>
          <el-button type="success"
                     @click="ExportTable">导出</el-button>
          <el-button type="success"
                     @click="ExportList">导出数据</el-button>
          <XlsxUpload :loading="loading"
                      @input="ImportData"></XlsxUpload>
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
                size="mini"
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

<script>
  import TableTabs from '@/components/TableTabs.vue'
  import ExportModal from '@/components/ExportModal/Index.vue'
  import TempEditor from '@/components/TempEditor/Index.vue'
  import XlsxUpload from './components/XlsxUpload.vue'
  import CsvExport from '@/utils/CsvExport.ts';
  import axios from 'axios';
  import { RowTypeTrans } from '@/utils/ImportDataUtils.ts';

  export default {
    components: {
      TableTabs,
      ExportModal,
      TempEditor,
      XlsxUpload,
    },
    data() {
      return {
        loading: false
      }
    },
    computed: {
      coninfo() {
        return this.$store.state.user.coninfo;
      },
      tableData() {
        return this.$store.state.table.columns
      }
    },
    methods: {
      change(val) {
        this.$router.push({ name: this.$route.name, params: { table: val } })
      },
      ExportTable() {
        const columns = this.$refs.table.$children.filter(t => t.prop != null)
        CsvExport(this.tableData, columns)
      },
      ExportList() {
        this.$refs.ExportModal.open();
      },
      async ImportData(rows) {
        if (rows.length === 0) return;
        RowTypeTrans(rows, this.tableData);

        const url = '/api/sql/TableDataAdd';

        const params = {
          ...this.coninfo,
          import_cols: Object.keys(rows[0]),
          import_datas: rows,
        };

        this.loading = true;

        const rsp = await axios.post(url, params);

        if (rsp.code !== 0) {
          alert(rsp.msg);
        }

        this.loading = false;
      }
    }
  }
</script>
