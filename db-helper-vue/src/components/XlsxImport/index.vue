<template>
  <div class="xlsx-import">
    <div class="tools-container">
      <XlsxUpload class="xlsx-upload"
                  @input="onLoad"
                  :columns="importColumns" />
      <el-button type="success"
                 @click="onStart"
                 :loading="isUploading"
                 plain>{{ executeText }}</el-button>
      <el-button v-if="isUploading"
                 type="danger"
                 @click="onStop"
                 plain>Stop Import</el-button>
    </div>
    <div class="grid-container">
      <vxe-grid ref="grid"
                v-bind="gridOptions"
                size="mini"
                :scroll-y="{ enabled: true, gt: 0 }"
                :max-height="800"
                :cell-style="getCellStyle">
      </vxe-grid>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .xlsx-import {
    .tools-container {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-content: flex-start;

      .download-link {
        text-decoration: none;
        color: #409eff;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .grid-container {
      margin-top: 16px;
    }
  }
</style>

<script lang="ts">
  import { defineComponent } from 'vue';

  import XlsxUpload from './XlsxUpload.vue';

  import { useSetup } from './Setup';

  export default defineComponent({
    components: {
      XlsxUpload,
    },
    props: {
      gridColumns: {
        type: Array,
        required: true,
      },
      importColumns: {
        type: Array,
        default: () => [],
      },
      upload: {
        type: Function,
        required: true,
      },
    },
    setup(props) {
      const mainSetup = useSetup({
        getGridColumns: () => props.gridColumns,
        upload: props.upload as any,
      });
      return {
        ...mainSetup,
      };
    },
  });
</script>