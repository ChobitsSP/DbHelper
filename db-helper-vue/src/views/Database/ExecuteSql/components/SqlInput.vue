<template>
  <div contenteditable="true"
       ref="div"
       class="sql-input">
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';
  import _ from 'lodash';

  export default defineComponent({
    props: {
      value: String,
    },
    emits: ['input'],
    setup(props) {
      const div = ref<HTMLDivElement>();

      return {
        div,
      };
    },
  });
</script>

<style scoped>
  .sql-input {
    height: 100%;
    padding: 10px;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: auto;
  }
</style>