<template>
  <div>
    <el-row>
      <el-form inline>
        <el-form-item>
          <el-button type="success"
                     @click="ImportFromClipboard">粘贴板导入</el-button>
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
  </div>
</template>

<script>
  import TempEditor from '@/components/TempEditor/Index.vue'
  import TableTabs from './components/TableTabs.vue'
  import * as SheetClip from './utils/sheetclip.ts';

  export default {
    components: {
      TempEditor,
      TableTabs,
    },
    computed: {
      tableData() {
        return this.$store.state.table.columns
      }
    },
    created() {

    },
    methods: {
      async ImportFromClipboard() {
        const text = await navigator.clipboard.readText();
        const rows = SheetClip.parse(text);

        const list = rows.map(cells => {
          const item = {
            name: cells[0],
            type: cells[1],
            null_able: cells[2] === '是' || cells[2] === '1' || cells[2].toLowerCase() === 'true',
            comments: cells[3],
          };

          return item;
        });

        list.forEach((item, index) => {
          item.id = index + 1;
        });

        this.$store.commit('SET_COLUMNS', list);
        this.$store.commit('SET_TABLE_NAME', "Table1");
      },
    }
  }
</script>
