<template>
  <vxe-grid v-bind="gridOptions"
            :max-height="height"
            :loading="loading">
  </vxe-grid>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';

  export default defineComponent({
    props: {
      data: Array,
      loading: {
        type: Boolean,
        default: false,
      },
      height: {
        type: Number,
        default: 400,
      },
    },
    setup(props) {
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
      };
    },
  });
</script>
