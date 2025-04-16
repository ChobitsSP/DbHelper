<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input type="textarea"
                  :rows="rows"
                  placeholder="Input CSV string"
                  v-model="csvstr"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea"
                  readonly
                  :rows="rows"
                  placeholder="Output C# property string"
                  :value="result"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { CSVToArray } from '../Csv2Json/utils/Index';

  export default defineComponent({
    setup() {
      const csvString = ref('');
      const result = computed(() => {
        return CSVToArray(csvString.value, '\t').map(row => {
          const field = row[0] || '';
          const type = row[1] || '';
          const comment = row[2] || '';

          let arr: string[] = [];

          if (comment) {
            arr.push(`/// <summary>`);
            arr = arr.concat(comment.split(/[\r\n]+/).map(t => `/// ${t}`));
            arr.push(`/// </summary>`);
          }

          arr.push(`public ${type} ${field} { get; set; }`);
          arr.push('');

          return arr.join('\r\n');
        }).join('\r\n');
      });
      return {
        csvstr: csvString,
        result,
        rows: 30,
      };
    },
  });
</script>