<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input type="textarea"
                  :rows="rows"
                  v-model="csvstr"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea"
                  readonly
                  :rows="rows"
                  :value="json"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { GetObjectList } from './utils/Index';

  export default defineComponent({
    setup() {
      const csvString = ref('');
      const json = computed(() => JSON.stringify(GetObjectList(csvString.value)));
      return {
        csvstr: csvString,
        json,
        rows: 30,
      };
    },
  });
</script>