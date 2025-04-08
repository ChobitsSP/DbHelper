<template>
  <div>
    <div>
      <div class="input-button"
           v-loading="loading">
        <input type="file"
               ref="fileInput" />
        <el-button type="primary">Upload</el-button>
      </div>
      <div class="upload-progress">{{ uploadedChunks }}/{{ totalChunks }}</div>
      <el-button v-if="loading"
                 type="danger"
                 @click="onCancel">Cancel</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .input-button {
    position: relative;
    display: inline-block;
    cursor: pointer;

    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }

  .upload-progress {
    margin-top: 10px;
    font-size: 14px;
    color: #606266;
  }
</style>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useResumableUpload } from '@/utils/UploadUtils';

  export default defineComponent({
    setup() {
      const setup = useResumableUpload();
      return {
        ...setup,
      };
    },
  });
</script>