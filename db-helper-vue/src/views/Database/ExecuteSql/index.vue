<template>
  <div class="sql-executor">
    <el-select v-model="selectedDB"
               placeholder="选择数据库">
      <el-option v-for="db in databases"
                 :key="db.value"
                 :label="db.label"
                 :value="db.value" />
    </el-select>

    <el-input type="textarea"
              v-model="sqlQuery"
              :rows="5"
              placeholder="请输入SQL语句" />

    <el-button type="primary"
               @click="executeSQL">执行</el-button>
    <el-button type="success"
               @click="exportData">导出</el-button>

    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column v-for="(col, index) in tableColumns"
                       :key="index"
                       :prop="col"
                       :label="col" />
    </el-table>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const selectedDB = ref('')
  const sqlQuery = ref('')
  const tableData = ref([])
  const tableColumns = ref([])

  const databases = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'oracle', label: 'Oracle' }
  ]

  const executeSQL = () => {
    // 这里应该调用后端API执行SQL查询
    // 为演示目的,我们使用模拟数据
    tableColumns.value = ['id', 'name', 'age']
    tableData.value = [
      { id: 1, name: '张三', age: 25 },
      { id: 2, name: '李四', age: 30 },
      { id: 3, name: '王五', age: 35 }
    ]
    ElMessage.success('SQL执行成功')
  }

  const exportData = () => {
    // 实现导出功能
    ElMessage.info('导出功能待实现')
  }
</script>

<style scoped>
  .sql-executor {
    padding: 20px;
  }
  .el-select,
  .el-input {
    margin-bottom: 20px;
  }
  .el-button {
    margin-right: 10px;
    margin-bottom: 20px;
  }
</style>