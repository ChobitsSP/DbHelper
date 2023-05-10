<template>
  <el-form label-width="80px">
    <el-form-item label="复制">
      <ClipboardInput :value="value"
                      style="width:200px;"></ClipboardInput>
    </el-form-item>
    <el-form-item label="结果">
      <el-input type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :readonly="true"
                placeholder="请输入内容"
                :value="value">
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import _ from 'lodash';

  import * as UTILS from '@/utils/TableUtils/Index';
  import ClipboardInput from './ClipboardInput.vue';
  import { useMainStore } from '@/store/main';
  import { hump2 } from '@/filters/Index';

  type Func = (name: string, cols: any) => string;

  export default defineComponent({
    components: {
      ClipboardInput
    },
    props: {
      type: String
    },
    setup(props) {
      const { columns, tableName, isHump } = useMainStore();

      const value = computed<string>(() => {
        const func: Func = UTILS[props.type];

        let cols = columns.value;

        if (isHump.value) {
          cols = _.cloneDeep(cols);
          cols.forEach(t => {
            t.name = hump2(t.name);
          });
        }

        return func(tableName.value, cols);
      });

      return {
        value,
      };
    },
  });
</script>