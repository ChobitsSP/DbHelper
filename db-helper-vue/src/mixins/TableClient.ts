import _ from 'lodash'
import CsvExport from '../utils/CsvExport'

function getPaginatedItems(items: any[], page: number, per_page: number) {
  const offset = (page - 1) * per_page
  return _.chain(items).slice(offset).take(per_page).value()
}

export default {
  data() {
    return {
      tableData: [],
      checklist: [],
      q: '',
      pager: {
        page_no: 1,
        page_size: 10,
      },
      sort_name: null,
      is_desc: false,
    }
  },
  methods: {
    handleSelectionChange(list: any[]) {
      this.checklist = list
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    handleCurrentChange(currentPage: number) {
      this.pager.page_no = currentPage
    },
    handleSizeChange(val: number) {
      this.pager.page_size = val
    },
    sortChange(obj) {
      this.sort_name = obj.prop
      this.is_desc = obj.order === 'descending'
    },
    toggleRowSelection(row) {
      const i = this.checklist.indexOf(row)
      this.$refs.table.toggleRowSelection(row, i === -1)
    },
    exportCsv(filename: string = 'file1') {
      const columns = this.$refs.table.$children.filter(t => t.prop != null)
      CsvExport(this.tableData, columns, filename)
    }
  },
  computed: {
    total() {
      return this.filterItems.length
    },
    filterItems() {
      return this.filterBy(this.tableData, this.q)
    },
    items() {
      let items = this.filterItems
      if (this.sort_name !== null) {
        items = _.orderBy(items, this.sort_name, this.is_desc ? 'desc' : 'asc')
      }
      items = getPaginatedItems(items, this.pager.page_no, this.pager.page_size)
      return items
    }
  }
}
