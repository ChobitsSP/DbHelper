<template>
  <div ref="div"
       class="sql-input">
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
  import _ from 'lodash';

  import { EditorView, basicSetup } from 'codemirror';
  import { sql } from '@codemirror/lang-sql';

  export default defineComponent({
    props: {
      value: String,
    },
    emits: ['input'],
    setup(props, { emit }) {
      const div = ref<HTMLDivElement>();

      let view: EditorView;

      onMounted(() => {
        view = new EditorView({
          parent: div.value,
          doc: props.value || '',
          extensions: [
            basicSetup,
            sql(),
            EditorView.updateListener.of((update) => {
              if (update.selectionSet || update.docChanged) {
                const selections = update.state.selection.ranges;
                for (let selection of selections) {
                  if (!selection.empty) {
                    const selectedText = update.state.sliceDoc(selection.from, selection.to);
                    emit('input', selectedText);
                  }
                  else {
                    emit('input', update.state.doc.toString());
                  }
                }
              }
            }),
          ],
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