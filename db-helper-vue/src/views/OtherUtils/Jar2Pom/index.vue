<template>
  <div class="jar-uploader">
    <h1>JAR文件上传和POM依赖生成器</h1>
    <el-upload :on-change="handleFileChange"
               :auto-upload="false"
               multiple
               accept=".jar">
      <el-button type="primary">选择JAR文件</el-button>
    </el-upload>
    <el-button @click="processFiles"
               :disabled="!files.length">生成POM依赖</el-button>
    <h2>生成的POM依赖：</h2>
    <el-card class="output"
             v-if="output">
      <pre>{{ output }}</pre>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import JSZip from 'jszip'
  import { Message as ElMessage } from 'element-ui'

  export default defineComponent({
    name: 'JarUploader',
    setup() {
      const files = ref<File[]>([])
      const output = ref('')

      const handleFileChange = (file: any) => {
        files.value.push(file.raw as File)
      }

      const processFiles = async () => {
        output.value = ''
        for (const file of files.value) {
          try {
            const pomDependency = await generatePomDependency(file)
            output.value += pomDependency + '\n\n'
          } catch (error) {
            console.error(`处理文件 ${file.name} 时出错:`, error)
            output.value += `处理文件 ${file.name} 时出错\n\n`
            ElMessage.error(`处理文件 ${file.name} 时出错`)
          }
        }
      }

      const generatePomDependency = async (file: File): Promise<string> => {
        const zip = new JSZip()
        const contents = await zip.loadAsync(file)

        let groupId = 'unknown'
        let artifactId = file.name.replace('.jar', '')
        let version = 'unknown'

        if (contents.file('META-INF/MANIFEST.MF')) {
          const manifest = await contents.file('META-INF/MANIFEST.MF')!.async('string')
          const lines = manifest.split('\n')
          for (const line of lines) {
            if (line.startsWith('Implementation-Vendor-Id:')) {
              groupId = line.split(':')[1].trim()
            } else if (line.startsWith('Implementation-Version:')) {
              version = line.split(':')[1].trim()
            }
          }
        }

        const pomPropertiesRegex = /META-INF\/maven\/(.+)\/(.+)\/pom.properties/
        for (const path in contents.files) {
          if (pomPropertiesRegex.test(path)) {
            const match = path.match(pomPropertiesRegex)
            if (match) {
              groupId = match[1]
              artifactId = match[2]
              const properties = await contents.file(path)!.async('string')
              const lines = properties.split('\n')
              for (const line of lines) {
                if (line.startsWith('version=')) {
                  version = line.split('=')[1].trim()
                  break
                }
              }
              break
            }
          }
        }

        return `<dependency>
    <groupId>${groupId}</groupId>
    <artifactId>${artifactId}</artifactId>
    <version>${version}</version>
</dependency>`
      }

      return {
        files,
        output,
        handleFileChange,
        processFiles
      }
    }
  })
</script>

<style scoped>
  .jar-uploader {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .output {
    margin-top: 20px;
  }
  .output pre {
    white-space: pre-wrap;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
  }
</style>