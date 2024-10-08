import JSZip from 'jszip';
import FileSaver from 'file-saver';
import moment from 'moment';

import { ExportExcel } from "@/utils/CsvExport";
import { IColumn } from '@/models/Index';

export function downloadFile(content: any, fileName: string, contentType: string = 'text/plain') {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export async function ExportEfCode(list: { name: string, text: string }[], names: string[], fileName: string = 'ef6.zip') {
  const zip = new JSZip();

  list.forEach(file => {
    zip.file(file.name, file.text);
  });

  zip.file('DbEntities.cs', names.map(name => `public DbSet<${name}> ${name} { get; set; }`).join('\r\n'));

  const content = await zip.generateAsync({ type: "blob" });
  FileSaver.saveAs(content, fileName);
}

export async function ColumnsExport(columns: IColumn[], fileName: string) {
  const exportDic = {
    "id": "id",
    "table": "表名",
    "name": "列名",
    "type": "类型",
    "null_able": "可空",
    "comments": "备注",
    "character_maximum_length": "最大长度",
    "numeric_precision": "数字长度",
    "numeric_scale": "小数位数",
  };

  const row1 = Object.keys(exportDic).map(key => exportDic[key]);
  const rows = columns
    .map(col => {
      return Object.keys(exportDic).map(key => col[key]);
    });
  ExportExcel([row1, ...rows], ["dbinfo", fileName, moment().format("YYYYMMDDHHmmss")].join("_"));
}

interface PickerOptions {
  types?: {
    description: string;
    accept: Record<string, string[]>;
  }[];
  excludeAcceptAllOption?: boolean;
  multiple?: boolean;
}

/**
 * 选择文件
 * @param pickerOpts
 * @returns
 */
export async function SelectFiles(pickerOpts: PickerOptions) {
  const fileHandles: { getFile: () => Promise<File> }[] = await window[
    'showOpenFilePicker'
  ](pickerOpts);
  try {
    const files = await Promise.all(fileHandles.map((t) => t.getFile()));
    return files;
  } catch {
    throw new Error('取消选择');
  }
}

/**
 * excel
 * @returns
 */
export async function SingleExcelSelect() {
  let file: File;
  try {
    const pickerOpts = {
      types: [
        {
          description: 'excel',
          accept: {
            'application/msexcel': ['.xls', '.xlsx'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };
    const files = await SelectFiles(pickerOpts);
    file = files[0];
    return file;
  } catch (err: any) {
    if (err.name === 'AbortError') return null;
    throw err;
  }
}