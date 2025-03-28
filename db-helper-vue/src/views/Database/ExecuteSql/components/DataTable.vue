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
            @cell-click="onCellClick"
            @cell-dblclick="onCellDbClick">
    <template #filter_name="{ column }">
      <div v-for="(option, index) in column.filters"
           :key="index">
        <vxe-input v-model="option.data"
                   @change="changeNameFilter(option)"></vxe-input>
      </div>
    </template>
    <template #expand_content="{ row }">
      <ObjectView :value="row"></ObjectView>
    </template>
  </vxe-grid>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';
  import _ from 'lodash';
  import { useClipboard } from '@vueuse/core';

  import filterBy from '@/filters/filterBy';
  import ObjectView from './ObjectView.vue';

  export default defineComponent({
    components: {
      ObjectView,
    },
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
              width: 160,
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
            {
              type: 'expand',
              width: 80,
              slots: { content: 'expand_content' },
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

      function onCellDbClick({ cell }) {
        const span = cell.querySelector('.vxe-cell--label span');
        const range = document.createRange();
        if (!span || !range) return;
        range.selectNodeContents(span);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }

      return {
        gridOptions,
        onCellClick({ row, column }) {
          const value = _.get(row, column.field);
          if (!value) return;
          copy(value);
        },
        onCellDbClick,
        onHeaderCellClick({ column }) {
          copy(column.title);
        },

        gridRef,
        changeNameFilter,
      };
    },
  });
</script>
