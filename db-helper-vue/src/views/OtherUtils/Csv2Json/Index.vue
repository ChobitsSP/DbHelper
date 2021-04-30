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

<script>
  import { CSVToArray } from "./utils/Index.ts";

  export default {
    data() {
      return {
        csvstr: null,
      }
    },
    methods: {
      get_type(type, nullable) {
        switch (type) {
          case 'VARCHAR2':
            return 'string'
          case 'INTEGER':
            return 'int' + (nullable ? '?' : '')
          case 'DATE':
            return 'int' + (nullable ? '?' : '')
          case 'NUMBER':
            return 'int' + (nullable ? '?' : '')
          default:
            return 'string'
        }
      }
    },
    computed: {
      fields() {
        let result = []

        let arr = CSVToArray(this.csvstr, '\t')

        if (arr.length > 0) {
          let columns = arr[0]

          for (let i = 1; i < arr.length; i++) {
            let row = arr[i]

            let field = {}

            for (let j = 0; j < columns.length; j++) {
              let column = columns[j]
              let val = row[j]

              if (/^\d+$/.test(val)) {
                val = Number(val)
              }

              field[column] = val
            }

            result.push(field)
          }
        }

        return result
      },
      json() {
        return JSON.stringify(this.fields)
      }
    }
  }
</script>

<style>
</style>