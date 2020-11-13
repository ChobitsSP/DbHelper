<template>
  <div>
    <el-row>
      <el-col :xs="{ span: 24, offset: 0 }"
              :sm="{ span: 20, offset: 2 }"
              :md="{ span: 16, offset: 4 }"
              :lg="{ span: 12, offset: 6 }"
              :xl="{ span: 12, offset: 6 }">
        <el-row>
          <el-button @click="edit(null)"
                     type="primary">新增</el-button>
        </el-row>
        <el-row>
          <el-table :data="tableData"
                    border
                    size="mini"
                    style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                {{ props.row.connectionString }}
              </template>
            </el-table-column>
            <el-table-column prop="id"
                             label="id"
                             width="60">
            </el-table-column>
            <el-table-column prop="name"
                             label="name">
            </el-table-column>
            <el-table-column prop="providerName"
                             label="provider"
                             width="220">
            </el-table-column>
            <el-table-column label="操作"
                             width="360">
              <template slot-scope="{ row }">
                <el-button size="mini"
                           type="success"
                           @click.stop="edit(row)">编辑</el-button>
                <el-button size="mini"
                           type="warning"
                           :loading="loading"
                           @click.stop="exportAll(row)">导出</el-button>
                <XlsxUpload :loading="loading"
                            @input="arr => importColComment(arr, row)">
                </XlsxUpload>
                <el-button size="mini"
                           type="danger"
                           @click.stop="remove(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <ConAddModal ref="ConAddModal"
                 @callback="refresh"></ConAddModal>
  </div>
</template>

<script>
  import _ from "lodash";
  import axios from "axios";
  import configs from '@/data/configs';
  import ConAddModal from '@/components/ConAddModal';
  import * as DbUtils from '@/utils/DbUtils.ts';
  import { ExportExcel } from "@/utils/CsvExport.ts";
  import XlsxUpload from "./components/XlsxUpload.vue";

  export default {
    components: {
      ConAddModal,
      XlsxUpload,
    },
    data() {
      return {
        tableData: [],
        loading: false,
      }
    },
    created() {
      this.refresh()
    },
    methods: {
      async refresh() {
        this.tableData = await DbUtils.DbConfigList();
      },
      async remove(row) {
        await this.$confirm('是否删除');
        await DbUtils.DbConfigRemove(row.id);
        this.refresh();
      },
      link(row) {
        this.$store.commit('SET_CONINFO', row)
        this.$router.push({ name: 'TableList' })
      },
      edit(item) {
        this.$refs.ConAddModal.open(item)
      },
      async exportAll(item) {
        this.loading = true;

        const exportDic = {
          "id": "id",
          "table": "表名",
          "name": "列名",
          "type": "类型",
          "null_able": "可空",
          "comments": "备注",
        };

        /** @type{string[]} */
        const names = (await axios.post('/api/sql/tablenames', item)).data;
        const plist = names.map(table => axios.post('/api/sql/tablecolumns', Object.assign({ table }, item)));
        const list = await Promise.all(plist);

        for (let i = 0; i < names.length; i++) {
          const name = names[i];

          const rsp = list[i];

          if (rsp.code !== 0) {
            continue;
          }

          const cols = rsp.data;
          // 导出

          cols.forEach((col, i) => {
            col.id = i + 1;
            col.table = name;
          });
        }

        const row1 = Object.keys(exportDic).map(key => exportDic[key]);

        const rows = _.chain(list)
          .filter(t => t.code === 0)
          .map(t => t.data)
          .flatten()
          .map(col => {
            return Object.keys(exportDic).map(key => col[key]);
          })
          .value();

        ExportExcel([row1, ...rows], ["dbinfo", item.name, moment().format("YYYYMMDDHHmmss")].join("_"));

        this.loading = false;
      },
      async importColComment(list, row) {
        this.loading = true;

        const plist = list
          .map(t => Object.assign({}, t, row))
          .map(t => axios.post("/api/sql/UpdateColumnComment", t));

        await Promise.all(plist);

        this.loading = false;
      }
    }
  }
</script>
