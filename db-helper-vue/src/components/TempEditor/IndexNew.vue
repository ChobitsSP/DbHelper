<template>
  <div class="input-converter">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input class="converter-textarea"
                  type="textarea"
                  :rows="10"
                  placeholder="vue template"
                  v-model="tempstr"></el-input>
      </el-col>
      <el-col :span="12">
        <component :is="MyCom"></component>
        <!-- <el-input class="converter-textarea"
                  type="textarea"
                  readonly
                  :rows="10"
                  placeholder="render result"
                  :value="renderHtml"></el-input> -->
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .input-converter {
    padding: 20px;

    .converter-textarea {
      width: 100%;

      :deep(.el-textarea__inner) {
        font-family: "Courier New", Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        padding: 10px;
        border-radius: 4px;
        resize: vertical;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import { defineComponent, ref, computed } from 'vue';
  import _ from 'lodash';

  export default defineComponent({
    props: {
      columns: Array,
    },
    setup(props) {
      const tempstr = ref(`<div>
  <div v-for="col in cols" :key="col.name">
    {{ col.name }}
  </div>
</div>`);

      const MyCom = computed(() => Vue.extend({
        template: tempstr.value,
        computed: {
          cols: () => props.columns,
        }
      }));

      // get render html string
      const renderHtml = computed(() => {
        // const com = Vue.extend({
        //   template: tempstr.value,
        //   data() {
        //     return {
        //       cols: _.cloneDeep(props.columns),
        //     };
        //   },
        // });
        const dom = document.createElement('div');

        new Vue({
          template: tempstr.value,
          data() {
            return {
              cols: _.cloneDeep(props.columns),
            };
          },
        }).$mount(dom);

        console.log(dom.outerHTML);
        return dom.outerHTML;
      });

      return {
        tempstr,
        renderHtml,
        MyCom,
      };
    },
  });
</script>
