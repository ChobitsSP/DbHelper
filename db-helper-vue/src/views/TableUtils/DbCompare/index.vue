<template>
  <div>
    <el-form size="small"
             :disabled="loading">
      <el-form-item label="数据库1">
        <el-select v-model="model.dbId1"
                   placeholder="请选择数据库">
          <el-option v-for="option in dbList"
                     :key="option.id"
                     :label="option.name"
                     :value="option.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="model.dbId1"
                    label="数据库2"
                    class="comparison-form-item">
        <div class="comparison-options">
          <div class="comparison-option database-select">
            <el-select v-model="model.dbId2"
                       placeholder="请选择数据库"
                       class="db-select">
              <el-option v-for="option in dbList"
                         :key="option.id"
                         :label="option.name"
                         :value="option.id">
              </el-option>
            </el-select>
            <el-button type="primary"
                       :disabled="!model.dbId2"
                       :loading="loading"
                       @click="onCompare"
                       class="compare-btn">
              对比
            </el-button>
          </div>
          <div class="comparison-option file-upload">
            <XlsxUpload @input="onUpload"
                        label="上传文件对比"
                        class="xlsx-upload"></XlsxUpload>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <ShowDiff v-if="dbType"
              :loading="loading"
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
  import { IColumn } from '@/models/Index';

  class MyModel {
    dbId1: number = null;
    dbId2: number = null;
  }

  export default defineComponent({
    components: {
      XlsxUpload,
      ShowDiff,
    },
    setup() {
      const loading = ref(false);
      const dbList = ref([]);
      const dbType = ref();

      const model = ref(new MyModel);

      DbUtils.DbConfigList().then(list => {
        dbList.value = list;
      });

      const missingTables = ref([]);
      const typeMismatchColumns = ref([]);
      const missingColumns = ref([]);
      function getCompareResult(list1: IColumn[], list2: IColumn[]) {
        const result = GetDataBaseDiff(list1, list2);
        missingTables.value = result.missingTables;
        typeMismatchColumns.value = result.typeMismatchColumns;
        missingColumns.value = result.missingColumns;
      }

      async function onUpload(list2: IColumn[]) {
        loading.value = true;
        try {
          const { config, columns: list1 } = await getInfoById(model.value.dbId1);
          getCompareResult(list1, list2);
          dbType.value = config.providerName;
        } catch (err: any) {
          console.error(err);
        } finally {
          loading.value = false;
        }
      }

      async function getInfoById(dbId: number) {
        const config = await DbUtils.DbConfigGet(dbId);
        const columns = await getColumns(config);
        return {
          config,
          columns,
        };
      }

      async function onCompare() {
        loading.value = true;
        try {
          const [info1, info2] = await Promise.all([
            getInfoById(model.value.dbId1),
            getInfoById(model.value.dbId2),
          ]);
          getCompareResult(info1.columns, info2.columns);
          dbType.value = info1.config.providerName;
        } catch (err: any) {
          console.error(err);
        } finally {
          loading.value = false;
        }
      }

      return {
        dbList,
        dbType,

        model,

        loading,
        missingTables,
        typeMismatchColumns,
        missingColumns,

        onUpload,
        onCompare,
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

  .comparison-form-item {
    .comparison-options {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .comparison-option {
        display: flex;
        align-items: center;
        gap: 10px;

        &.file-upload {
          .option-label {
            margin-right: 10px;
          }

          // .xlsx-upload {
          //   // 自定义上传组件样式
          // }
        }

        &.database-select {
          .db-select {
            width: 200px;
            margin-right: 10px;
          }

          .compare-btn {
            min-width: 80px;
          }
        }
      }
    }
  }
</style>