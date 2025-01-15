<template>
  <vxe-grid ref="gridRef"
            v-bind="gridOptions"
            :max-height="height"
            :loading="loading"
            @header-cell-click="onHeaderCellClick"
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
        size: 'mini',
        rowConfig: {
          isCurrent: true,
          isHover: true
        },
        scrollY: {
          enabled: true,
          gt: 0
        },
        scrollX: {
          enabled: true,
          gt: 0
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
              minWidth: 160,
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
              title: 'seq',
              type: 'seq',
              minWidth: 80,
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
