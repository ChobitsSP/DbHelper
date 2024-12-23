<template>
  <div class="database-diff">
    <div class="missing-tables">
      <div class="insert-sql">
        <h4>缺少的表:</h4>
        <el-input type="textarea"
                  :rows="4"
                  :value="tableNames"
                  readonly
                  class="sql-textarea"></el-input>
      </div>
    </div>
    <div class="missing-columns">
      <h3>缺少的列:</h3>
      <div class="insert-sql">
        <h4>插入SQL语句:</h4>
        <el-input type="textarea"
                  :rows="4"
                  :value="insertSQL"
                  readonly
                  class="sql-textarea"></el-input>
      </div>
      <vxe-table :loading="loading"
                 :data="missingColumns"
                 class="diff-table"
                 style="width: 100%">
        <vxe-column field="table"
                    title="表名"
                    sortable
                    width="200"></vxe-column>
        <vxe-column field="id"
                    title="id"
                    sortable
                    width="75"></vxe-column>
        <vxe-column field="name"
                    title="列名"
                    sortable
                    width="200"></vxe-column>
        <vxe-column field="type"
                    title="类型"
                    sortable
                    width="100"></vxe-column>
        <vxe-column field="character_maximum_length"
                    title="长度"
                    sortable
                    width="100"></vxe-column>
        <vxe-column field="numeric_precision"
                    title="数字长度"
                    sortable
                    width="100"></vxe-column>
        <vxe-column field="numeric_scale"
                    title="小数位数"
                    sortable
                    width="100"></vxe-column>
        <vxe-column field="null_able"
                    sortable
                    title="可空"
                    width="100">
          <template #default="{ row }">
            <el-checkbox :value="row.null_able"></el-checkbox>
          </template>
        </vxe-column>
        <vxe-column field="comments"
                    title="注释"
                    sortable></vxe-column>
      </vxe-table>
    </div>
    <div class="type-mismatch">
      <h3>类型不一致的列:</h3>
      <vxe-table :loading="loading"
                 :data="typeMismatchColumns"
                 class="diff-table"
                 style="width: 100%">
        <vxe-column field="table"
                    title="表名"
                    sortable
                    width="200"></vxe-column>
        <vxe-column field="id"
                    title="id"
                    sortable
                    width="75"></vxe-column>
        <vxe-column field="name"
                    title="列名"
                    sortable
                    width="200"></vxe-column>
        <vxe-column field="type"
                    title="类型"
                    sortable
                    width="100"></vxe-column>
        <vxe-column field="type2"
                    title="类型2"
                    sortable
                    width="100"></vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';

  import { GetAlertSql } from '@/utils/TableUtils/AlertColumn';

  export default defineComponent({
    props: {
      loading: Boolean,
      dbType: String,
      missingTables: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      missingColumns: {
        type: Array as PropType<any[]>,
        default: () => [],
      },
      typeMismatchColumns: {
        type: Array,
        default: () => [],
      },
    },
    setup(props) {
      const tableNames = computed(() => props.missingTables.join('\r\n'));
      const insertSQL = computed(() => props.missingColumns.map(col => GetAlertSql(props.dbType, col.table, col)).join('\r\n'));
      return {
        tableNames,
        insertSQL,
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