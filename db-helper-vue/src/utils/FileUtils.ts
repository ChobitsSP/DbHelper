import JSZip from 'jszip';
import FileSaver from 'file-saver';

export function downloadFile(content: any, fileName: string, contentType: string = 'text/plain') {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export async function ExportEfCode(list: { name: string, text: string }[], names: string[], fileName: string = 'ef6.zip') {
  const zip = new JSZip();

  list.forEach(file => {
    zip.file(file.name, file.text);
  });

  zip.file('DbEntities.cs', names.map(name => `public DbSet<${name}> ${name} { get; set; }`).join('\r\n'));

  const content = await zip.generateAsync({ type: "blob" });
  FileSaver.saveAs(content, fileName);
}