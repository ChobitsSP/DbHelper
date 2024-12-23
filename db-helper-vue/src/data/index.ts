export const DbTypeOracle = 'Oracle';
export const DbTypeMySql = 'MySql';
export const DbTypeMsSql = 'MsSql';
export const DbTypeNpgsql = 'Npgsql';

export const DbTypes = [
  {
    label: DbTypeOracle,
    value: 'Oracle.ManagedDataAccess.Client',
  },
  {
    label: DbTypeNpgsql,
    value: 'Npgsql',
  },
  {
    label: DbTypeMsSql,
    value: 'System.Data.SqlClient',
  },
  {
    label: DbTypeMySql,
    value: 'MySql.Data.MySqlClient',
  },
];

export const ExportColumnInfos = [
  {
    label: 'id',
    prop: 'id',
  },
  {
    label: '表名',
    prop: 'table',
  },
  {
    label: '列名',
    prop: 'name',
  },
  {
    label: '类型',
    prop: 'type',
  },
  {
    label: '可空',
    prop: 'null_able',
  },
  {
    label: '备注',
    prop: 'comments',
  },
  {
    label: '最大长度',
    prop: 'character_maximum_length',
  },
  {
    label: '数字长度',
    prop: 'numeric_precision',
  },
  {
    label: '小数位数',
    prop: 'numeric_scale',
  },
];