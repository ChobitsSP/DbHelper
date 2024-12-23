<template>
  <el-container class="my-container">
    <el-aside width="300px">
      <LeftTree v-loading="loading"
                @change="onChange"></LeftTree>
    </el-aside>
    <el-main>
      <TableInfo v-if="tableName"
                 v-loading="loading"
                 :table-name="tableName"
                 @refresh="refresh"></TableInfo>
    </el-main>
  </el-container>
</template>

<style scoped>
  .my-container {
    height: calc(100vh - 100px);
  }
</style>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import * as DbUtils from '@/utils/DbUtils';
  import store from '@/store';

  import LeftTree from './components/LeftTree.vue';
  import TableInfo from './TableInfo.vue';

  export default defineComponent({
    components: {
      LeftTree,
      TableInfo,
    },
    setup() {
      const tableName = ref('');
      const loading = ref(false);

      interface NodeInfo {
        id: number;
        name: string;
      }

      let node: NodeInfo = null;

      async function refresh() {
        if (node == null) return;

        loading.value = true;

        try {
          const config = await DbUtils.DbConfigGet(node.id);
          store.commit('SET_CONINFO', config);
          const data = Object.assign({ table: node.name }, config);
          await store.dispatch('getColumns', data);
          tableName.value = node.name;

        } catch (err: any) {
          console.error(err);
        } finally {
          loading.value = false;
        }
      }

      async function onChange(obj) {
        node = obj;
        await refresh();
      }

      return {
        refresh,
        onChange,
        tableName,
        loading,
      };
    },
  });
</script>
