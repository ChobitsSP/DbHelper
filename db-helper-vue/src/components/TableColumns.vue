<template>
  <div>
    <el-row>
      <TableTabs></TableTabs>
    </el-row>
    <!--<el-row>
        <el-button-group>
            <el-button type="primary" icon="edit"></el-button>
            <el-button type="primary" icon="share"></el-button>
            <el-button type="primary" icon="delete"></el-button>
            <el-button type="primary" icon="edit"></el-button>
            <el-button type="primary" icon="share"></el-button>
            <el-button type="primary" icon="delete"></el-button>
            <el-button type="primary" icon="edit"></el-button>
            <el-button type="primary" icon="share"></el-button>
            <el-button type="primary" icon="delete"></el-button>
        </el-button-group>
    </el-row>-->
    <el-row>
      <el-table v-loading="loading"
                :data="tableData"
                border
                style="width: 100%"
                :default-sort="{ prop: 'id', order: 'ascending' }">
        <el-table-column prop="id" label="id" sortable width="75"></el-table-column>
        <el-table-column prop="name" label="name" sortable width="255"></el-table-column>
        <el-table-column prop="type" label="type" sortable width="230"></el-table-column>
        <el-table-column prop="null_able" sortable="custom" label="null_able" width="130">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.null_able" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="comments" label="comments" sortable></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import TableTabs from './TableTabs'

  export default {
    components: {
      TableTabs
    },
    data() {
      return {
        loading: false
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      refresh() {
        this.query(this.$route.params.table)
      },
      async query(table) {
        this.loading = true
        const data = Object.assign({ table: table }, this.coninfo)
        await this.$store.dispatch('getColumns', data)
        this.loading = false
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
    watch: {
      '$route': 'refresh'
    }
  }
</script>
