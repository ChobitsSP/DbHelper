<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input type="textarea"
                  :rows="30"
                  placeholder="Input JSON string"
                  v-model="txt"></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea"
                  readonly
                  :rows="30"
                  placeholder="Output TypeScript interface"
                  :value="result"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as Json2TsUtils from "./utils/Json2TsUtils.ts";

  export default {
    data() {
      return {
        txt: ''
      }
    },
    computed: {
      result() {
        try {
          return Json2TsUtils.convert(this.txt);
        }
        catch (err) {
          return '';
        }
      }
    }
  }
</script>

<style>
</style>