<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-input type="textarea"
                  v-model="input"
                  :rows="20"
                  clearable></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea"
                  :value="output"
                  :rows="20"
                  readonly></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary"
                 ref="btn">复制</el-button>
    </el-row>
  </div>
</template>

<script>
  import $ from 'jquery';
  import Clipboard from 'clipboard';

  export default {
    data() {
      return {
        input: ''
      }
    },
    computed: {
      output() {
        const dom = $(this.input);

        const config = Object.assign({}, dom.data());
        delete config.toggle;

        const columns = [];

        dom.find('th').each((i, el) => {
          const col = Object.assign({}, $(el).data());

          const title = $(el).text();
          if (title != null)
            col['title'] = title;

          ['formatter', 'cellStyle'].forEach(key => {
            const val = col[key];
            if (typeof val === 'string') {
              col[key] = 'MyUtils.' + val;
            }
          });

          columns.push(col);
        });

        config.columns = columns;
        return JSON.stringify(config);
      }
    },
    async mounted() {
      await this.$nextTick();

      this.clipboard = new Clipboard(this.$refs.btn.$el, {
        text: (trigger) => {
          return this.output
        }
      })

      this.clipboard.on('success', (e) => {
        this.$message.success('复制成功');
      })
    }
  }
</script>
