<template>
  <el-input :value="value" :readonly="true" @click.native="selectAll">
    <el-button ref="btn" slot="append" icon="document">复制</el-button>
  </el-input>
</template>

<script>
  import Clipboard from 'clipboard'

  export default {
    props: {
      value: String
    },
    mounted() {
      this.$nextTick(() => {

        this.clipboard = new Clipboard(this.$refs.btn.$el, {
          text: (trigger) => {
            return this.value
          }
        })

        this.clipboard.on('success', (e) => {
          this.$message({
            type: 'success',
            showClose: true,
            message: '复制成功'
          })

          //this.$emit('success', e)
        })

        //this.clipboard.on('error', (e) => this.$emit('error', e))
      })
    },
    methods: {
      selectAll() {
        const input = this.$children[0].$el.querySelector('input')
        input.select()
      }
    },
    beforeDestroy() {
      if (this.clipboard) {
        this.clipboard.destroy()
      }
    }
  }
</script>
