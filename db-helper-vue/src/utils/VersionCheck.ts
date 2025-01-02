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

  if (currentScripts.length !== newScripts.length) {
    return false;
  }

  for (let i = 0; i < currentScripts.length; i++) {
    const currentSrc = currentScripts[i].getAttribute('src');
    const newSrc = newScripts[i].getAttribute('src');

    if (currentSrc !== newSrc) {
      return false;
    }
  }

  return true;
}

async function getPageHtml(url: string) {
  return fetch(url).then(res => res.text());
}