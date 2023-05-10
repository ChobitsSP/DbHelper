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

<script>
  import * as UTILS from '@/utils/TableUtils/Index'
  import ClipboardInput from './ClipboardInput.vue'

  export default {
    components: {
      ClipboardInput
    },
    props: {
      type: String
    },
    computed: {
      value() {
        const cols = this.$store.state.table.columns
        const table = this.$store.state.table.table
        if (cols.length > 0) return UTILS[this.type](table, cols)
        return ''
      }
    }
  }
</script>
