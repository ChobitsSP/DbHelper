<template>
  <div class="query-container">
    <div class="tabs-header">
      <div v-for="(queryTab, index) in queryTabs"
           :key="index"
           :class="['query-tab', { active: activeTab === index }]"
           @click="onTabClick(index)">
        <span>Query {{ index + 1 }}</span>
        <button class="close-btn"
                @click.stop="onClose(index)">×</button>
      </div>
      <button class="add-btn"
              @click="onAdd">+</button>
    </div>
    <div class="tab-content"
         v-for="(queryTab, index) in queryTabs"
         :key="index"
         :style="{ display: activeTab === index ? 'block' : 'none' }">
      <QueryInfo ref="queryInfos"
                 :defaultDbId="lastDbId" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .query-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .tabs-header {
    display: flex;
    border-bottom: 1px solid #ccc;
  }

  .query-tab {
    padding: 10px 15px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-bottom: none;
    margin-right: 2px;
    display: flex;
    align-items: center;

    &.active {
      background-color: #409eff;
      color: #fff;
    }
  }

  .close-btn {
    margin-left: 10px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .add-btn {
    padding: 5px 10px;
    cursor: pointer;
    background: none;
    border: 1px solid #ccc;
    border-bottom: none;
  }

  .tab-content {
    flex-grow: 1;
    padding: 20px;
  }
</style>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import _ from 'lodash';

  import QueryInfo from './components/QueryInfo.vue';

  class QueryConfig {

  }

  export default defineComponent({
    components: {
      QueryInfo,
    },
    setup() {
      const queryTabs = ref<QueryConfig[]>([new QueryConfig()]);
      const activeTab = ref(0);

      function onClose(i: number) {
        queryTabs.value.splice(i, 1);
        if (activeTab.value >= queryTabs.value.length) {
          activeTab.value = Math.max(queryTabs.value.length - 1, 0);
        }
      }

      function onAdd() {
        queryTabs.value.push(new QueryConfig());
        activeTab.value = queryTabs.value.length - 1;
        lastDbId.value = _.chain(queryInfos.value).map(({ queryConfig }) => queryConfig.dbId).filter(t => !!t).last().value();
      }

      function onTabClick(i: number) {
        activeTab.value = i;
      }

      const queryInfos = ref<any[]>();

      const lastDbId = ref();

      return {
        queryTabs,
        onAdd,
        onClose,
        activeTab,
        onTabClick,

        queryInfos,
        lastDbId,
      };
    },
  });
</script>
