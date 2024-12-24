<template>
  <el-dialog title="数据库配置"
             :visible.sync="show"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :width="width">
    <el-form ref="form"
             :model="item"
             :rules="rules"
             size="small"
             label-width="80px">
      <el-form-item label="名称"
                    prop="name">
        <el-input v-model="item.name"
                  clearable
                  placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="类型"
                    prop="providerName">
        <el-select v-model="item.providerName"
                   placeholder="请选择数据库类型">
          <el-option v-for="option in DbTypes"
                     :key="option.value"
                     :label="option.label"
                     :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="连接"
                    prop="connectionString">
        <el-input v-model="item.connectionString"
                  placeholder="请输入数据库连接字符串"
                  :rows="6"
                  type="textarea">
        </el-input>
        <a href="https://www.connectionstrings.com"
           target="_blank"
           class="el-link el-link--default">
          连接字符串参考
        </a>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="onClose"
                 size="small">取 消</el-button>
      <el-button type="primary"
                 size="small"
                 @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';

  import * as DbUtils from '@/utils/DbUtils';
  import { DbTypes } from '@/data';
  import { FormValidate, ClearValidate } from '@/mixins/FormMixins';

  import { useDialog } from '@/mixins/Dialog';

  interface OpenConfig {
    item?: any;
  }

  export default defineComponent({
    setup() {
      const form = ref();
      const model = ref(new DbUtils.MyModel);
      const rules = {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        providerName: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ],
        connectionString: [
          { required: true, message: '请输入连接字符串', trigger: 'blur' },
        ]
      };

      function FormatConstr(str: string) {
        return str.split(/[\r\n]+/).filter(t => !!t).map(t => t.replace(/;+$/g, '')).join(';');
      }

      const dialogSetup = useDialog<OpenConfig>({
        openEventName: 'ShowEditDialog',
        maxWidth: 640,
        async init(config) {
          if (config.item) {
            model.value = Object.assign(new DbUtils.MyModel, config.item);
          } else {
            model.value = new DbUtils.MyModel;
          }
          dialogSetup.show.value = true;
          await nextTick();
          ClearValidate(form.value);
        },
        async submit(config) {
          await FormValidate(form.value);
          // 替换连接字符串中的换行符
          model.value.connectionString = FormatConstr(model.value.connectionString);
          await DbUtils.DbConfigUpdate(model.value);
          config.callback();
          dialogSetup.show.value = false;
        },
      });

      return {
        ...dialogSetup,
        DbTypes,

        form,
        item: model,
        rules,
      };
    },
  });
</script>
