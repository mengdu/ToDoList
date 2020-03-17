
/**
 * @param {any} v
 * @param {'String' | 'Boolean' | 'Number' | 'Object' | 'Array' | 'Undefined' | 'Null' | 'Function' | 'Set'} type
 * **/
export function is (v, type) {
  return Object.prototype.toString.call(v) === `[object ${type}]`
}

export function classList (obj) {
  const arr = []
  for (const key in obj) {
    const value = obj[key]

    if (is(value, 'String')) {
      arr.push(value)
    } else if (value && is(value, 'Boolean')) {
      arr.push(key)
    } else if (is(value, 'Object')) {
      arr.push(classList(value))
    }
  }

  return arr.join(' ')
}

export function list2dict (arr, key = 'id', fn = e => e) {
  const dict = {}
  for (const i in arr) {
    const item = arr[i]
    dict[item[key]] = fn(item)
  }
  return dict
}

// 转63进制
export function numberConvert63 (num) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const res = []
  const len = str.length
  let n = num

  while (true) {
    const v1 = parseInt(n / len)
    const v2 = n % len

    res.unshift(str[v2])

    if (v1 > 0) {
      n = v1
    } else {
      break
    }
  }

  return res.join('')
}
