import { ref, computed, onMounted } from 'vue';

import $script from 'scriptjs';
import Resumable from 'resumablejs';
import { Message } from 'element-ui';

export function useResumableUpload() {
  const fileInput = ref<HTMLInputElement>();
  const loading = ref(false);

  const totalChunks = ref(0);
  const uploadedChunks = ref(0);

  const progress = computed(() => {
    if (totalChunks.value === 0) return 0;
    return Math.round((uploadedChunks.value / totalChunks.value) * 100);
  });

  const r = new Resumable({
    target: '/api/File/upload',
  });

  r.on('fileAdded', function (file) {
    totalChunks.value = file.chunks.length;
    loading.value = true;
    r.upload();
  });

  r.on('fileProgress', function (file) {
    uploadedChunks.value = file.chunks.filter((chunk: any) => chunk.status() === 'success').length;
  });

  r.on('fileSuccess', function (file) {
    // All chunks are uploaded
    fetch('/api/File/merge', {
      method: 'POST',
      body: new URLSearchParams({ resumableIdentifier: file.uniqueIdentifier, fileName: file.fileName })
    }).then(response => response.json())
      .then(data => {
        if (data.code !== 0) {
          Message.error(data.msg);
        }
        else {
          Message.success('File successfully uploaded and merged');
        }
      })
      .catch(error => console.error('Error merging file:', error));
  });

  r.on('fileSuccess', () => {
    loading.value = false;
  });

  r.on('fileError', () => {
    loading.value = false;
  });

  onMounted(() => {
    r.assignBrowse(fileInput.value, false);
  });

  function onCancel() {
    r.cancel();
    loading.value = false;
  }

  return {
    fileInput,
    loading,
    progress,
    totalChunks,
    uploadedChunks,
    onCancel,
  };
}

export async function ResumableUpload(dom: HTMLInputElement) {
  // await LoadScript('static/lib/resumable.min.js');
  const r = new Resumable({
    target: '/api/File/upload',
  });

  r.assignBrowse(dom, false);

  r.on('fileAdded', function (file) {
    r.upload();
  });

  r.on('fileSuccess', function (file) {
    // All chunks are uploaded
    fetch('/api/File/merge', {
      method: 'POST',
      body: new URLSearchParams({ resumableIdentifier: file.uniqueIdentifier, fileName: file.fileName })
    }).then(response => response.json())
      .then(data => {
        if (data.code !== 0) {
          Message.error(data.msg);
        }
        else {
          Message.success('File successfully uploaded and merged');
        }
      })
      .catch(error => console.error('Error merging file:', error));
  });
}

function LoadScript(path: string) {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : '/';
  return new Promise(resolve => {
    $script(baseUrl + path, resolve);
  });
}