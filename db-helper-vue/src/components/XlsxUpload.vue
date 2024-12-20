<template>
  <div>
    <input type="file"
           ref="fileInput"
           class="file-input"
           accept=".xlsx"
           @change="handleFileChange" />

  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { LoadRows } from '@/mixins/XlsxImport';

  export default defineComponent({
    props: {
      columns: Array,
    },
    emits: ['input'],
    setup(props, context) {
      async function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          const rows = await LoadRows(file, props.columns as any[]);
          context.emit('input', rows);
        }
      }
      return {
        handleFileChange,
      };
    },
  });
</script>

<style scoped>
  .file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
</style>