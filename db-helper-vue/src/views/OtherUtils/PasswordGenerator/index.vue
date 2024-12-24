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
      const generatedPassword = ref('')

      const generatePassword = () => {
        let charset = ''
        if (includeUpper.value) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (includeLower.value) charset += 'abcdefghijklmnopqrstuvwxyz'
        if (includeNumbers.value) charset += '0123456789'
        if (includeSymbols.value) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-='

        if (charset === '') {
          ElMessage.warning('请至少选择一种字符类型')
          return
        }

        let password = ''
        for (let i = 0; i < passwordLength.value; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length)
          password += charset[randomIndex]
        }

        generatedPassword.value = password
      }

      generatePassword();

      return {
        passwordLength,
        includeUpper,
        includeLower,
        includeNumbers,
        includeSymbols,
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