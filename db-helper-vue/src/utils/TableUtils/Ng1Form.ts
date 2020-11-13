import { IColumn } from "../../models/Index";

export default function(tableName: string, cols: IColumn[]) {
  const arr: string[] = [];

  arr.push(
    `<ng-form name="form" ng-init="setFormScope(this)" class="form-horizontal" novalidate>`
  );

  cols.forEach(t => {
    arr.push(
      `<div class="form-group" ng-class="{ 'has-error': form.${
        t.name
      }.$invalid && trySubmit }">`
    );
    arr.push(`<label class="control-label">${t.comments || t.name}</label>`);
    arr.push(`<input type="text" 
    ng-model="item.${t.name}" 
    class="form-control" 
    name="${t.name}" 
    ${t.null_able ? "" : "required"} />`);

    if (!t.null_able) {
      arr.push(
        `<span ng-show="form.${
          t.name
        }.$error.required && trySubmit" class="err-msg">请输入${
          t.comments
        }</span>`
      );
    }

    arr.push(`</div>`);
  });

  arr.push(`</ng-form>`);

  return arr.join("\r\n");
}
