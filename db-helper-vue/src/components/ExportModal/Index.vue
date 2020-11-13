<template>
  <el-dialog title="导出"
             :visible.sync="dialogVisible"
             width="60%">
    <el-form :model="item"
             :rules="rules"
             ref="form"
             label-width="120px">
      <el-form-item label="skip">
        <el-input-number :min="0"
                         v-model.number="item.skip"></el-input-number>
      </el-form-item>
      <el-form-item label="take">
        <el-input-number :min="1"
                         v-model.number="item.take"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 :loading="loading"
                 @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { FormModel } from './models/Index.ts'
  import FormMixins from '@/mixins/FormMixins'
  import CsvExport from '@/utils/CsvExport.ts'

  export default {
    mixins: [FormMixins],
    computed: {
      rules() {
        return this.item.GetRules(this)
      }
    },
    data() {
      return {
        dialogVisible: false,
        item: new FormModel(),
        loading: false,
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
    methods: {
      open(item) {
        this.item = new FormModel();
        this.item.table = this.$route.params.table;
        this.resetForm()
        this.dialogVisible = true
      },
      async submit() {
        const axios = require('axios')
        const data = Object.assign(this.item, this.coninfo)
        const rsp = await axios.post('/api/sql/listget', data);
        const clist = this.tableData.map(t => ({ label: t.name, prop: t.name }));
        CsvExport(rsp, clist);
      }
    }
  }
</script>
