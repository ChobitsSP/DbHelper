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