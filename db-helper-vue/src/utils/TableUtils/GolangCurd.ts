import { hump } from '@/filters/Index';
import { IColumn } from "../../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "../TableUtils";

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

  arr.push(`type ${toHump(tableName)} struct {`);

  cols.forEach((col) => {
    arr.push(GetTsProp(col));
  });

  arr.push(`}`);

  return arr.join("\n");
}

function GetList(tableName: string, cols: IColumn[]): string {
  const className = hump(tableName);
  return `
  type ${className}ListReq struct {
    request.PageInfo
  }
  
  func ${className}List(c *gin.Context) {
    req := ${className}ListReq{}
    _ = c.ShouldBindJSON(&req)
  
    list := []models.${className}{}
    items := global.Db.Model(models.${className}{}).Where("1=1")
    result, err := req.PagerResult(items, &list)
  
    if err != nil {
      response.FailWithMessage(fmt.Sprintf("获取数据失败，%v", err), c)
    } else {
      response.OkWithData(result, c)
    }
  }`;
}

function GetUpdate(tableName: string, cols: IColumn[]) {
  const className = hump(tableName);
  const key = hump(cols[0].name);

  const UpdateStr = cols.map(col => {
    const field = hump(col.name);
    return `old.${field} = item.${field}`;
  }).join("\r\n");

  var str = `
  type ${className}UpdateReq struct {
    Item models.${className}
  }

  func ${className}Update(c *gin.Context) {
    req := ${className}UpdateReq{}
    _ = c.ShouldBindJSON(&req)
  
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
        response.Fail(c)
        return
      }
  
      response.OkWithData(old, c)
      return
    }
  
    err := global.Db.Create(&item).Error
    if err != nil {
      response.Fail(c)
      return
    }
  
    response.OkWithData(item, c)
  }`;
}

function GetType(col: IColumn) {
  if (TypeIsNumber(col.type)) {
    return `int`;
  }
  if (TypeIsDate(col.type)) {
    return `time.Time`;
  }
  if (TypeIsString(col.type)) {
    return `string`;
  }

  return `string`;
}
