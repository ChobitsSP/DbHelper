<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="name"
                 v-for="name in names"
                 :key="name"
                 :name="name">
    </el-tab-pane>
    <com1 v-if="activeName != null"
          :type="activeName"></com1>
  </el-tabs>
</template>

<script>
  import * as UTILS from '@/utils/TableUtils/Index.ts'
  import com1 from './TableAspxGridView'

  export default {
    components: {
      com1
    },
    data() {
      return {
        activeName: null,
        names: [],
      }
    },
    created() {
      this.names = Object.keys(UTILS)
      this.activeName = this.names[0]
    }
  }
</script>
