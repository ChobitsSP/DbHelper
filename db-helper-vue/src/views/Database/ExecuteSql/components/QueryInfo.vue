<template>
  <div class="sql-executor">
    <el-form size="small"
             inline
             class="sql-form">
      <el-form-item>
        <el-select v-model="queryConfig.dbId"
                   filterable
                   @change="onDbChange"
                   placeholder="Select Database">
          <el-option v-for="db in dbList"
                     :key="db.id"
                     :label="db.name"
                     :value="db.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryConfig.maxCount">
          <el-option v-for="option in [10, 20, 50, 100, 500, 1000, 0]"
                     :key="option"
                     :label="option === 0 ? 'no limit' : `Limit ${option} rows`"
                     :value="option" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="queryConfig.dbId"
                    class="action-buttons">
        <el-button type="primary"
                   :loading="loading"
                   @click="executeSQL">执行</el-button>
        <el-button type="success"
                   :loading="loading"
                   @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <div class="sql-input-wrapper">
      <SqlInput v-model="queryConfig.sql"
                :autocompletion="queryWords"
                class="sql-input"></SqlInput>
    </div>
    <div class="sql-result-wrapper">
      <DataTable :loading="loading"
                 :data="tableData"
                 class="sql-result"></DataTable>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Message } from 'element-ui';
  import _ from 'lodash';
  import moment from 'moment';

  import * as api from '@/api';
  import * as DbUtils from '@/utils/DbUtils';

  import { exportToExcel } from '@/utils/XlsxExport';

  import DataTable from './DataTable.vue';
  import SqlInput from './SqlInput.vue';

  import { IColumn } from '@/models/Index';
  import filterBy from '@/filters/filterBy';

  class QueryConfig {
    dbId: number = null;
    maxCount = 20;
    sql = [
      'select * from table1',
      'where 1=1',
      // ...Array(8).fill(''),
    ].join('\n');
  }

  export default defineComponent({
    components: {
      DataTable,
      SqlInput,
    },
    props: {
      defaultDbId: Number,
    },
    setup(props) {
      const queryConfig = ref(new QueryConfig);
      queryConfig.value.dbId = props.defaultDbId;

      const tableData = ref([]);
      const loading = ref(false);

      const dbList = ref([]);
      async function init() {
        dbList.value = await DbUtils.DbConfigList();
      }
      init();

      function getSql() {
        return queryConfig.value.sql.trim();
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
          const fileName = `export-${moment().format('YYYYMMDD-HHmmss')}`;
          exportToExcel(allList, fileName);
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
            take: queryConfig.value.maxCount || 100,
          });

          if (list.length === 0) {
            break;
          }

          allList.push(...list);
        }

        return allList;
      }

      // 获取数据库表字段 用于提示
      const tableColumns = ref<IColumn[]>([]);
      async function onDbChange(id) {
        tableColumns.value = [];
        const db = dbList.value.find(db => db.id === id);
        tableColumns.value = await api.getColumns(db);
      }

      function queryWords(str: string) {
        if (!str) return [];
        const tables = tableColumns.value.map(t => t.table);
        const columns = tableColumns.value.map(t => t.name);
        return _.chain(tables)
          .concat(columns)
          .uniq()
          .filter(t => filterBy([t], str).length > 0)
          .value();
      }

      return {
        dbList,
        queryConfig,

        loading,
        executeSQL,
        exportData,

        tableData,

        onDbChange,

        queryWords,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .sql-executor {
    display: flex;
    flex-direction: column;
    height: 100%;

    .sql-form {
      margin-bottom: 16px;

      .action-buttons {
        margin-left: auto;
      }
    }

    .sql-input-wrapper {
      flex: 0 0 auto;
      margin-bottom: 16px;

      .sql-input {
        width: 100%;
        height: 240px; // 可以根据需要调整高度
      }
    }

    .sql-result-wrapper {
      flex: 1 1 auto;
      overflow: hidden;

      .sql-result {
        height: 100%;
      }
    }
  }
</style>