<template>
  <el-container>
    <el-header :height="height">
      <NavHeader ref="NavHeader"></NavHeader>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
  import { Observable } from 'rxjs'
  import NavHeader from './NavHeader.vue'
  import TableNames from './TableNames.vue'

  export default {
    name: 'Home',
    components: {
      NavHeader,
      TableNames,
    },
    data() {
      return {
        height: null
      }
    },
    mounted() {
      const source = Observable
        .merge(Observable.fromEvent(window, 'resize'), Observable.interval(100))
        .map(() => this.$refs.NavHeader.$el.clientHeight)
        .distinctUntilChanged()

      this.$subscribeTo(source, this.ready)

      this.$nextTick(() => {
        this.ready(this.$refs.NavHeader.$el.clientHeight)
      })
    },
    methods: {
      ready(h) {
        this.height = h + 'px'
      }
    }
  }
</script>
