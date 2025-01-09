<template>
  <div class="json-to-ts-converter">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input class="converter-textarea"
                  type="textarea"
                  :rows="30"
                  placeholder="Input JSON string"
                  v-model="txt"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input class="converter-textarea"
                  type="textarea"
                  readonly
                  :rows="30"
                  placeholder="Output TypeScript interface"
                  :value="result"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .json-to-ts-converter {
    padding: 20px;

    .converter-textarea {
      width: 100%;

      :deep(.el-textarea__inner) {
        font-family: "Courier New", Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        padding: 10px;
        border-radius: 4px;
        resize: vertical;
      }
    }
  }
</style>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import * as Json2TsUtils from './utils/Json2TsUtils';

  export default defineComponent({
    setup() {
      const txt = ref('');
      const result = computed(() => {
        try {
          return Json2TsUtils.convert(txt.value);
        }
        catch (err) {
          return '';
        }
      });

      return {
        txt,
        result
      };
    },
  });
</script>