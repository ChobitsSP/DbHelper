<template>
  <div contenteditable="true"
       ref="div"
       class="sql-input">
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
  import _ from 'lodash';

  import { EditorView, basicSetup } from "codemirror"
  import { sql } from "@codemirror/lang-sql"

  export default defineComponent({
    props: {
      value: String,
    },
    emits: ['input'],
    setup(props) {
      const div = ref<HTMLDivElement>();

      let view: EditorView;

      onMounted(() => {
        view = new EditorView({
          parent: div.value,
          doc: `select * from users where age > 20`,
          extensions: [basicSetup, sql()]
        });
      });

      onUnmounted(() => {
        view.destroy();
      });

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