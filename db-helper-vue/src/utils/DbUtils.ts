import Dexie from "dexie";
import _ from 'lodash';

export class MyModel {
  id?: number;
  name?: string;
  providerName?: string;

  connectionString = '';
  api_url = '';
  api_secret = '';

  constructor() {
    this.name = "name1";
    this.providerName = "Npgsql";
  }
}

//
// Declare Database
//
class DbConfigDatabase extends Dexie {
  public DbConfig: Dexie.Table<MyModel, number>; // id is number in this case

  public constructor() {
    super("DbConfigDatabase");
    this.version(1).stores({
      DbConfig: "++id,name,providerName,connectionString,api_url,api_secret"
    });
    this.DbConfig = this.table("DbConfig");
  }
}

const db = new DbConfigDatabase();

function init() {
  const json = window.localStorage.getItem("configs");

  try {
    if (json == null) return;

    const arr: any[] = JSON.parse(json);
    const list = arr.map(t => Object.assign(new MyModel(), t));
    list.forEach(t => db.DbConfig.add(t));

    window.localStorage.removeItem("configs");
  } catch (err) { }
}

init();

export async function DbConfigUpdate(item: MyModel) {
  if (item.id) {
    return db.DbConfig.update(item.id, item);
  } else {
    const list = await DbConfigList();
    const lastId = _.chain(list).map(t => t.id).max().value() || 0;
    item.id = lastId + 1;
    return db.DbConfig.add(item);
  }
}

export function DbConfigList() {
  return db.DbConfig.toArray();
}

export function DbConfigRemove(id: number) {
  return db.DbConfig.delete(id);
}

export function DbConfigGet(id: number) {
  return db.DbConfig.get(id);
}

export async function DbConfigDrag(id1: number, id2: number) {
  const row1 = await db.DbConfig.get(id1);
  const row2 = await db.DbConfig.get(id2);

  if (row1 && row2) {
    const temp = row1.id;
    row1.id = row2.id;
    row2.id = temp;

    await db.DbConfig.update(id2, row1);
    await db.DbConfig.update(id1, row2);
  }
}

export async function DbSortUpdate(ids: number[]) {
  const list = await DbConfigList();
  const newList = _.sortBy(list, t => ids.indexOf(t.id));
  newList.forEach((t, i) => t.id = i + 1);
  await db.DbConfig.clear();
  await db.DbConfig.bulkAdd(newList);
}