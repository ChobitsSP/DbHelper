<template>
  <TableInfo :table-name="name"
             @refresh="init"></TableInfo>
</template>

<script>
  import * as DbUtils from '@/utils/DbUtils';
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
        this.$store.commit('SET_CONINFO', config);
        const data = Object.assign({ table: this.name }, config);
        await this.$store.dispatch('getColumns', data);
      }
    }
  }
</script>
