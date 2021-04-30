<template>
  <nav class="navbar navbar-inverse navbar-fixed-top"
       role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button"
                class="navbar-toggle"
                data-toggle="collapse"
                data-target=".navbar-ex1-collapse">
          <span class="sr-only">内容</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link to="/"
                     class="navbar-brand">
          <span style="color: white;">首页</span>
        </router-link>
      </div>
      <div class="collapse navbar-collapse navbar-ex1-collapse">
        <ul class="nav navbar-nav">
          <li>
            <a class="dropdown-toggle"
               style="cursor: pointer;"
               data-toggle="dropdown">
              文档
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li class="dropdown-header">Table</li>
              <li>
                <a target="_blank"
                   class="dropdown-toggle"
                   href="//server3.hsort.com:8035/bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/index.html">
                  bootstrap-table
                </a>
              </li>
              <li>
                <router-link class="dropdown-toggle"
                             to="/BtTable/Dom2Config">
                  bootstrap-table config
                </router-link>
              </li>
              <li>
                <a target="_blank"
                   class="dropdown-toggle"
                   href="//server3.hsort.com:8082/angular-ui.github.io/bootstrap/index.html">
                  angular-ui
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a class="dropdown-toggle"
               style="cursor: pointer;"
               data-toggle="dropdown">
              工具
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <!-- <li class="dropdown-header">Table</li> -->
              <li>
                <router-link class="dropdown-toggle"
                             to="/OtherUtils/Json2Ts">
                  Json2Ts
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-toggle"
                             to="/OtherUtils/Csv2Json">
                  Csv2Json
                </router-link>
              </li>
            </ul>
          </li>
          <li>
            <a target="_blank"
               href="https://github.com/ChobitsSP/vue-cli3-demo">
              vue-template
            </a>
          </li>
          <li>
            <router-link class="dropdown-toggle"
                         to="/Table/ConfigList">
              数据库配置
            </router-link>
          </li>
        </ul>
        <!--<ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle ng-binding" data-toggle="dropdown">
              <span class="glyphicon glyphicon-user"></span>&nbsp;
              {{ user.username }}
            </a>
            <ul class="dropdown-menu">
              <li @click="logout">
                <a style="cursor:pointer;">
                  <span class="glyphicon glyphicon-off"></span>&nbsp; 退出
                </a>
              </li>
            </ul>
          </li>
        </ul>-->
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'NavHeader'
  }
</script>
