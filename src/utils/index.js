
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
