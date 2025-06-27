<template>
  <div class="not-found-container">
    <el-row type="flex"
            justify="center"
            align="middle"
            class="full-height">
      <el-col :span="12"
              class="text-center">
        <h1 class="error-code">404</h1>
        <p class="error-message">抱歉，您访问的页面不存在</p>
        <el-button type="primary"
                   @click="goHome">返回主页</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'NotFound',
    setup() {
      const goHome = () => {
        window.location.href = '/'
      }

      return {
        goHome
      }
    }
  })
</script>

<style scoped>
  .not-found-container {
    min-height: 100vh;
    background-color: #f5f7fa;
  }

  .full-height {
    height: 100vh;
  }

  .text-center {
    text-align: center;
  }

  .error-code {
    font-size: 120px;
    color: #409eff;
    margin: 0;
    font-weight: bold;
  }

  .error-message {
    font-size: 24px;
    color: #606266;
    margin: 20px 0;
  }
</style>