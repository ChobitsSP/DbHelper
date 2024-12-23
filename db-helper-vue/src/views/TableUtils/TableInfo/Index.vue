<template>
  <el-container>
    <el-aside width="300px">
      <LeftTree @change="onChange"></LeftTree>
    </el-aside>
    <el-main>
      <TableInfo v-if="tableName"
                 :table-name="tableName"
                 @refresh="init"></TableInfo>
    </el-main>
  </el-container>
</template>

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

      async function onChange(obj) {
        const config = await DbUtils.DbConfigGet(obj.id);
        store.commit('SET_CONINFO', config);
        const data = Object.assign({ table: obj.name }, config);
        await store.dispatch('getColumns', data);
        tableName.value = obj.name;
      }

      return {
        init() {
          // ::todo
        },
        onChange,
        tableName,
      };
    },
  });
</script>
