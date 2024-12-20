<template>
  <el-container>
    <el-header :height="height + 'px'">
      <NavHeader ref="NavHeader"></NavHeader>
    </el-header>
    <el-main :style="{ height: `calc(100vh - ${height}px)` }">
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, nextTick } from 'vue';
  import { Observable } from 'rxjs';
  import NavHeader from './NavHeader.vue';
  import TableNames from './TableNames.vue';
  import { useRx } from '@/mixins/RxBusMixins';

  export default defineComponent({
    name: 'Home',
    components: {
      NavHeader,
      TableNames,
    },
    setup() {
      const rxHub = useRx();
      const height = ref<number>(50);

      const NavHeader = ref();

      function GetNavHeight(): number {
        return NavHeader.value?.$el?.clientHeight || 0;
      }

      const source = Observable
        .merge(Observable.fromEvent(window, 'resize'), Observable.interval(100))
        .map(() => GetNavHeight())
        .filter((value) => value > 0)
        .distinctUntilChanged()
        .subscribe((value) => {
          height.value = value;
        });

      rxHub.add(source);

      onMounted(() => {
        nextTick(() => {
          height.value = GetNavHeight();
        });
      });

      return {
        height,
        NavHeader,
      };
    },
  });
</script>