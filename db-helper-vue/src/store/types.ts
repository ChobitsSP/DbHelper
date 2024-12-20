import { IColumn, TableConfig } from '@/models/Index';

export interface TableState {
  table: string;
  columns: IColumn[];
  isHump: boolean;
}

export interface UserState {
  coninfo: TableConfig;
}

export interface RootState {
  user: UserState;
  table: TableState;
}
