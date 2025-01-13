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
      <el-form-item label="连接类型">
        <el-radio-group v-model="connectType">
          <el-radio label="1">数据库连接字符串</el-radio>
          <el-radio label="2">请求地址</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="connectType === '1'"
                    label="连接"
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
      <template v-else>
        <el-form-item label="请求地址"
                      prop="api_url">
          <el-input v-model="item.api_url"
                    clearable
                    placeholder="请输入请求地址">
          </el-input>
        </el-form-item>
        <el-form-item label="请求密钥"
                      prop="api_secret">
          <el-input v-model="item.api_secret"
                    type="password"
                    show-password
                    clearable
                    placeholder="请输入请求密钥">
          </el-input>
        </el-form-item>
      </template>
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
  import { defineComponent, ref, nextTick, computed } from 'vue';
  import _ from 'lodash';

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

      // 1 为数据库连接字符串，2 为请求地址
      const connectType = ref('1');

      const rules = computed(() => {
        return {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          providerName: [
            { required: true, message: '请选择类型', trigger: 'change' },
          ],
          connectionString: [
            { required: true, message: '请输入连接字符串', trigger: 'blur' },
          ],
          api_url: [
            { required: true, message: '请输入请求地址', trigger: 'blur' },
          ],
          api_secret: [
            { required: true, message: '请输入请求密钥', trigger: 'blur' },
          ],
        };
      });

      function FormatConstr(str: string) {
        return str.split(/[\r\n]+/).filter(t => !!t).map(t => t.replace(/;+$/g, '')).join(';');
      }

      const dialogSetup = useDialog<OpenConfig>({
        openEventName: 'ShowEditDialog',
        maxWidth: 640,
        async init(config) {
          if (config.item) {
            model.value = Object.assign(new DbUtils.MyModel, config.item);
            if (model.value.connectionString) {
              model.value.connectionString = model.value.connectionString.split(';').join(';\n');
            }
            connectType.value = model.value.api_url ? '2' : '1';
          } else {
            model.value = new DbUtils.MyModel;
            connectType.value = '1';
          }
          dialogSetup.show.value = true;
          await nextTick();
          ClearValidate(form.value);
        },
        async submit(config) {
          await FormValidate(form.value);
          const item = _.cloneDeep(model.value);
          item.connectionString = FormatConstr(item.connectionString);
          await DbUtils.DbConfigUpdate(item);
          config.callback(item);
          dialogSetup.show.value = false;
        },
      });

      return {
        ...dialogSetup,
        DbTypes,

        form,
        item: model,
        rules,
        connectType,
      };
    },
  });
</script>
