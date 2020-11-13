<template>
  <div>
    <el-checkbox v-model="showMenu"
                 label="显示树"
                 border></el-checkbox>
    <el-row :gutter="20">
      <el-col :span="4"
              v-show="showMenu">
        <el-input placeholder="表名搜索"
                  clearable
                  v-model.trim="filterText">
        </el-input>
        <el-tree ref="tree"
                 :props="props"
                 :load="loadNode"
                 :filter-node-method="filterNode"
                 @node-click="handleNodeClick"
                 accordion
                 lazy>
        </el-tree>
      </el-col>
      <el-col :span="showMenu ? 20 : 24">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as DbUtils from '@/utils/DbUtils.ts';
  import axios from 'axios';

  export default {
    data() {
      return {
        props: {
          label: 'label',
          children: 'children',
          isLeaf: 'isLeaf'
        },
        id: null,
        showMenu: true,
        filterText: '',
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      '$route': function (route) {
        const id = route.params.id;
        this.id = id ? parseInt(id, 10) : null;
      }
    },
    methods: {
      async GetTables(id) {
        const row = await DbUtils.DbConfigGet(id);
        const url = '/api/sql/tablenames';
        const rsp = await axios.post(url, row);
        if (rsp.code === 0) {
          return rsp.data.map(t => ({ id, label: t, isLeaf: true }));
        } else {
          return [];
        }
      },
      async loadNode(node, resolve) {
        if (node.level === 0) {
          const list = await DbUtils.DbConfigList();

          return resolve(list.map(t => ({
            id: t.id,
            label: t.name,
            isLeaf: false,
          })));
        }
        else if (node.level === 1) {
          const list = await this.GetTables(node.data.id);
          return resolve(list);
        }

        return resolve([]);
      },
      filterNode(value, data) {
        if (this.id && this.id !== data.id) return false;
        if (!value) return true;
        return this.filterBy([data.label], value).length === 1;
      },
      async handleNodeClick(node) {
        if (!node.isLeaf) return;

        const params = {
          id: node.id,
          name: node.label,
        };

        this.id = node.id;
        if (!this.filterText) this.filterText = node.label;
        this.$router.push({ name: 'TableInfo2', params });
      }
    }
  };
</script>
