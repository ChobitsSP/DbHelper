<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input type="textarea"
                  v-model="input"
                  :rows="20"
                  placeholder="Paste your HTML here"
                  clearable></el-input>
      </el-col>
      <el-col :span="12">
        <el-input type="textarea"
                  :value="output"
                  :rows="20"
                  placeholder="Output JSON"
                  readonly></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';

  export default defineComponent({
    setup() {
      const input = ref('');

      function getOutput(html: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const dom = doc.body.firstChild as HTMLElement;

        const config: Record<string, any> = {};
        for (let attr of dom.attributes) {
          if (attr.name !== 'data-toggle') {
            config[attr.name.replace('data-', '')] = attr.value;
          }
        }

        const columns = [];

        dom.querySelectorAll('th').forEach(el => {
          const col = {};
          for (let attr of el.attributes) {
            col[attr.name.replace('data-', '')] = attr.value;
          }

          const title = el.textContent;
          if (title != null) {
            col['title'] = title;
          }

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

      const output = computed(() => {
        try {
          return getOutput(input.value);
        } catch {
          return '';
        }
      });

      return {
        input,
        output,
      };
    },
    // computed: {
    //   output() {
    //     const dom = $(this.input);

    //     const config = Object.assign({}, dom.data());
    //     delete config.toggle;

    //     const columns = [];

    //     dom.find('th').each((i, el) => {
    //       const col = Object.assign({}, $(el).data());

    //       const title = $(el).text();
    //       if (title != null)
    //         col['title'] = title;

    //       ['formatter', 'cellStyle'].forEach(key => {
    //         const val = col[key];
    //         if (typeof val === 'string') {
    //           col[key] = 'MyUtils.' + val;
    //         }
    //       });

    //       columns.push(col);
    //     });

    //     config.columns = columns;
    //     return JSON.stringify(config);
    //   }
    // },
  });
</script>
