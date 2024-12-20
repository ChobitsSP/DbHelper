<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input type="textarea"
                  :rows="30"
                  v-model="csvstr"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea"
                  readonly
                  :rows="30"
                  :value="json"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { CSVToArray } from './utils/Index';

  function GetObjectList(csvString: string) {
    const result: Record<string, any>[] = [];
    const arr = CSVToArray(csvString, '\t');

    if (arr.length > 0) {
      const columns = arr[0]

      for (let i = 1; i < arr.length; i++) {
        const row = arr[i];
        const field: Record<string, any> = {};

        for (let j = 0; j < columns.length; j++) {
          let column = columns[j]
          let val = row[j]

          if (/^\d+$/.test(val)) {
            val = Number(val)
          }

          field[column] = val;
        }

        result.push(field)
      }
    }

    return result;
  }

  export default defineComponent({
    setup() {
      const csvString = ref('');
      const json = computed(() => JSON.stringify(GetObjectList(csvString.value)));

      return {
        csvstr: csvString,
        json,
      };
    },
  });
</script>