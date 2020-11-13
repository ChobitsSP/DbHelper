<template>
  <div>
    <el-row>
      <el-form inline>
        <el-form-item>
          <TableNames @change="change"></TableNames>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="refresh">刷新</el-button>
          <el-button type="success"
                     @click="ExportTable">导出</el-button>
          <el-button type="success"
                     @click="ExportList">导出数据</el-button>
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
  import TableNames from '@/components/TableNames.vue'
  import ExportModal from '@/components/ExportModal/Index.vue'
  import TempEditor from '@/components/TempEditor/Index.vue'
  import CsvExport from '@/utils/CsvExport.ts'

  export default {
    components: {
      TableTabs,
      TableNames,
      ExportModal,
      TempEditor,
    },
    data() {
      return {
        loading: false
      }
    },
    computed: {
      tableData() {
        return this.$store.state.table.columns
      },
      coninfo() {
        return this.$store.state.user.coninfo
      }
    },
    created() {
      this.refresh()
    },
    watch: {
      '$route': 'refresh'
    },
    methods: {
      refresh() {
        this.query(this.$route.params.table)
      },
      change(val) {
        this.$router.push({ name: this.$route.name, params: { table: val } })
      },
      async query(table) {
        this.loading = true
        const data = Object.assign({ table: table }, this.coninfo)
        await this.$store.dispatch('getColumns', data)
        this.loading = false
      },
      ExportTable() {
        const columns = this.$refs.table.$children.filter(t => t.prop != null)
        CsvExport(this.tableData, columns)
      },
      ExportList() {
        this.$refs.ExportModal.open();
      }
    }
  }
</script>
