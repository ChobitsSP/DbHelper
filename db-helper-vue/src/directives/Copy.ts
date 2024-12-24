import { ObjectDirective } from 'vue';
import Clipboard from 'clipboard';
import { Message } from 'element-ui';

function GetString(value) {
  if (value == null) return "";
  return value.toString();
}

export default {
  bind(el, binding, _vnode) {
    el.clipboard = new Clipboard(el, {
      text: (trigger) => {
        return GetString(binding.value);
      }
    });
    el.clipboard.on('success', (e) => {
      Message.success('复制成功');
    });
  },
  update(el, binding, _vnode) {
    el.clipboard.text = () => {
      return GetString(binding.value);
    };
  },
  unbind(el) {
    el.clipboard.destroy();
  },
} as ObjectDirective;
