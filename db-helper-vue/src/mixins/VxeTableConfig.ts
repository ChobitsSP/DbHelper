import { VxeUI } from 'vxe-table';

export function InitVxeConfig() {
  VxeUI.setConfig({
    table: {
      size: 'mini',
      stripe: true,
      resizable: true,
      border: true,
      showOverflow: 'tooltip',
      rowConfig: {
        isCurrent: true,
        isHover: true,
      },
    },
  });
}