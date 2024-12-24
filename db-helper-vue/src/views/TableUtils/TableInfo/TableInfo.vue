<template>
  <div>
    <el-row>
      <el-form inline
               size="small">
        <el-form-item>
          <el-button type="primary"
                     @click="$emit('refresh')">刷新</el-button>
          <el-button type="success"
                     @click="ExportTable">导出</el-button>
          <el-button type="success"
                     @click="ExportList">导出数据</el-button>
          <XlsxUpload :loading="loading"
                      style="margin-left:10px;"
                      label="导入"
                      @input="ImportData"></XlsxUpload>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isHump">isHump</el-checkbox>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <TableTabs></TableTabs>
    </el-row>
    <el-row>
      <vxe-table class="my-table"
                 :loading="loading"
                 :row-config="{ keyField: 'id' }"
                 :data="tableData"
                 style="width: 100%">
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
    </el-row>
    <el-row>
      <TempEditor :tablename="$route.params.table"></TempEditor>
    </el-row>
    <ExportDataDialog></ExportDataDialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Message } from 'element-ui';

  import { useMainStore } from '@/store/main';

  import TableTabs from '@/components/TableTabs.vue'
  import ExportDataDialog from '@/components/ExportModal/Index.vue'
  import TempEditor from '@/components/TempEditor/Index.vue'
  import XlsxUpload from '@/components/XlsxUpload.vue'
  import axios from '@/utils/AxiosUtils';
  import { RowTypeTrans } from '@/utils/ImportDataUtils';

  import { ColumnsExport } from '@/utils/FileUtils';
  import { useRx } from '@/mixins/RxBusMixins';

  export default defineComponent({
    components: {
      TableTabs,
      ExportDataDialog,
      TempEditor,
      XlsxUpload,
    },
    props: {
      tableName: String,
    },
    setup(props) {
      const rxHub = useRx();
      const { coninfo, columns: tableData, isHump } = useMainStore();

      const loading = ref(false);

      const ExportTable = () => {
        ColumnsExport(tableData.value, props.tableName);
      };

      const ExportList = () => {
        rxHub.emit('ShowExportDataDialog', {
          table: props.tableName,
          config: coninfo.value,
        });
      };

      const ImportData = async (rows: any[]) => {
        if (rows.length === 0) return;
        const list = RowTypeTrans(rows, tableData.value);

        const params = {
          ...coninfo.value,
          table: props.tableName,
          import_cols: Object.keys(list[0]),
          import_datas: list,
        };

        loading.value = true;

        try {
          const rsp = await axios.post('/api/sql/TableDataAdd', params);
          if (rsp.code !== 0) throw new Error(rsp.msg);
        } catch (err: any) {
          Message.error(err.message);
        }
        finally {
          loading.value = false;
        }
      };

      return {
        loading,
        coninfo,
        tableData,
        isHump,

        ExportTable,
        ExportList,
        ImportData,
      };
    },
  });
</script>