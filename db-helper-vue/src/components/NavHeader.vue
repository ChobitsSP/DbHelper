<template>
  <el-menu class="el-menu-demo"
           mode="horizontal"
           :default-active="defaultActive"
           background-color="#304156"
           text-color="#fff"
           active-text-color="#409EFF"
           router>
    <template v-for="menu in menus">
      <el-submenu v-if="menu.children"
                  :key="menu.name"
                  :index="menu.name">
        <template slot="title">{{ menu.name }}</template>
        <el-menu-item v-for="child in menu.children"
                      :index="child.url"
                      :key="child.name">
          {{ child.name }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else
                    :key="menu.name"
                    :index="menu.url">
        {{ menu.name }}
      </el-menu-item>
    </template>

  </el-menu>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useRoute } from '@/router/index';

  interface Menu {
    name: string;
    url?: string;
    hide?: boolean;
    children?: Menu[];
  }

  const MenuList: Menu[] = [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: '文档',
      hide: true,
      children: [
        {
          name: 'Table',
          children: [
            {
              name: 'bootstrap-table',
              url: '//server3.hsort.com:8035/bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/index.html',
            },
            {
              name: 'bootstrap-table config',
              url: '/BtTable/Dom2Config',
            },
            {
              name: 'angular-ui',
              url: '//server3.hsort.com:8082/angular-ui.github.io/bootstrap/index.html',
            },
          ],
        },
      ],
    },
    {
      name: 'Database',
      url: '/Table/ConfigList',
      children: [
        {
          name: 'Config',
          url: '/Table/ConfigList',
        },
        {
          name: 'Compare',
          url: '/Table/DbCompare',
        },
        {
          name: 'ExecuteSql',
          url: '/Database/ExecuteSql',
        },
        {
          name: 'ImportData',
          url: '/Database/ImportData',
        },
      ],
    },
    {
      name: 'OtherUtils',
      children: [
        {
          name: 'Json2Ts',
          url: '/OtherUtils/Json2Ts',
        },
        {
          name: 'Csv2Json',
          url: '/OtherUtils/Csv2Json',
        },
        // {
        //   name: '动态生成',
        //   url: '/Table/TableInfoDoc',
        // },
        {
          name: 'Jar2Pom',
          url: '/OtherUtils/Jar2Pom',
        },
        {
          name: '密码生成',
          url: '/OtherUtils/PasswordGenerator',
        },
      ],
    },
  ];

  export default defineComponent({
    setup() {
      const route = useRoute();
      const defaultActive = route.path;

      const menus = computed(() => {
        return MenuList.filter(t => !t.hide);
      });

      return {
        defaultActive,
        menus,
      };
    },
  });
</script>
