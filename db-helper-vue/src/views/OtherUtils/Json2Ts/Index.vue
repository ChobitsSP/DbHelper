<template>
  <div>
    <el-input type="textarea"
              v-model="txt"></el-input>
    <el-input type="textarea"
              readonly
              :value="result"></el-input>
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