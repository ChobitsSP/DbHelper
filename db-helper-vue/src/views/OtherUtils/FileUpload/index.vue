<template>
  <div>
    <input type="file"
           ref="fileInput" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { ResumableUpload } from '@/utils/UploadUtils';

  export default defineComponent({
    setup() {
      const fileInput = ref<HTMLInputElement>();
      onMounted(() => {
        ResumableUpload(fileInput.value);
      });
      return {
        fileInput,
      };
    },
  });
</script>