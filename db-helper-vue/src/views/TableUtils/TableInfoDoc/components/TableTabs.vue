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

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { AllFunctions } from '@/utils/TableUtils/Index'
  import com1 from '@/components/TableAspxGridView.vue'

  export default defineComponent({
    components: {
      com1
    },
    setup() {
      const names = AllFunctions.map(t => t.label);
      const activeName = ref(names[0]);
      return {
        activeName,
        names,
      };
    },
  });
</script>