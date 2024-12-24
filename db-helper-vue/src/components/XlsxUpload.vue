<template>
  <div class="excel-uploader">
    <input type="file"
           ref="fileInput"
           class="excel-uploader__input"
           accept=".xlsx"
           @change="handleFileChange" />
    <el-button class="excel-uploader__button"
               type="primary"
               :loading="loading"
               :size="size"
               @click="triggerFileInput">
      {{ label }}
    </el-button>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { LoadRows } from '@/mixins/XlsxImport';
  import { ExportColumnInfos } from '@/data/index';

  export default defineComponent({
    props: {
      columns: {
        type: Array,
        default: () => ExportColumnInfos,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: 'small',
      },
      label: {
        type: String,
        default: '上传Excel',
      },
    },
    emits: ['input'],
    setup(props, context) {
      const fileInput = ref<HTMLInputElement>();

      async function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          const rows = await LoadRows(file, props.columns as any[]);
          context.emit('input', rows);
        }
      }
      return {
        fileInput,
        handleFileChange,
        triggerFileInput() {
          fileInput.value.click();
        },
      };
    },
  });
</script>

<style lang="scss" scoped>
  .excel-uploader {
    display: inline-block;

    &__input {
      display: none;
    }
  }
</style>