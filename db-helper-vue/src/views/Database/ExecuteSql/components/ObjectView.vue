<template>
  <div class="container">
    <div class="item"
         v-for="item in list"
         :key="item.field">
      <div class="field">{{ item.field }}: {{ item.value }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
  }

  .item {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  .field {
    font-weight: bold;
    color: #333;
    white-space: nowrap;
    margin-right: 1rem;
  }

  .value {
    color: #666;
    white-space: nowrap;
  }
</style>

<script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';

  export default defineComponent({
    props: {
      value: {
        type: Object as PropType<Record<string, any>>,
        required: true,
      },
    },
    setup(props) {
      const list = computed(() =>
        Object.entries(props.value).map(([field, value]) => ({ field, value }))
      );

      return {
        list,
      };
    },
  });
</script>