<template>
  <div ref="div"
       class="sql-input">
  </div>
</template>

<style lang="scss" scoped>
  .sql-input {
    :deep(.cm-editor) {
      height: 100%;
    }
  }
</style>

<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted, PropType } from 'vue';
  import _ from 'lodash';

  import { EditorView, basicSetup } from 'codemirror';
  import { sql } from '@codemirror/lang-sql';

  import { autocompletion, CompletionContext } from '@codemirror/autocomplete';

  export default defineComponent({
    props: {
      value: String,
      autocompletion: {
        type: Function as PropType<(str: string) => string[]>,
        default: () => [],
      },
    },
    emits: ['input'],
    setup(props, { emit }) {
      const div = ref<HTMLDivElement>();

      let view: EditorView;

      function myCompletions(context: CompletionContext) {
        let word = context.matchBefore(/\w*/);
        if (word === null) return null;
        if (word.from === word.to && !context.explicit) return null;

        const options = props.autocompletion(word.text).map(t => ({
          label: t,
          apply: () => t,
        }));

        return {
          from: word.from,
          options: options,
        };
      }

      onMounted(() => {
        view = new EditorView({
          parent: div.value,
          doc: props.value || '',
          extensions: [
            basicSetup,
            sql(),
            autocompletion({
              override: [myCompletions]
            }),
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