<template>
  <el-container class="home">
    <el-header>
      <NavHeader></NavHeader>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import NavHeader from './NavHeader.vue';

  export default defineComponent({
    name: 'Home',
    components: {
      NavHeader,
    },
  });
</script>

<style scoped>
  .home {
    height: 100%;
  }
</style>