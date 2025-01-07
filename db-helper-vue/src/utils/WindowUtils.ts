import { ref, onMounted, onUnmounted } from 'vue';
import { Observable } from 'rxjs';
import { useRx } from '@/mixins/RxBusMixins';

export function useWindowSize() {
  const width = ref(0);
  const height = ref(0);
  const rxHub = useRx();

  rxHub.add(Observable.fromEvent(window, 'resize').debounceTime(200).subscribe(() => { update() }));

  const update = () => {
    if (window) {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    }
  };

  update();

  return { width, height };
}

export function usePageVisibility() {
  const isActive = ref(true);

  // Handler function to update the isActive ref
  function handleVisibilityChange() {
    isActive.value = !document.hidden;
  }

  // Add event listener for visibility change when the component is mounted
  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  // Remove event listener when the component is unmounted
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  // Return the isActive ref as the result of the hook
  return isActive;
}

interface ElementHeightOptions {
  getElement: () => HTMLElement;
  defaultHeight?: number;
}

export function useElementHeight(props: ElementHeightOptions) {
  let resizeObserver: ResizeObserver = null;

  const height = ref(props.defaultHeight || 0);

  onMounted(() => {
    const dom = props.getElement();
    if (dom) {
      resizeObserver = new ResizeObserver(([entry]) => {
        if (entry) {
          height.value = entry.contentRect.height;
        }
      });
      resizeObserver.observe(dom);
    }
  });

  onUnmounted(() => {
    resizeObserver?.disconnect();
  });

  return {
    height,
  };
}