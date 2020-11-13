import moment from 'moment'

export function date(val, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (val) return moment(val).format(format)
  return val
}
