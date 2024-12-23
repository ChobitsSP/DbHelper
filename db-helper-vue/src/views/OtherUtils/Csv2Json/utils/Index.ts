// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
export function CSVToArray(strData: string, strDelimiter = ","): string[][] {
  if (!strData) return [];

  const objPattern = new RegExp(
    `(\\${strDelimiter}|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\${strDelimiter}\\r\\n]*))`,
    "gi"
  );

  const arrData: string[][] = [[]];
  let arrMatches: RegExpExecArray | null;

  while ((arrMatches = objPattern.exec(strData))) {
    const strMatchedDelimiter = arrMatches[1];

    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      arrData.push([]);
    }

    const strMatchedValue = arrMatches[2]
      ? arrMatches[2].replace(/""/g, '"')
      : arrMatches[3];

    arrData.at(-1)?.push(strMatchedValue);
  }

  return arrData;
}

export function GetObjectList(csvString: string) {
  const result: Record<string, any>[] = [];
  const arr = CSVToArray(csvString, '\t');

  if (arr.length > 0) {
    const columns = arr[0]

    for (let i = 1; i < arr.length; i++) {
      const row = arr[i];
      const field: Record<string, any> = {};

      for (let j = 0; j < columns.length; j++) {
        const column = columns[j]
        let val: any = row[j]

        if (/^\d+$/.test(val)) {
          val = Number(val)
        }

        field[column] = val;
      }

      result.push(field)
    }
  }

  return result;
}