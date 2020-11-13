export class FormModel {
  public table: string = null;
  public skip: number = 0;
  public take: number = 5;

  public GetRules(vm: vm) {
    const rules = {
      name: [{ required: true, message: "请输入", trigger: "blur" }]
    };

    return rules;
  }
}

interface vm {
  item: FormModel;
}
