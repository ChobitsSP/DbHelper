import Copy from "./Copy";

export const uppercase = {
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

/**
 * 权限验证
 * @param el 
 * @param binding 
 * @param vnode 
 */
export function btnauth(el: HTMLElement, binding, vnode) {
  const store = vnode.context.$store;
  const list: string[] = store.state.user.btnList;
  const val: string = binding.value;

  // if (process.env.NODE_ENV === 'development') {
  //   return;
  // }

  // https://stackoverflow.com/questions/43003976/a-custom-directive-similar-to-v-if-in-vuejs
  if (list.indexOf(val) === -1) {
    // return
    // el.setAttribute("disabled", "true");
    // el.classList.add( "is-disabled");

    // replace HTMLElement with comment node
    const comment = document.createComment(" ");
    Object.defineProperty(comment, "setAttribute", {
      value: () => undefined
    });
    vnode.elm = comment;
    vnode.text = " ";
    vnode.isComment = true;
    vnode.context = undefined;
    vnode.tag = undefined;
    vnode.data.directives = undefined;

    if (vnode.componentInstance) {
      vnode.componentInstance.$el = comment;
    }

    if (el.parentNode) {
      el.parentNode.replaceChild(comment, el);
    }
  }
}

export const copy = Copy;