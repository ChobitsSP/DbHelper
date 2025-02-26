<template>
  <vxe-grid ref="gridRef"
            v-bind="gridOptions"
            :max-height="height"
            :loading="loading"
            @header-cell-click="onHeaderCellClick"
            size="mini"
            :row-config="{ isCurrent: true, isHover: true }"
            :scroll-x="{ enabled: true, gt: 0 }"
            :scroll-y="{ enabled: true, gt: 0 }"
            @cell-click="onCellClick">

    <template #filter_name="{ column }">
      <div v-for="(option, index) in column.filters"
           :key="index">
        <vxe-input v-model="option.data"
                   @change="changeNameFilter(option)"></vxe-input>
      </div>
    </template>
  </vxe-grid>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';
  import _ from 'lodash';
  import { useClipboard } from '@vueuse/core';

  import filterBy from '@/filters/filterBy';

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
        toolbarConfig: {
          custom: true,
          export: true,
        },
        exportConfig: {},
        customConfig: {
          mode: 'modal'
        },
      });

      watchEffect(() => {
        const list = props.data;

        gridOptions.value.data = list;

        if (list.length > 0) {
          const columns = Object.keys(list[0]).map(key => {
            return {
              field: key,
              title: key,
              width: 'auto',
              sortable: true,
              filters: [
                { data: '' }
              ],
              filterMethod({ option, row, column }) {
                return filterBy([_.get(row, column.field)], option.data).length > 0;
              },
              slots: {
                filter: 'filter_name'
              },
            };
          });
          gridOptions.value.columns = [
            {
              title: 'index',
              type: 'seq',
              width: 60,
            },
            ...columns,
          ];
        }
        else {
          gridOptions.value.columns = [];
        }
      });

      const gridRef = ref();
      function changeNameFilter(option: any) {
        const $grid = gridRef.value;
        if ($grid) {
          $grid.updateFilterOptionStatus(option, !!option.data)
        }
      }

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

        gridRef,
        changeNameFilter,
      };
    },
  });
</script>
