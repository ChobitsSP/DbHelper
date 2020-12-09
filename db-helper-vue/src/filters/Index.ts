import moment from 'moment'

export function date(val, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (val) return moment(val).format(format)
  return val
}

export function hump(name: string) {
  return name
    .replace(/_([a-z])/g, function (g) {
      return g[1].toUpperCase();
    })
    .replace(/^[a-z]/g, (g) => g.toUpperCase());
}