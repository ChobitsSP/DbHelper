import { ref, computed, watchEffect } from 'vue';
import { Message } from 'element-ui';

interface MyProps {
  getGridColumns: () => any[];
  upload?: (row: any) => Promise<void>;
}

function Delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useSetup(props: MyProps) {
  let onAdd = props.upload;

  if (!onAdd) {
    onAdd = async (row: any) => {
      await Delay(1000);
      if (Math.random() > 0.5) {
        throw new Error('导入失败');
      }
    };
  }

  const uploadStates = [
    { label: '待导入', value: 0 },
    { label: 'Success', value: 1 },
    { label: 'Fail', value: 2 },
  ];

  const gridOptions = ref({
    columns: [],
    data: [],
  });

  watchEffect(() => {
    gridOptions.value.columns = [
      {
        field: 'up_state',
        title: 'Status',
        width: 120,
        fixed: 'left',
        filters: uploadStates,
        formatter: ({ cellValue }) => {
          return uploadStates.find(t => t.value === cellValue)?.label || cellValue;
        },
      },
      {
        field: 'err_msg',
        title: 'ErrorMsg',
        fixed: 'left',
        width: 120,
      },
      ...props.getGridColumns(),
    ];
  });

  const loading = ref(false);

  // 进度
  const taskIndex = ref(0);
  const taskTotal = ref(0);
  const grid = ref();

  async function onStart() {
    const list = gridOptions.value.data.filter(t => t.up_state !== 1);
    if (list.length === 0) {
      Message.warning('无可导入数据');
      return;
    }

    taskTotal.value = list.length;
    taskIndex.value = 0;

    loading.value = true;

    for (let i = 0; i < list.length; i++) {
      if (taskTotal.value === 0) {
        loading.value = false;
        break;
      }
      const row = list[i];
      try {
        await onAdd(row);
        row.up_state = 1;
      } catch (err: any) {
        row.up_state = 2;
        row.err_msg = err.message;
      }
      taskIndex.value++;
    }

    loading.value = false;
  }

  const isUploading = computed(() => loading.value && taskTotal.value > 0);

  function onStop() {
    taskTotal.value = 0;
    loading.value = false;
  }

  const executeText = computed(() => {
    return isUploading.value ? `导入中 ${taskIndex.value}/${taskTotal.value}` : '开始导入';
  });

  function onExecute() {
    if (isUploading.value) {
      onStop();
    } else {
      onStart();
    }
  }

  function getCellStyle({ row, column }) {
    if (column.property === 'up_state') {
      if (row.up_state === 2) {
        return { background: 'rgb(253, 226, 226)' };
      } else if (row.up_state === 1) {
        return { background: 'rgb(225, 243, 216)' };
      }
    }
    return {};
  }

  const hasFailed = computed(() => gridOptions.value.data.some(t => t.up_state === 2));
  function exportFailed() {

  }

  return {
    loading,

    grid,
    gridOptions,
    onLoad(rows) {
      rows.forEach((row) => {
        row.up_state = 0;
        row.err_msg = '';
      });
      gridOptions.value.data = rows;
    },

    getCellStyle,
    onExecute,
    executeText,

    onStart,
    onStop,
    isUploading,

    hasFailed,
    exportFailed,
  };
}