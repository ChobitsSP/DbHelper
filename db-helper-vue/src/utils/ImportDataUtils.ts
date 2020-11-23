import { IColumn } from "../models/Index";
import { TypeIsNumber, TypeIsDate, TypeIsString } from "./TableUtils";
import moment from "moment";
import _ from "lodash";
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import axios from "axios";

function IsEmpty(value: string) {
  return value == null || value == "";
}

export function RowTypeTrans(rows: { [key: string]: any }[], columns: IColumn[]) {
  return _.chain(rows).cloneDeep().forEach(row => {
    Object.keys(row).forEach(key => {
      const col = columns.find(t => t.name === key);
      if (col == null) return;

      const value: string = row[key];

      if (col.null_able && IsEmpty(value)) {
        row[key] = null;
        return;
      }

      if (TypeIsNumber(col.type)) {
        row[key] = parseFloat(value || "0");
        return;
      }

      if (TypeIsDate(col.type)) {
        row[key] = moment(value || new Date()).toDate();
      }
    });
  }).value();
}


async function AppendTableData(zip: JSZip, config, table: string) {
  const url = "/api/sql/listget";
  const params = Object.assign({ take: 5e4, table, }, config);
  const rsp: any = await axios.post(url, params);

  if (rsp.code === 0) {
    zip.file(table + ".json", JSON.stringify(rsp.data));
  }
  else {
    console.error(rsp.msg);
  }
}

export async function ExportDbDatas(config, tables: string[]) {
  let zip = new JSZip();
  await Promise.all(tables.map(t => AppendTableData(zip, config, t)));

  zip.generateAsync({ type: "blob" }).then(function (content) {
    FileSaver.saveAs(content, "download.zip");
  });
}