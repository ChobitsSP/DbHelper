export interface IColumn {
  id: number;

  /**
   * 数据库字段名称
   * @type {string}
   * @memberof IColumn
   */
  name: string;
  type: string;
  null_able: boolean;

  /**
   * 字段注释
   * @type {string}
   * @memberof IColumn
   */
  comments?: string;
}
