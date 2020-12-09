<template>
  <div>
    <el-input type="textarea"
              :rows="10"
              v-model="tempstr"></el-input>
    <component :is="MyCom"></component>
  </div>
</template>

<script>
  export default {
    props: {
      tablename: String
    },
    data() {
      return {
        tempstr: `<div>
  <div v-for="col in cols" :key="col.name">
    {{ col.name }}
  </div>
</div>`
      }
    },
    computed: {
      MyCom() {
        const com = Vue.extend({
          template: this.tempstr,
          computed: {
            cols() {
              return this.$store.state.table.columns
            }
          }
        });

        return com;
      }
    },
    filters: {
      hump(name) {
        return name
          .replace(/_([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })
          .replace(/^[a-z]/g, (g) => g.toUpperCase());
      }
    }
  }
</script>
