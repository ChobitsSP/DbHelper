<template>
  <div>
    <el-input type="textarea"
              :rows="10"
              v-model="tempstr"></el-input>
    <component :is="MyCom"></component>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { defineComponent } from 'vue';

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
    }
  }
</script>
