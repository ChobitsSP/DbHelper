<template>
  <el-tabs v-model="activeName">
    <el-tab-pane :label="name"
                 v-for="name in names"
                 :key="name"
                 :name="name">
    </el-tab-pane>
    <TableAutoUtilCom v-if="activeName != null"
                      :type="activeName">
    </TableAutoUtilCom>
  </el-tabs>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import * as UTILS from '@/utils/TableUtils/Index'
  import TableAutoUtilCom from './TableAspxGridView.vue'

  export default defineComponent({
    components: {
      TableAutoUtilCom,
    },
    setup() {
      const names = ref(Object.keys(UTILS));
      const activeName = ref(names.value[0]);

      return {
        activeName,
        names,
      };
    },
  });
</script>