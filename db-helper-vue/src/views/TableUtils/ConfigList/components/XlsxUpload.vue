<template>
  <el-upload class="upload-demo"
             :limit="1"
             auto-upload
             :http-request="ReadXlsx"
             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
             :file-list="fileList">
    <el-button size="mini"
               :loading="loading"
               type="primary">导入列注释</el-button>
    <!-- <div slot="tip"
         class="el-upload__tip">只能选择xlsx文件</div> -->
  </el-upload>
</template>

<script>
  import XLSX from "xlsx";

  function ReadXlsx(file) {
    return new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        var filename = file.name;
        // pre-process data
        var binary = "";
        var bytes = new Uint8Array(e.target.result);
        var length = bytes.byteLength;
        for (var i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        // call 'xlsx' to read the file
        var oFile = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true });
        resolve(oFile);
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  const dic = {
    "表名": "table",
    "列名": "column",
    "备注": "comment",
  }

  function GetVal(key, value) {
    if (typeof value !== 'string') return value;
    value = value.trim();
    return value;
  }

  function GetRow(obj) {
    const row = {
      // state: 0,
      // err_msg: null,
    };
    Object.keys(dic).forEach(key => {
      const en = dic[key];
      row[en] = GetVal(en, obj[key]);
    });
    return row;
  }

  export default {
    props: ['value', 'loading'],
    data() {
      return {
        fileList: []
      };
    },
    methods: {
      async ReadXlsx(data) {
        try {
          const result = await ReadXlsx(data.file);
          const sheetName = Object.keys(result.Sheets)[0];
          const sheet = result.Sheets[sheetName];
          if (sheet == null) throw new Error();
          const rows = XLSX.utils
            .sheet_to_json(sheet)
            .map(t => GetRow(t))
            .filter(t => !!t.comment);

          this.$emit('input', rows);
        } catch (err) {
          alert('文件格式不正确!');
        }
        finally {
          this.fileList = [];
        }
      }
    }
  }
</script>

<style scoped>
  .upload-demo {
    display: inline;
  }
</style>
