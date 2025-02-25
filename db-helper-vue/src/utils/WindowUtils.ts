import { ref, onMounted, onUnmounted } from 'vue';

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