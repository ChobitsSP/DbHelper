<template>
  <TableNames @change="change"></TableNames>
</template>

<script>
  import TableNames from '@/components/TableNames'

  export default {
    methods: {
      change(val) {
        this.$router.push({ name: 'TableInfo', params: { table: val } })
      }
    },
    components: {
      TableNames
    }
  }
</script>
