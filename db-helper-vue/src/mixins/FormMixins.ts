import _ from 'lodash';
import { nextTick } from 'vue';
import { Form as ElForm } from 'element-ui';

interface IForm {
  fields: any[];
  validate(valid: any);
  validateField(prop: string, callback: any);
  clearValidate();
}

export function FormValidate(form: ElForm) {
  return new Promise<boolean>((resolve, reject) => {
    form.validate((valid, invalidFields) => {
      if (valid) {
        resolve(valid);
      } else {
        const err = _.chain(Object.keys(invalidFields))
          .map((key) => invalidFields[key])
          .flatten()
          .first()
          .value();
        reject(err);
        return false;
      }
    });
  });
}

export function GetFirstError(form: IForm) {
  const fields: string[] = form.fields.map(t => t.prop);

  return new Promise(resolve => {
    let flag = false;

    fields.forEach(prop => {
      if (flag) return;

      form.validateField(prop, msg => {
        flag = !!msg;

        if (flag) {
          resolve({ prop: prop, msg: msg });
        }
      });
    });
  });
}

function Delay(ms: number = 0) {
  return new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
}

export async function ClearValidate(form: IForm) {
  await nextTick();
  await Delay();
  form?.clearValidate();
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
