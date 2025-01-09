<template>
  <vxe-grid v-bind="gridOptions"
            :max-height="height"
            :loading="loading"
            @header-cell-click="onHeaderCellClick"
            @cell-click="onCellClick">
  </vxe-grid>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';
  import _ from 'lodash';
  import { useClipboard } from '@vueuse/core';

  export default defineComponent({
    props: {
      data: Array,
      loading: {
        type: Boolean,
        default: false,
      },
      height: {
        type: [Number, String],
        default: 'auto',
      },
    },
    setup(props) {
      const { copy } = useClipboard();

      const gridOptions = ref({
        columns: [],
        data: [],
        size: 'mini',
      });

      watchEffect(() => {
        const list = props.data;

        gridOptions.value.data = list;

        if (list.length > 0) {
          const columns = Object.keys(list[0]).map(key => {
            return {
              field: key,
              title: key,
              minWidth: 160,
            };
          });
          gridOptions.value.columns = columns;
        }
        else {
          gridOptions.value.columns = [];
        }
      });

      return {
        gridOptions,
        onCellClick({ row, column }) {
          const value = _.get(row, column.field);
          if (!value) return;
          copy(value);
        },
        onHeaderCellClick({ column }) {
          copy(column.title);
        },
      };
    },
  });
</script>
