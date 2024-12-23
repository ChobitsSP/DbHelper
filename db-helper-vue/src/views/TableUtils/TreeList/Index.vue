<template>
  <el-container>
    <el-aside width="300px">
      <LeftTree></LeftTree>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import LeftTree from '../TableInfo/components/LeftTree.vue';
  export default defineComponent({
    components: {
      LeftTree,
    },
  });
</script>