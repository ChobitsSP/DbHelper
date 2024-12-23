<template>
  <div>
    <el-form size="small"
             :disabled="loading">
      <el-form-item label="数据库1">
        <el-select v-model="dbId"
                   placeholder="请选择数据库">
          <el-option v-for="option in dbList"
                     :key="option.id"
                     :label="option.name"
                     :value="option.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dbId"
                    label="数据库2">
        <XlsxUpload @input="onUpload"></XlsxUpload>
      </el-form-item>
    </el-form>
    <ShowDiff :loading="loading"
              :dbType="dbType"
              :missingTables="missingTables"
              :missingColumns="missingColumns"
              :typeMismatchColumns="typeMismatchColumns">
    </ShowDiff>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import * as DbUtils from '@/utils/DbUtils';
  import XlsxUpload from '@/components/XlsxUpload.vue';

  import { GetDataBaseDiff } from './utils/Compare';

  import { getColumns } from '@/api';

  import ShowDiff from './components/ShowDiff.vue';

  export default defineComponent({
    components: {
      XlsxUpload,
      ShowDiff,
    },
    setup() {
      const loading = ref(false);
      const dbList = ref([]);
      const dbId = ref();

      DbUtils.DbConfigList().then(list => {
        dbList.value = list;
      });

      const missingTables = ref([]);
      const typeMismatchColumns = ref([]);
      const missingColumns = ref([]);
      const dbType = ref();

      return {
        dbId,
        dbList,
        dbType,

        loading,
        missingTables,
        typeMismatchColumns,
        missingColumns,

        async onUpload(list1) {
          loading.value = true;

          try {
            const config = await DbUtils.DbConfigGet(dbId.value);
            dbType.value = config.providerName;
            const list2 = await getColumns(config);
            const result = GetDataBaseDiff(list1, list2);
            missingTables.value = result.missingTables;
            typeMismatchColumns.value = result.typeMismatchColumns;
            missingColumns.value = result.missingColumns;
          } catch (err: any) {
            console.error(err);
          } finally {
            loading.value = false;
          }
        },
      };
    },
  });
</script>

<style lang="scss" scoped>
  .database-diff {
    padding: 20px;

    .missing-tables,
    .missing-columns,
    .type-mismatch {
      margin-bottom: 20px;

      h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }
    }

    .missing-tables {
      .missing-table-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }

    .insert-sql {
      background-color: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 15px;

      h4 {
        margin-top: 0;
        margin-bottom: 10px;
      }

      .sql-textarea {
        width: 100%;
      }
    }

    .diff-table {
      border: 1px solid #ebeef5;
      border-radius: 4px;

      ::v-deep .vxe-table--header-wrapper {
        background-color: #f5f7fa;
      }

      ::v-deep .vxe-body--row {
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
</style>