<template>
  <el-dialog title="导出"
             :close-on-click-modal="false"
             :width="width"
             :visible.sync="show">
    <el-form :model="item"
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
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary"
                 :loading="loading"
                 @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Message } from 'element-ui';

  import axios from '@/utils/AxiosUtils';
  import { exportToExcel } from '@/utils/XlsxExport';
  import { FormModel } from './models/Index';
  import { useDialog } from '@/mixins/Dialog';

  interface OpenConfig {
    table: string;
    config: any;
  }

  export default defineComponent({
    setup() {
      const model = ref(new FormModel);
      const loading = ref(false);

      const dialogSetup = useDialog<OpenConfig>({
        openEventName: 'ShowExportDataDialog',
        maxWidth: 640,
        async init(config) {
          model.value = new FormModel;
          model.value.table = config.table;
          dialogSetup.show.value = true;
        },
        async submit(config) {
          const req = Object.assign({}, model.value, config.config);
          loading.value = true;
          try {
            const rsp = await axios.post('/api/sql/listget', req);
            if (rsp.code !== 0) throw new Error(rsp.msg);
            exportToExcel(rsp.data, config.table);
          } catch (err: any) {
            console.error(err);
            Message.error(err.message);
          } finally {
            loading.value = false;
          }
        },
      });

      return {
        ...dialogSetup,
        loading,
        item: model,
      };
    },
  });
</script>