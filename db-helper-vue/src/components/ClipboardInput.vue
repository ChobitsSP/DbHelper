<template>
  <el-input :value="value"
            readonly
            @click.native="selectAll">
    <el-button ref="btn"
               slot="append"
               icon="document">复制</el-button>
  </el-input>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, nextTick, onUnmounted } from 'vue';
  import Clipboard from 'clipboard';
  import { Message as ElMessage } from 'element-ui';

  export default defineComponent({
    props: {
      value: String
    },
    setup(props) {
      const btn = ref();

      let clipboard = null;

      onMounted(async () => {
        await nextTick();

        clipboard = new Clipboard(btn.value.$el, {
          text: (_trigger) => {
            return props.value;
          }
        });

        clipboard.on('success', (_e) => {
          ElMessage.success('复制成功');
        });
      });

      onUnmounted(() => {
        clipboard && clipboard.destroy();
      });

      function selectAll(e: PointerEvent) {
        const input = e.target as any;
        if (input.select) {
          input.select();
        }
      }

      return {
        btn,
        selectAll,
      };
    },
  });
</script>