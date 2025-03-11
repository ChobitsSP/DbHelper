import { onMounted, onUnmounted } from 'vue';
import { useRx } from './RxBusMixins';

let id = 0;

export function useWindowOpen() {
  const rxHub = useRx();

  function onMessage(event: MessageEvent) {
    if (typeof event.data?.n === 'string') {
      rxHub.emit(event.data.n, event.data.v);
    }
  }

  onMounted(() => {
    window.addEventListener('message', onMessage);
  });

  onUnmounted(() => {
    window.removeEventListener('message', onMessage);
  });

  const eventVarName = '_open_even_name';

  function close(data?: any) {
    const eventId = window[eventVarName];
    if (eventId) {
      window.opener?.postMessage({
        n: eventId,
        v: data,
      }, '*');
    }
    window.close();
  }

  function open(url: string, callback: (data?: any) => void) {
    const w = window.open(url, '_blank');
    const eventId = 'open_event_' + id++;
    w[eventVarName] = eventId;
    rxHub.on(eventId, callback);
  }

  return {
    open,
    close,
  };
}