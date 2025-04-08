import $script from 'scriptjs';
import Resumable from 'resumablejs';
import { Message } from 'element-ui';

export async function ResumableUpload(dom: HTMLInputElement) {
  // await LoadScript('static/lib/resumable.min.js');
  const r = new Resumable({
    target: '/api/File/upload',
    query: function (file) {
      return { resumableIdentifier: file.uniqueIdentifier, resumableChunkNumber: file.currentChunk + 1 };
    }
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
        Message.success('File successfully uploaded and merged');
        console.log('File successfully merged:', data);
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