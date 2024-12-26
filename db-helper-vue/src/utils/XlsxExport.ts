import ExcelJS from 'exceljs';

export function exportToExcel(data: Record<string, any>[], fileName?: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  const columns = Object.keys(data[0]);
  worksheet.columns = columns.map(key => ({ header: key, key }));
  worksheet.addRows(data);
  return workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'export'}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  });
}