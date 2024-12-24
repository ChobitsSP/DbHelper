import { ref } from 'vue';
import { read, WorkBook, utils } from 'xlsx';
import moment from 'moment';
import { Message } from 'element-ui';
import _ from 'lodash';

export interface ColumnInfo {
  label: string;
  prop: string;
  formatter?: (row: Record<string, any>, column: ColumnInfo, val: any) => any;
}

function GetTrimVal(value: any) {
  if (typeof value !== "string") return value;
  value = value.trim();
  return value;
}

function GetRow<T = any>(obj: Record<string, any>, dic?: ColumnInfo[]) {
  const item: Record<string, any> = {};

  if (dic?.length > 0) {
    dic.forEach(kv => {
      let val = GetTrimVal(obj[kv.label]);
      if (kv.formatter != null) {
        val = kv.formatter(obj, kv, val);
      }
      if (val instanceof Date) {
        val = moment(val).format('YYYY-MM-DD HH:mm:ss');
      }
      item[kv.prop] = val;
    });
  }
  else {
    for (const key in obj) {
      let val = GetTrimVal(_.get(obj, key));
      if (val instanceof Date) {
        val = moment(val).format('YYYY-MM-DD HH:mm:ss');
      }
      item[key] = val;
    }
  }
  return item as T;
}

interface DownloadTempOptions {
  columns: ColumnInfo[];
  fileName?: string;
  data?: any[];
}

// /**
//  * 下载模板
//  * @param options 
//  */
// export function DownloadTemp(options: DownloadTempOptions) {
//   const rows = [];
//   rows.push(options.columns.map(t => t.label));

//   if (options.data != null) {
//     options.data.forEach(t => {
//       rows.push(options.columns.map(kv => t[kv.prop]));
//     });
//   }

//   ExportToXlsx({
//     rows,
//     fileName: options.fileName,
//     sheetName: 'Sheet1',
//   });
// }

interface MyRow<T> extends Record<string, any> {
  row: T;
  /** 导入状态 0 待上传 1 成功 2 失败 */
  up_state: number;
  /** 导入异常消息 */
  err_msg: string;
}

function ReadXlsx(file: File) {
  return new Promise<WorkBook>((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      // var filename = file.name;
      // pre-process data
      let binary = "";
      const bytes = new Uint8Array(e.target.result as ArrayBuffer);
      const length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      // call 'xlsx' to read the file
      const oFile = read(binary, {
        type: "binary",
        cellDates: true,
        cellStyles: true,
      });
      resolve(oFile);
    };
    fileReader.readAsArrayBuffer(file);
  });
}

/**
 * 从excel文件中加载行
 * @param file 
 * @param columns 
 * @param sheetName 
 * @returns 
 */
export async function LoadRows<T = any>(file: File, columns?: ColumnInfo[], sheetName?: string) {
  const workBook = await ReadXlsx(file);
  if (sheetName == null) {
    sheetName = workBook.SheetNames[0];
  }
  const sheet = workBook.Sheets[sheetName];
  if (sheet == null) throw new Error('找不到sheet: ' + sheetName);
  return utils.sheet_to_json(sheet).map((t) => GetRow<T>(t, columns));
}

interface RowModel {
  /**
   * 0 待上传 1 成功 2 失败
   */
  up_state: number;
  err_msg: string;
  Submit(): Promise<void>;
}

export function useTableImport() {
  const task_i = ref(0);
  const task_total = ref(0);
  const task_loading = ref(false);

  async function submit(rows: RowModel[]) {
    if (task_loading.value) return;
    const list = rows.filter(t => t.up_state === 0);

    if (list.length === 0) {
      Message.warning("无可上传数据");
      return;
    }

    task_i.value = 0;
    task_total.value = list.length;

    task_loading.value = true;

    for (let i = 0; i < list.length; i++) {
      const row = list[i];

      try {
        await list[i].Submit();
        row.up_state = 1;
      } catch (err: any) {
        row.up_state = 2;
        row.err_msg = err.message;
      }
      finally {
        task_i.value++;
      }
    }

    Message.success("上传完成");
    task_loading.value = false;
  }

  function upStateFormat(obj: { cellValue: number }) {
    return ["待上传", "上传成功", "上传失败"][obj.cellValue];
  }

  function tableRowStyle(obj: { row: RowModel }) {
    const row = obj.row;

    if (row.up_state === 2) {
      return {
        background: '#f5e8eb',
      };
    }

    return {};
  }

  return {
    task_i,
    task_total,
    task_loading,
    upStateFormat,
    tableRowStyle,
    submit,
  };
}