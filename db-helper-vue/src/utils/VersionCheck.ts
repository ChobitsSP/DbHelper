import { MessageBox } from 'element-ui';

export async function useVersionCheck() {
  const isNew = await getIsNew();
  if (isNew) return;
  await MessageBox.confirm('检测到新版本，是否刷新页面？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    window.location.reload();
  }).catch(() => { });
}

/**
 * 对比当前页面 和 最新页面的 script hash
 */
async function getIsNew() {
  const html = await getPageHtml(window.location.origin + '?t=' + Date.now());
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const currentScripts = document.querySelectorAll('script[src]');
  const newScripts = doc.querySelectorAll('script[src]');

  // 对比 chunk-vendors.[hash].js index.[hash].js

  const names = ['chunk-vendors', 'index'];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const reg = new RegExp(`\/${name}\.[^\.]+\.js`);

    const currentScript = Array.from(currentScripts).find(script => reg.test(script.getAttribute('src')));
    const newScript = Array.from(newScripts).find(script => reg.test(script.getAttribute('src')));

    if (!currentScript || !newScript) continue;

    const currentSrc = currentScript.getAttribute('src');
    const newSrc = newScript.getAttribute('src');

    if (currentSrc !== newSrc) {
      console.log('currentSrc:', currentSrc);
      console.log('newSrc:', newSrc);
      return false;
    }
  }

  return true;
}

async function getPageHtml(url: string) {
  return fetch(url).then(res => res.text());
}