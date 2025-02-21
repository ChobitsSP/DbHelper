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
    return ast.limit?.value || ast['top']?.value;
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