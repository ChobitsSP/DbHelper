import * as DbUtils from '@/utils/DbUtils';
import { LoadJson } from '@/utils/FileUtils';
import * as FileUtils from '@/utils/FileUtils';

export function useConfigData(props) {
  // ::todo 修改为excel导入导出

  async function importConfig(file) {
    const list = await LoadJson<any[]>(file);
    const plist = list.map(item => {
      delete item.id;
      return DbUtils.DbConfigUpdate(item);
    });
    await Promise.all(plist);
    await props.refresh();
    return false;
  }

  function exportConfig(list: any[]) {
    FileUtils.downloadFile(JSON.stringify(list), 'config.json');
  }

  return {
    importConfig,
    exportConfig,
  };
}