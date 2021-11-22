import Clipboard from 'clipboard';
import { Message } from 'element-ui';

function GetString(value) {
  if (value == null) return "";
  return value.toString();
}

export default {
  bind: function (el, binding, vnode) {
    el.clipboard = new Clipboard(el, {
      text: (trigger) => {
        return GetString(binding.value);
      }
    });

    el.clipboard.on('success', (e) => {
      Message.success('复制成功');
    });
  },
  update: function (el, binding, vnode) {
    el.clipboard.text = () => {
      return GetString(binding.value);
    };
  },
  unbind: function (el, binding, vnode) {
    el.clipboard.destroy();
  },
}
