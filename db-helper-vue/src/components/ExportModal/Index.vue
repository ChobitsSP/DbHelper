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
  import axios from 'axios';
  import { FormModel } from './models/Index.ts'
  import FormMixins from '@/mixins/FormMixins'
  import CsvExport from '@/utils/CsvExport.ts'

  function ExportJson(filename, fileData) {
    //Get the file contents
    var txtFile = filename + ".json";
    // var file = new File(txtFile);
    var jsonStr = JSON.stringify(fileData);

    //Write it as the href for the link
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', txtFile);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

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
      tableInfo() {
        return this.$store.state.table;
      },
      coninfo() {
        return this.$store.state.user.coninfo;
      }
    },
    methods: {
      open(item) {
        this.item = new FormModel();
        this.item.table = this.$route.params.table;
        this.resetForm();
        this.dialogVisible = true;
      },
      async submit() {
        const data = Object.assign({ table: '' }, this.item, this.coninfo);
        data.table = this.tableInfo.table;
        const rsp = await axios.post('/api/sql/listget', data);
        if (rsp.code === 0) {
          const clist = this.tableInfo.columns.map(t => ({ label: t.name, prop: t.name }));
          ExportJson(data.table, rsp.data);
          // CsvExport(rsp.data, clist, data.table);
        }
      }
    }
  }
</script>
