<template>
  <div class="select-all-wrapper">
    <el-select v-model="innerValue"
               multiple
               filterable
               clearable
               :placeholder="placeholder"
               class="select-all">
      <el-option :value="ALL_KEY"
                 disabled>
        <div class="select-all-header">
          <el-checkbox :indeterminate="isIndeterminate"
                       v-model="checkAll">
            全选
          </el-checkbox>
        </div>
      </el-option>
      <el-option v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
        <el-checkbox :label="item.value"
                     :value="value.includes(item.value) ? item.value: null"
                     :true-label="item.value"
                     @click.native.stop="e => onToggle(item, e)">
          {{ item.label }}
        </el-checkbox>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';

  interface Option {
    label: string;
    value: string | number;
  }

  export default defineComponent({
    name: "SelectWithCheckAll",
    props: {
      value: {
        type: Array as PropType<(string | number)[]>,
        default: () => []
      },
      options: {
        type: Array as PropType<Option[]>,
        required: true
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
    },
    setup(props, { emit }) {
      const ALL_KEY = "__ALL__";

      const innerValue = computed({
        get() {
          return props.value;
        },
        set(val: (string | number)[]) {
          emit('input', val);
        },
      });

      function handleCheckAll(val: boolean) {
        if (val) {
          innerValue.value = props.options.map((o) => o.value);
        } else {
          innerValue.value = [];
        }
      }

      const checkAll = computed({
        get() {
          return props.value.length === props.options.length;
        },
        set(val: boolean) {
          handleCheckAll(val);
        }
      });

      const isIndeterminate = computed(() => {
        const checkedCount = props.value.length;
        return checkedCount > 0 && checkedCount < props.options.length;
      });

      function onToggle(item: Option, e: Event) {
        let newValue: (string | number)[] = [];
        if (innerValue.value.includes(item.value)) {
          newValue = innerValue.value.filter(v => v !== item.value);
        } else {
          newValue = [...innerValue.value, item.value];
        }
        innerValue.value = sortByOptions(newValue);
        e.stopPropagation();
        e.preventDefault();
      }

      function sortByOptions(values: (string | number)[]) {
        const optionValues = props.options.map(o => o.value);
        return optionValues.filter(v => values.includes(v));
      }

      return {
        ALL_KEY,
        checkAll,
        isIndeterminate,
        innerValue,
        onToggle,
      };
    }
  });
</script>

<style lang="scss" scoped>
  .select-all-wrapper {
    .select-all {
      width: 240px;
    }
    .select-all-header {
      padding: 4px 12px;
      font-weight: bold;
    }
  }
</style>
