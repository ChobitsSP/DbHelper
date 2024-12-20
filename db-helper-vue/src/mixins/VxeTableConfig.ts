import { VxeUI } from 'vxe-table';

export function InitVxeConfig() {
  VxeUI.setConfig({
    table: {
      stripe: true,
      resizable: true,
      border: true,
      showOverflow: 'tooltip',
    },
  });
}