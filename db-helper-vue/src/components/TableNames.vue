<template>
  <el-select v-model="value" :loading="loading" filterable @change="change" placeholder="请选择">
    <el-option v-for="option in options"
               :key="option"
               :label="option"
               :value="option">
    </el-option>
  </el-select>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        loading: false,
        options: [],
        value: ''
      }
    },
    created() {
      this.query()
    },
    methods: {
      async query() {
        this.loading = true
        this.options = await axios.post('/api/sql/tablenames', this.coninfo)
        this.loading = false
      },
      change(val) {
        this.$emit('change', val)
      }
    },
    computed: {
      coninfo() {
        return this.$store.state.user.coninfo
      }
    }
  }
</script>
