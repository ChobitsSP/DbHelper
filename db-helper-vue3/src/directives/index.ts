import { Directive } from 'vue';
import Clipboard from 'clipboard';

export const clipboard: Directive = {
  mounted(el, binding) {
    const clipboard = new Clipboard(el, {
      text: () => binding.value,
    });

    clipboard.on('success', (e) => {
      e.clearSelection();
      el.dispatchEvent(new CustomEvent('copied', { detail: e.text }));
    });

    clipboard.on('error', (e) => {
      el.dispatchEvent(new CustomEvent('copy-error', { detail: e }));
    });

    el._clipboard = clipboard;
  },

  unmounted(el) {
    if (el._clipboard) {
      el._clipboard.destroy();
      delete el._clipboard;
    }
  },
};