import { IColumn } from '@/models/Index';

export interface TableState {
  table: string;
  columns: IColumn[];
  isHump: boolean;
}

export interface UserState {
  coninfo: any;
}

export interface RootState {
  user: UserState;
  table: TableState;
}
