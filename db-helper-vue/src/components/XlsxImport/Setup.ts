import { ref, computed, watchEffect } from 'vue';
import { Message } from 'element-ui';

interface MyProps {
  getGridColumns: () => any[];
  upload?: (rows: any[]) => Promise<void>;
  getGroupCount: () => number;
}

function Delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function* groupByCount<T = any>(items: readonly T[], count: number): Generator<T[]> {
  if (count <= 0) {
    throw new Error('Count must be a positive integer');
  }

  for (let i = 0; i < items.length; i += count) {
    yield items.slice(i, i + count);
  }
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

  const tableData = ref([]);
  const columns = ref([]);

  watchEffect(() => {
    columns.value = [
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
    tableData.value = [];
  });

  const loading = ref(false);

  // 进度
  const taskIndex = ref(0);
  const taskTotal = ref(0);
  const grid = ref();

  async function onStart() {
    const list = tableData.value.filter(t => t.up_state !== 1);
    if (list.length === 0) {
      Message.warning('无可导入数据');
      return;
    }

    const glist = Array.from(groupByCount(list, props.getGroupCount()));

    taskTotal.value = glist.length;
    taskIndex.value = 0;

    loading.value = true;

    for (let i = 0; i < glist.length; i++) {
      if (taskTotal.value === 0) {
        loading.value = false;
        break;
      }
      const rows = glist[i];
      try {
        await onAdd(rows);
        rows.forEach(t => {
          t.up_state = 1;
          t.err_msg = '';
        });
      } catch (err: any) {
        rows.forEach(t => {
          t.up_state = 2;
          t.err_msg = err.message;
        });
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
    return isUploading.value ? `${taskIndex.value}/${taskTotal.value}` : 'Start Import';
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

  const hasFailed = computed(() => tableData.value.some(t => t.up_state === 2));
  function exportFailed() {

  }

  return {
    loading,

    grid,
    columns,
    tableData,

    onLoad(rows) {
      rows.forEach((row) => {
        row.up_state = 0;
        row.err_msg = '';
      });
      tableData.value = rows;
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