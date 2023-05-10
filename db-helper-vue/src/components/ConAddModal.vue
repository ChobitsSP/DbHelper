<template>
  <el-dialog title="数据库配置"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             width="60%">
    <el-form ref="form"
             :model="item"
             :rules="rules"
             label-width="80px">
      <el-form-item label="名称"
                    prop="name">
        <el-input v-model="item.name"></el-input>
      </el-form-item>
      <el-form-item label="类型"
                    prop="providerName">
        <el-select v-model="item.providerName"
                   placeholder="请选择活动区域">
          <el-option label="Oracle"
                     value="Oracle.ManagedDataAccess.Client"></el-option>
          <el-option label="Npgsql"
                     value="Npgsql"></el-option>
          <el-option label="MSSQL"
                     value="System.Data.SqlClient"></el-option>
          <el-option label="MySql"
                     value="MySql.Data.MySqlClient"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="连接"
                    prop="connectionString">
        <el-input v-model="item.connectionString"
                  type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import FormMixins from '@/mixins/FormMixins'
  import * as DbUtils from '@/utils/DbUtils';

  export default {
    mixins: [FormMixins],
    data() {
      return {
        dialogVisible: false,
        item: new DbUtils.MyModel(),
        rules: {
          name: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          providerName: [
            { required: true, message: '请输入', trigger: 'change' },
          ],
          connectionString: [
            { required: true, message: '请输入', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      open(item) {
        this.item = Object.assign(new DbUtils.MyModel(), item || {});
        this.dialogVisible = true;
        this.resetForm();
      },
      async submit() {
        await this.submitForm();
        await DbUtils.DbConfigUpdate(this.item);
        this.$emit('callback');
        this.dialogVisible = false;
      }
    }
  }
</script>
