import { ref, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useRx } from './RxBusMixins';

interface Config {
  callback?: Function;
}

interface MyProps<T> {
  init: (config?: T) => Promise<any>;
  submit?: (config: Config & T, data?: any) => Promise<any>;
  onClose?: (config: Config & T) => Promise<any>;
  maxWidth?: number;
  /** rxemit 使用的事件名称 */
  openEventName?: string;
}

export function useDialog<T = {}>(props: MyProps<T>) {
  const show = ref(false);
  const winSize = useWindowSize();

  const rxHub = useRx();

  if (props.openEventName) {
    rxHub.on(props.openEventName, open);
  }

  const width = computed(() => {
    if (!props.maxWidth) return '90%';
    return winSize.width.value > props.maxWidth ? props.maxWidth + 'px' : '90%';
  });

  let _config: Config & T;

  function open(config: Config & T) {
    _config = config;
    return props.init(config);
  }

  function onSubmit(data?: any) {
    return props.submit && props.submit(_config, data);
  }

  function onClose() {
    if (props.onClose) {
      props.onClose(_config);
    }
    else {
      show.value = false;
    }
  }

  function GetConfig() {
    return _config;
  }

  return {
    show,
    width,

    open,
    onClose,
    onSubmit,
    GetConfig,
  };
}
