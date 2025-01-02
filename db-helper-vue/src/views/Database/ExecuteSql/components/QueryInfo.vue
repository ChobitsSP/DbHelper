<template>
  <div class="sql-executor">
    <el-form size="small"
             inline>
      <el-form-item>
        <el-select v-model="queryConfig.dbId"
                   filterable
                   placeholder="Select Database">
          <el-option v-for="db in dbList"
                     :key="db.id"
                     :label="db.name"
                     :value="db.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryConfig.maxCount">
          <el-option v-for="option in [10, 20, 50, 100, 500, 1000]"
                     :key="option"
                     :label="`Limit ${option} rows`"
                     :value="option" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="queryConfig.dbId">
        <el-button type="primary"
                   :loading="loading"
                   @click="executeSQL">执行</el-button>
        <el-button type="success"
                   :loading="loading"
                   @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <el-input v-model="queryConfig.sql"
              ref="sqlInput"
              :rows="20"
              placeholder="请输入SQL语句"
              type="textarea"></el-input>
    <div class="result">
      <DataTable :loading="loading"
                 :data="tableData">
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Message } from 'element-ui';

  import * as api from '@/api';
  import * as DbUtils from '@/utils/DbUtils';

  import { exportToExcel } from '@/utils/XlsxExport';

  import DataTable from './DataTable.vue';

  class QueryConfig {
    dbId: number = null;
    maxCount = 20;
    sql = '';
  }

  export default defineComponent({
    components: {
      DataTable,
    },
    setup() {
      const sqlInput = ref();

      const queryConfig = ref(new QueryConfig);

      const tableData = ref([]);
      const loading = ref(false);

      const dbList = ref([]);
      async function init() {
        dbList.value = await DbUtils.DbConfigList();
      }
      init();

      function getSql() {
        const textarea: HTMLTextAreaElement = sqlInput.value.$el.querySelector('textarea');

        let selectedText = '';

        if (textarea.selectionStart !== textarea.selectionEnd) {
          selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        }
        return selectedText || textarea.value;
      }

      async function executeSQL() {
        const sql = getSql();
        if (!sql) {
          Message.error('请输入SQL语句');
          return;
        }

        loading.value = true;

        try {
          const config = await DbUtils.DbConfigGet(queryConfig.value.dbId);
          tableData.value = await api.ListGet(config, {
            sql,
            skip: 0,
            take: queryConfig.value.maxCount,
          });
        } catch (err: any) {
          console.error(err);
          Message.error(err.message);
        }
        finally {
          loading.value = false;
        }
      }

      async function exportData() {
        loading.value = true;

        try {
          const allList = await getAllList();
          exportToExcel(allList);
        } catch (err: any) {
          console.error(err);
          Message.error(err.message);
        }
        finally {
          loading.value = false;
        }
      }

      async function getAllList() {
        const config = await DbUtils.DbConfigGet(queryConfig.value.dbId);
        const sql = getSql();

        const allList = [];

        while (true) {
          const list = await api.ListGet(config, {
            sql,
            skip: allList.length,
            take: queryConfig.value.maxCount,
          });

          if (list.length === 0) {
            break;
          }

          allList.push(...list);
        }

        return allList;
      }

      return {
        dbList,
        sqlInput,
        queryConfig,

        loading,
        executeSQL,
        exportData,

        tableData,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .result {
    margin-top: 20px;
  }
</style>