<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-select v-model="model.dbId"
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
        <el-select v-model="model.table"
                   filterable
                   @change="onTableChange"
                   placeholder="Select Table">
          <el-option v-for="option in tableList"
                     :key="option"
                     :value="option" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input-number v-model="model.groupCount"
                         controls-position="right"
                         :min="1"
                         :max="10000"
                         :step="1"
                         placeholder="Group Count">
        </el-input-number>
      </el-form-item>
    </el-form>
    <XlsxImport :gridColumns="gridColumns"
                :importColumns="importColumns"
                :groupCount="model.groupCount"
                :upload="onUpload">
    </XlsxImport>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';

  import * as api from '@/api';
  import * as DbUtils from '@/utils/DbUtils';
  import { BuildInsertSql } from '@/utils/TableUtils';

  import XlsxImport from '@/components/XlsxImport/index.vue';

  export default defineComponent({
    components: {
      XlsxImport,
    },
    setup() {
      const model = ref({
        dbId: null,
        table: null,
        groupCount: 100,
      });

      const dbList = ref([]);
      (async function () {
        dbList.value = await DbUtils.DbConfigList();
      })();

      const tableList = ref<string[]>([]);
      const tableColumns = ref([]);

      async function onDbChange(key) {
        const db = dbList.value.find(t => t.id === key);
        tableList.value = [];
        tableList.value = await api.getTables(db);
      }

      async function onTableChange(table: string) {
        const db = dbList.value.find(t => t.id === model.value.dbId);
        tableColumns.value = [];
        tableColumns.value = await api.getColumns(db, table);
      }

      async function onUpload(rows: Record<string, string>[]) {
        const sql = rows.map(row => {
          return BuildInsertSql(model.value.table, tableColumns.value, row);
        }).join(';');
        const db = dbList.value.find(t => t.id === model.value.dbId);
        try {
          await api.ExecuteSql(db, sql);
        } catch (e) {
          console.error(e.message);
          console.log(sql);
          console.log(rows);
        }
      }

      const gridColumns = computed(() => {
        return tableColumns.value.map(t => {
          return {
            title: t.name,
            field: t.name,
            width: 120,
          };
        });
      });

      const importColumns = computed(() => {
        return tableColumns.value.map(t => {
          return {
            label: t.name,
            prop: t.name,
          };
        });
      });

      return {
        model,

        dbList,
        tableList,

        onDbChange,
        onTableChange,
        onUpload,

        gridColumns,
        importColumns,
      };
    },
  });
</script>