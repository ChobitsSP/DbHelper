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
  import { ExportJson } from '@/utils/FileUtils';

  import { FormModel } from './models/Index';

  import store from '@/store/index';
  import { useDialog } from '@/mixins/Dialog';
  import { useRoute } from '@/router';

  export default defineComponent({
    setup() {
      const route = useRoute();
      const model = ref(new FormModel);
      const loading = ref(false);

      const dialogSetup = useDialog({
        maxWidth: 640,
        async init() {
          model.value = new FormModel;
          model.value.table = route.params.table;
          dialogSetup.show.value = true;
        },
        async submit() {
          const req = Object.assign({ table: '' }, model.value, store.state.user.coninfo);
          req.table = store.state.table.table;

          loading.value = true;
          try {
            const rsp = await axios.post('/api/sql/listget', req);
            if (rsp.code !== 0) throw new Error(rsp.msg);
            ExportJson(req.table, rsp.data);
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