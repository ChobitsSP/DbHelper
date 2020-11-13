<template>
  <TableInfo @refresh="init"></TableInfo>
</template>

<script>
  import * as DbUtils from '@/utils/DbUtils.ts';
  import TableInfo from './TableInfo.vue';

  export default {
    components: {
      TableInfo
    },
    props: {
      id: Number,
      name: String
    },
    created() {
      this.init();
    },
    watch: {
      '$route': 'init'
    },
    methods: {
      async init() {
        const config = await DbUtils.DbConfigGet(this.id);
        const data = Object.assign({ table: this.name }, config);
        await this.$store.dispatch('getColumns', data);
      }
    }
  }
</script>
