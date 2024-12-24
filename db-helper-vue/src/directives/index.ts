import { ObjectDirective } from 'vue';
import Copy from './Copy';

export const uppercase: ObjectDirective = {
  inserted: function (el, _, vnode) {
    el.addEventListener("input", async function (e) {
      e.target.value = e.target.value.toUpperCase();
      const com = vnode.componentInstance;
      com && com.$emit("input", e.target.value.toUpperCase());
    });
  },
  update(el) {
    if (el.value != null) el.value = el.value.toUpperCase();
  }
};

export const copy = Copy;