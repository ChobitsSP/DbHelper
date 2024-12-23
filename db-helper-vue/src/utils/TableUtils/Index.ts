import { IColumn } from '@/models/Index';

import ASPxGridView from "./ASPxGridView";
import ASPxPivotGrid from "./ASPxPivotGrid";
import ElementForm from "./ElementForm";
import ElementRule from "./ElementRule";
import ElTable from "./ElTable";
import Ng1Form from "./Ng1Form";
import TsClass from "./TsClass";
import DevExtreme from "./DevExtreme";
import OracleSeq from "./OracleSeq";
import GolangCurd from "./GolangCurd";
import GolangStruct from "./GolangStruct";
import GinApi from "./GinApi";
// import Ef6 from "./Ef6";
import EfCore from "./EfCore";
import JavaModel from "./JavaModel";
import JavaMybatis from "./JavaMybatis";
import JavaOldToNew from "./JavaOldToNew";
import Markdown from "./Markdown";
import VxeTable from "./VxeTable";
import AlertColumn from './AlertColumn';

export {
  TsClass,
  VxeTable,
  ElementForm,
  EfCore,
  AlertColumn,
  // Ef6,
  ElementRule,
  ASPxGridView,
  ASPxPivotGrid,
  ElTable,
  Ng1Form,
  DevExtreme,
  OracleSeq,
  GolangStruct,
  GolangCurd,
  GinApi,
  JavaModel,
  JavaMybatis,
  JavaOldToNew,
  Markdown,
};

interface FunctionItem {
  label: string;
  value: (tableName: string, cols: IColumn[]) => string;
}

export const AllFunctions: FunctionItem[] = [
  { label: 'TsClass', value: TsClass },
  { label: 'VxeTable', value: VxeTable },
  { label: 'ElementForm', value: ElementForm },
  { label: 'EfCore', value: EfCore },
  { label: 'AlertColumn', value: AlertColumn },
  // { label: 'Ef6', value: Ef6 },
  { label: 'ElementRule', value: ElementRule },
  { label: 'ASPxGridView', value: ASPxGridView },
  { label: 'ASPxPivotGrid', value: ASPxPivotGrid },
  { label: 'ElTable', value: ElTable },
  { label: 'Ng1Form', value: Ng1Form },
  { label: 'DevExtreme', value: DevExtreme },
  { label: 'OracleSeq', value: OracleSeq },
  { label: 'GolangStruct', value: GolangStruct },
  { label: 'GolangCurd', value: GolangCurd },
  { label: 'GinApi', value: GinApi },
  { label: 'JavaModel', value: JavaModel },
  { label: 'JavaMybatis', value: JavaMybatis },
  { label: 'JavaOldToNew', value: JavaOldToNew },
  { label: 'Markdown', value: Markdown },
];