<template>
  <el-container>
    <el-aside width="300px">
      <el-input placeholder="表名搜索"
                clearable
                size="small"
                v-model.trim="filterText">
      </el-input>
      <el-tree ref="tree"
               size="small"
               :props="props"
               :load="loadNode"
               :filter-node-method="filterNode"
               @node-click="handleNodeClick"
               accordion
               lazy>
      </el-tree>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onMounted } from 'vue';
  import { Tree } from 'element-ui';
  import { TreeNode } from 'element-ui/types/tree';

  import router from '@/router/index';
  import * as DbUtils from '@/utils/DbUtils';
  import axios from '@/utils/AxiosUtils';

  import filterBy from '@/filters/filterBy';

  interface TreeItem {
    id: number;
    label: string;
    isLeaf: boolean;
  }

  export default defineComponent({
    setup() {
      const props = {
        label: 'label',
        children: 'children',
        isLeaf: 'isLeaf'
      };
      const id = ref<number>(null);
      const filterText = ref('');
      const treeRef = ref<Tree>();

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
        if (id.value && id.value !== data.id) return false;
        if (!value) return true;
        return filterBy([data.label], value).length === 1;
      };

      const handleNodeClick = (node: TreeItem) => {
        if (!node.isLeaf) return;

        const params: any = {
          id: node.id,
          name: node.label,
        };

        id.value = node.id;
        if (!filterText.value) filterText.value = node.label;
        router.push({ name: 'TableInfo2', params });
      };

      onMounted(() => {
        watch(
          () => router.currentRoute,
          (route) => {
            const idParam = route.params.id;
            id.value = idParam ? parseInt(idParam, 10) : null;
          }
        );

        watch(() => filterText.value, (val) => {
          treeRef.value.filter(val);
        });
      });

      const getTables = async (id: number) => {
        const row = await DbUtils.DbConfigGet(id);
        const url = '/api/sql/tablenames';
        const rsp = await axios.post<string[]>(url, row);
        if (rsp.code === 0) {
          return rsp.data.map(t => ({ id, label: t, isLeaf: true }));
        } else {
          return [];
        }
      };

      return {
        props,
        filterText,
        loadNode,
        filterNode,
        handleNodeClick,
        tree: treeRef,
      };
    },
  });
</script>