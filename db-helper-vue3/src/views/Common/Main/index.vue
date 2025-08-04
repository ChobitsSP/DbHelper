<template>
  <div>
    <el-button type="primary">Primary
      Button</el-button>
    <vxe-table>
      <vxe-column field="name"
                  title="Name"
                  width="100"></vxe-column>
      <vxe-column field="age"
                  title="Age"
                  width="100"></vxe-column>
      <vxe-column field="address"
                  title="Address"></vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    setup() {
      return {};
    },
  });
</script>