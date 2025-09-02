<template>
  <div class="container">
    <h1 class="text-center mb-4">密码生成器</h1>
    <el-form>
      <el-form-item label="密码长度:">
        <el-input-number v-model="passwordLength"
                         :min="1"
                         :max="100"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="includeUpper">包含大写字母 (A-Z)</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="includeLower">包含小写字母 (a-z)</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="includeNumbers">包含数字 (0-9)</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="includeSymbols">包含符号</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="excludeSimilar">忽略近形字 (如 0/O, 1/l/I
          等)</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="generatePassword">生成密码</el-button>
      </el-form-item>
      <el-form-item label="生成的密码:">
        <el-input v-model="generatedPassword"
                  readonly></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Message as ElMessage } from 'element-ui'

  export default defineComponent({
    name: 'PasswordGenerator',
    setup() {
      const passwordLength = ref(16)
      const includeUpper = ref(true)
      const includeLower = ref(true)
      const includeNumbers = ref(true)
      const includeSymbols = ref(false)
      const excludeSimilar = ref(true) // 新增选项
      const generatedPassword = ref('')

      const generatePassword = () => {
        let pools: string[] = []
        if (includeUpper.value) pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        if (includeLower.value) pools.push('abcdefghijklmnopqrstuvwxyz')
        if (includeNumbers.value) pools.push('0123456789')
        if (includeSymbols.value) pools.push('!@#$%^&*()_+~`|}{[]:;?><,./-=')

        if (pools.length === 0) {
          ElMessage.warning('请至少选择一种字符类型')
          return
        }

        // 需要排除的近形字
        const similarChars = 'O0o1lI|5S8B9gq'
        if (excludeSimilar.value) {
          pools = pools.map(pool =>
            pool.split('').filter(c => !similarChars.includes(c)).join('')
          )
        }

        // 确保每类至少包含一个
        let passwordArray: string[] = []
        for (const pool of pools) {
          if (pool.length > 0) {
            const randIndex = Math.floor(Math.random() * pool.length)
            passwordArray.push(pool[randIndex])
          }
        }

        // 剩余长度补齐
        const allChars = pools.join('')
        for (let i = passwordArray.length; i < passwordLength.value; i++) {
          const randIndex = Math.floor(Math.random() * allChars.length)
          passwordArray.push(allChars[randIndex])
        }

        // 打乱顺序（防止前几个总是固定类别）
        for (let i = passwordArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
            ;[passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]
        }

        generatedPassword.value = passwordArray.join('')
      }

      generatePassword()

      return {
        passwordLength,
        includeUpper,
        includeLower,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
        generatedPassword,
        generatePassword
      }
    }
  })
</script>

<style scoped>
  .container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
  }
</style>
