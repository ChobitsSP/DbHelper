import { hump } from '@/filters/Index';
import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";
import { GetType } from "./GolangStruct";

function toHump(name: string) {
  return name
    .replace(/_([a-z])/g, function (g) {
      return g[1].toUpperCase();
    })
    .replace(/^[a-z]/g, (g) => g.toUpperCase());
}

function GetTsProp(col: IColumn) {
  const isAuto = col.id === 1 && TypeIsNumber(col.type);

  const plist: string[] = [];

  if (col.id === 1) {
    plist.push("primary_key");
  }
  if (!col.null_able) {
    plist.push("not null");
  }

  if (isAuto) {
    plist.push("AUTO_INCREMENT");
  }

  plist.push(`column:${col.name}`);

  const typeStr = (col.null_able ? "*" : "") + GetType(col);

  return `${toHump(col.name)} ${typeStr} \`json:"${col.name
    }" gorm:"${plist.join(";")}"\`\t//${col.comments}`;
}

export default function (tableName: string, cols: IColumn[]): string {
  const arr: string[] = [];

  arr.push(GetList(tableName, cols));
  arr.push(GetUpdate(tableName, cols));
  arr.push(GetDelete(tableName, cols));

  return arr.join("\n");
}

function GetList(tableName: string, cols: IColumn[]): string {
  const className = hump(tableName);
  const key = hump(cols[0].name);

  return `
  type ${className}ListReq struct {
    request.PageInfo
    ${key} ${GetType(cols[0])} \`json:"${cols[0].name}"\`
  }
  
  func ${className}List(req ${className}ListReq) (*request.PageResult, error) {
    list := []models.${className}{}
    items := global.Db.Model(models.${className}{}).Where("1=1")
    
    if req.${key} > 0 {
      items = items.Where("${cols[0].name} = ?", req.${key})
    }

    result, err := req.PagerResult(items, &list)
    if err != nil {
      return nil, err
    } else {
      return result, nil
    }
  }`;
}

function GetUpdate(tableName: string, cols: IColumn[]) {
  const className = hump(tableName);
  const key = hump(cols[0].name);

  const UpdateStr = cols.map(col => {
    const field = hump(col.name);
    return `old.${field} = item.${field}`;
  }).join("\n");

  return `
  type ${className}UpdateReq struct {
    Item models.${className}
  }

  func ${className}Update(req ${className}UpdateReq) (*models.${className}, error) {
    item := req.Item
  
    if item.${key} > 0 {
      old := models.${className}{}
      err := global.Db.First(&old, item.${key}).Error
      if err != nil {
        response.Fail(c)
        return
      }
      
      ${UpdateStr}

      err = global.Db.Save(&old).Error
      if err != nil {
        return nil, err
      }

      return &old, nil
    }
  
    err := global.Db.Create(&item).Error
    if err != nil {
      return nil, err
    }
  
    return &item, nil
  }`;
}

function GetDelete(tableName: string, cols: IColumn[]) {
  const className = hump(tableName);
  const key = hump(cols[0].name);

  return `
  func ${className}Delete(req ${className}UpdateReq) error {
    item := req.Item
  
    err := global.Db.Delete(item).Error
  
    if err != nil {
      return err
    } else {
      global.LOG.Warn("删除${className}", zap.String("userid", user.Id), zap.Any("${key}", item.${key}))
      return nil
    }
  }`;
}