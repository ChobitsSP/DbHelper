<template>
  <div class="tree-container">
    <el-input v-model.trim="filterText"
              placeholder="表名搜索"
              clearable
              size="small"
              class="filter-input">
    </el-input>
    <el-tree ref="tree"
             size="small"
             :props="{ label: 'label', children: 'children', isLeaf: 'isLeaf' }"
             :load="loadNode"
             :filter-node-method="filterNode"
             @node-click="handleNodeClick"
             accordion
             lazy
             class="tree-view">
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
  .tree-container {
    // width: 200px; // 设置固定宽度，可以根据需要调整
    height: 100%; // 假设父容器高度为100%
    display: flex;
    flex-direction: column;

    .filter-input {
      margin-bottom: 10px;
    }

    .tree-view {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { TreeNode } from 'element-ui/types/tree';

  import { useRoute } from '@/router/index';
  import * as DbUtils from '@/utils/DbUtils';

  import * as api from '@/api';

  import filterBy from '@/filters/filterBy';

  interface TreeItem {
    id: number;
    label: string;
    isLeaf: boolean;
  }

  export default defineComponent({
    setup(_props, { emit }) {
      const route = useRoute();

      const tableId = ref<number>();
      const filterText = ref('');
      const treeRef = ref();

      const loadNode = async (node: TreeNode<number, TreeItem>, resolve: (data: any[]) => any) => {
        if (node.level === 0) {
          const list = await DbUtils.DbConfigList();
          return resolve(list.map(t => ({
            id: t.id,
            label: t.name,
            isLeaf: false,
          })));
        } else if (node.level === 1) {
          const list = await getTables(node.data.id);
          return resolve(list);
        }
        return resolve([]);
      };

      const filterNode = (value: string, data: TreeItem) => {
        if (tableId.value && tableId.value !== data.id) return false;
        if (!value) return true;
        return filterBy([data.label], value).length === 1;
      };

      const handleNodeClick = (node: TreeItem) => {
        if (!node.isLeaf) return;
        const params = {
          id: node.id.toString(),
          name: node.label,
        };
        tableId.value = node.id;
        if (!filterText.value) filterText.value = node.label;
        emit('change', {
          id: node.id,
          name: node.label,
        });
      };

      // watch(() => route.params,
      //   (params) => {
      //     const idParam = params.id;
      //     tableId.value = idParam ? parseInt(idParam, 10) : null;
      //   }
      // );

      const getTables = async (id: number) => {
        const config = await DbUtils.DbConfigGet(id);
        return api.getTables(config);
      };

      watch(() => filterText.value, (val) => {
        treeRef.value?.filter(val);
      });

      return {
        filterText,
        loadNode,
        filterNode,
        handleNodeClick,
        tree: treeRef,
      };
    },
  });
</script>