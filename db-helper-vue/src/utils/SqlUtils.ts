import { Parser, AST } from 'node-sql-parser';

function getDatabase(type: string) {
  if (type === 'Npgsql') return 'Postgresql';
  if (type === 'MySql.Data.MySqlClient') return 'MySQL';
  if (type === 'System.Data.SqlClient') return 'TransactSQL';
  // ::todo oracle
  return 'MySQL';
}

export function IsSelect(ast: AST | AST[]) {
  if (Array.isArray(ast)) return false;
  return ast.type === 'select';
}

/**
 * 判读sql语句最外层是否有条数限制
 */
export function HasLimit(ast: AST | AST[]) {
  if (Array.isArray(ast)) return false;
  if (ast.type === 'select') {
    const list = ast.limit?.value || [];
    if (list.length > 0) return true;
    const limit = ast['top']?.value;
    if (limit) return true;
  }
  return false;
}

export function ParseSql(sql: string, type: string) {
  const parser = new Parser();
  const ast = parser.astify(sql, {
    database: getDatabase(type),
  });
  return ast;
}

export function GetLimitSql(sql: string, type: string, limit = 0) {
  if (limit <= 0) return sql;
  const parser = new Parser();
  const ast = parser.astify(sql, {
    database: getDatabase(type),
  });

  if (Array.isArray(ast) || ast.type !== 'select') return sql;
  if (HasLimit(ast)) return sql;

  if (type === 'Npgsql') {
    ast.limit = {
      seperator: '',
      value: [
        {
          type: 'number',
          value: limit,
        },
      ]
    };
  } else if (type === 'MySql.Data.MySqlClient') {
    ast.limit = {
      seperator: '',
      value: [
        {
          type: 'number',
          value: limit,
        },
      ]
    };
  } else if (type === 'System.Data.SqlClient') {
    ast['top'] = { value: limit };
  } else if (type === 'Oracle.ManagedDataAccess.Client') {

  }

  return parser.sqlify(ast, {
    database: getDatabase(type),
  });
}