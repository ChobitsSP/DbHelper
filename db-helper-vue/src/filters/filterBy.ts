import _ from 'lodash';

/**
 * Filter filter for arrays
 */
export default function filterBy<T = any>(arr: T[], search: string, ...keys: string[]) {
  arr = convertArray(arr)
  if (search == null) {
    return arr
  }
  if (typeof search === 'function') {
    return arr.filter(search)
  }
  // cast to lowercase string
  search = ('' + search).toLowerCase()

  // extract and flatten keys
  const res: T[] = [];

  for (let i = 0, l = arr.length; i < l; i++) {
    const item = arr[i];
    const $key = _.get(item, '$key');
    const $value = _.get(item, '$value');

    const val = (item && $value) || item
    let j = keys.length
    if (j) {
      while (j--) {
        const key = keys[j]
        if ((key === '$key' && contains($key, search)) ||
          contains(_.get(val, key), search)) {
          res.push(item)
          break
        }
      }
    } else if (contains(item, search)) {
      res.push(item)
    }
  }
  return res
}

function contains(val: any, search: string) {
  let i: number;
  if (isPlainObject(val)) {
    const keys = Object.keys(val)
    i = keys.length
    while (i--) {
      if (contains(val[keys[i]], search)) {
        return true
      }
    }
  } else if (Array.isArray(val)) {
    i = val.length
    while (i--) {
      if (contains(val[i], search)) {
        return true
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1
  }
  return false;
}

function isPlainObject(obj: any) {
  return toString.call(obj) === '[object Object]'
}

function convertArray(value): any[] {
  if (Array.isArray(value)) {
    return value
  } else if (isPlainObject(value)) {
    // convert plain object to array.
    const keys = Object.keys(value)
    let i = keys.length
    const res = new Array(i)
    let key
    while (i--) {
      key = keys[i]
      res[i] = {
        $key: key,
        $value: value[key]
      }
    }
    return res
  } else {
    return value || []
  }
}