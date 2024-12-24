import _ from 'lodash';
import { IColumn } from '@/models/Index';

export function GetDataBaseDiff(columns1: IColumn[], columns2: IColumn[]) {
  const tableNames1 = _.uniq(columns1.map(col => col.table.toLowerCase()));
  const tableNames2 = _.uniq(columns2.map(col => col.table.toLowerCase()));

  // 获取对比库缺少的表
  const missingTables = tableNames1.filter(name => !tableNames2.includes(name));

  // 对比字段类型不一致
  const typeMismatchColumns = _.chain(columns1)
    .map(col1 => {
      const col2 = columns2.find(c => 
        c.table.toLowerCase() === col1.table.toLowerCase() && 
        c.name.toLowerCase() === col1.name.toLowerCase()
      );
      if (!col2 || col1.type === col2.type) return null;
      return {
        ...col1,
        type2: col2.type,
      };
    }).filter(t => t != null).value();

  // 对比缺少的列
  const missingColumns = _.chain(columns1)
    .filter(t => !missingTables.includes(t.table.toLowerCase()))
    .map(col1 => {
      const col2 = columns2.find(c => 
        c.table.toLowerCase() === col1.table.toLowerCase() && 
        c.name.toLowerCase() === col1.name.toLowerCase()
      );
      if (!col2) return col1;
      return null;
    }).filter(t => t != null).value();

  return {
    missingTables,
    typeMismatchColumns,
    missingColumns,
  };
}