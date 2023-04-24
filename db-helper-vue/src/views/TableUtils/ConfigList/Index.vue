<template>
  <div>
    <el-row>
      <el-col :xs="{ span: 24, offset: 0 }"
              :sm="{ span: 20, offset: 2 }"
              :md="{ span: 16, offset: 4 }"
              :lg="{ span: 12, offset: 6 }"
              :xl="{ span: 10, offset: 7 }">
        <el-row>
          <el-form inline>
            <el-form-item>
              <el-button @click="edit(null)"
                         icon="el-icon-plus"
                         circle
                         size="small"
                         type="success"></el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="exportConfig"
                         circle
                         icon="el-icon-download"
                         size="small"
                         type="info"></el-button>
            </el-form-item>
            <el-form-item>
              <el-upload accept=".json"
                         :before-upload="importConfig">
                <el-button circle
                           icon="el-icon-upload"
                           size="small"
                           type="primary"></el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table :data="tableData"
                    border
                    size="small"
                    style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                {{ props.row.connectionString }}
              </template>
            </el-table-column>
            <el-table-column prop="id"
                             label="id"
                             min-width="60">
            </el-table-column>
            <el-table-column prop="name"
                             label="name">
            </el-table-column>
            <el-table-column prop="providerName"
                             label="provider"
                             min-width="220">
            </el-table-column>
            <el-table-column label="操作"
                             min-width="200">
              <template slot-scope="{ row }">
                <el-dropdown @command="cmd => onCommand(row, cmd)">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-edit"
                                      command="edit">编辑
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-download"
                                      command="exportAll">导出
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-s-grid"
                                      command="exportDatas">导出数据
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-s-grid"
                                      command="exportMd">导出md
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-eleme"
                                      command="exportEf">ef
                    </el-dropdown-item>
                    <el-dropdown-item icon="el-icon-remove"
                                      command="remove">删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <XlsxUpload :loading="loading"
                            style="margin-left:10px;"
                            @input="arr => importColComment(arr, row)">
                </XlsxUpload>

                <!-- <el-button size="mini"
                           type="success"
                           @click.stop="edit(row)">编辑</el-button>
                <el-button size="mini"
                           type="warning"
                           :loading="loading"
                           @click.stop="exportAll(row)">导出</el-button>
                <el-button size="mini"
                           type="success"
                           @click.stop="exportDatas(row)">导出数据</el-button>
                <el-button size="mini"
                           type="success"
                           @click.stop="exportEf(row)">ef</el-button>
                <el-button size="mini"
                           type="danger"
                           @click.stop="remove(row)">删除</el-button>
                <XlsxUpload :loading="loading"
                            style="margin-left:10px;"
                            @input="arr => importColComment(arr, row)">
                </XlsxUpload> -->
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
  import ConAddModal from '@/components/ConAddModal.vue';
  import * as DbUtils from '@/utils/DbUtils.ts';
  import { ExportExcel } from "@/utils/CsvExport.ts";
  import XlsxUpload from "./components/XlsxUpload.vue";
  import { ExportDbDatas } from "@/utils/ImportDataUtils";
  import Ef6Utils from "@/utils/TableUtils/Ef6";
  import MarkdownUtils from "@/utils/TableUtils/Markdown";
  import JSZip from 'jszip';
  import FileSaver from 'file-saver';

  function downloadFile(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

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
      onCommand(row, cmd) {
        const func = this[cmd];
        if (typeof func === 'function') {
          func(row);
        }
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
      },
      async exportDatas(item) {
        this.loading = true;

        /** @type{string[]} */
        const names = (await axios.post('/api/sql/tablenames', item)).data;
        await ExportDbDatas(item, names);

        this.loading = false;
      },
      async exportMd(item) {
        this.loading = true;

        /** @type{string[]} */
        const names = (await axios.post('/api/sql/tablenames', item)).data;
        const plist = names.map(table => axios.post('/api/sql/tablecolumns', Object.assign({ table }, item)));
        const list = await Promise.all(plist);

        const arr = [];

        for (let i = 0; i < names.length; i++) {
          const rsp = list[i];

          if (rsp.code !== 0) {
            continue;
          }

          const cols = rsp.data;
          // 导出

          cols.forEach((col, i) => {
            col.id = i + 1;
          });

          const rowInfo = MarkdownUtils(names[i], cols);
          arr.push(rowInfo);
        }

        const fileName = ["dbinfo", item.name, moment().format("YYYYMMDDHHmmss")].join("_");
        downloadFile(arr.join('\r\n'), fileName + '.md', 'text/plain');

        this.loading = false;
      },
      exportConfig() {
        downloadFile(JSON.stringify(this.tableData), 'config.json', 'text/plain');
      },
      importConfig(file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const list = JSON.parse(event.target.result);

          const plist = list.map(item => {
            delete item.id;
            return DbUtils.DbConfigUpdate(item);
          });

          await Promise.all(plist);
          this.refresh();
        }
        reader.readAsText(file);
        return false;
      },
      async exportEf(item) {
        this.loading = true;

        /** @type{string[]} */
        const names = (await axios.post('/api/sql/tablenames', item)).data;

        const plist = names.map(table => {
          return axios.post('/api/sql/tablecolumns', Object.assign({ table }, item))
            .then(rsp => {
              if (rsp.code !== 0) return null;
              /** @type{string} */
              const str = Ef6Utils(table, rsp.data);
              return {
                name: table + '.cs',
                text: ['namespace Models', '{', str, '}'].join('\r\n'),
              };
            });
        });

        const list = await Promise.all(plist);

        let zip = new JSZip();

        list.forEach(file => {
          zip.file(file.name, file.text);
        });

        zip.file('DbEntities.cs', names.map(name => `public DbSet<${name}> ${name} { get; set; }`).join('\r\n'));

        zip.generateAsync({ type: "blob" }).then((content) => {
          FileSaver.saveAs(content, "ef6.zip");
          this.loading = false;
        });
      },
    }
  }
</script>
