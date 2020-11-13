
interface IForm {
  fields: any[]
  validate(valid: any)
  validateField(prop: string, callback: any)
}

function FormValidate(form: IForm) {
  return new Promise((resolve, reject) => {
    form.validate(async valid => {
      if (valid) {
        resolve()
      } else {
        const err = await GetFirstError(form)
        reject(err)
        return false
      }
    })
  })
}

function GetFirstError(form: IForm) {
  const fields: string[] = form.fields.map(t => t.prop)

  return new Promise(resolve => {
    let flag = false

    fields.forEach(prop => {
      if (flag) return

      form.validateField(prop, msg => {
        flag = !!msg

        if (flag) {
          resolve({ prop: prop, msg: msg })
        }
      })
    })
  })
}

export default {
  methods: {
    submitForm(formName: string = 'form') {
      return FormValidate(this.$refs[formName])
    },
    resetForm(formName: string = 'form') {
      try {
        this.$refs[formName].resetFields()
      }
      catch (ex) {
        //console.error(ex);
      }
    }
  }
}
