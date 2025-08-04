import { VxeUI } from 'vxe-table';

export function InitVxeConfig() {
  VxeUI.setConfig({
    table: {
      size: 'mini',
      stripe: false,
      resizable: true,
      border: true,
      showOverflow: 'tooltip',
      showHeaderOverflow: 'tooltip',
      rowConfig: {
        isCurrent: true,
        isHover: true,
      },
    },
  });
}