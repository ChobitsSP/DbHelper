import Dexie from "dexie";

export class MyModel {
  id?: number;
  name?: string;
  providerName?: string;
  connectionString?: string;

  constructor() {
    this.name = "name1";
    this.providerName = "Npgsql";
    this.connectionString = "";
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
      DbConfig: "++id,name,providerName,connectionString"
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

export function DbConfigUpdate(item: MyModel) {
  if (item.id) {
    return db.DbConfig.update(item.id, item);
  } else {
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
