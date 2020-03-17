// 与 Date 保持一致的参数
function date (...args) {
  return new IDate(...args)
}

date.isLeapYear = (year) => {
  // 能被400整除，或者能被4整除但不能被100整除为闰年
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
}

date.isValid = (date) => {
  date = date instanceof Date ? date : new Date(date)

  return date.toString() !== 'Invalid Date'
}

date.days = (year, month) => {
  if (!year) throw new Error('The `year` params canot be empty')

  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  if (date.isLeapYear(year)) {
    days[1] = 29
  }

  return typeof month === 'undefined' ? [...days] : days[month - 1]
}

const units = ['year', 'month', 'date', 'hour', 'minute', 'second', 'millisecond']

const SEC = [60, 60, 24, 7, 365 / 12 / 7, 12]

const EN = 'second_minute_hour_day_week_month_year'.split('_')
const ZH = '秒_分钟_小时_天_周_个月_年'.split('_')

// eslint-disable-next-line camelcase
const zh_CN = (number, index) => {
  if (index === 0) return ['刚刚', '片刻后']
  const unit = ZH[parseInt(index / 2)]
  return [`${number} ${unit}前`, `${number} ${unit}后`]
}

// eslint-disable-next-line camelcase
const en_US = (number, index) => {
  if (index === 0) return ['just now', 'right now']
  let unit = EN[parseInt(index / 2)]
  if (number > 1) unit += 's'
  return [`${number} ${unit} ago`, `in ${number} ${unit}`]
}

const locales = {
  zh: zh_CN,
  en: en_US
}

export class IDate extends Date {
  /**
   * @param {'year'|'month'|'date'|'day'|'hour'|'minute'|'second'|'millisecond'} unit
   * @param {boolean} [isEndOf] - 是否结束时间
   * @returns {IDate}
   * **/
  startOf (unit, isEndOf = false) {
    let index = units.indexOf(unit)
    const isDay = unit === 'day' // 周

    if (!isDay && index === -1) {
      throw new Error(`The \`unit\` value '${unit}' is not in ${units}`)
    }

    if (isDay) index = 1

    const first = [1, 1, 0, 0, 0, 0]
    const end = [12, this.days(this.get('month')), 23, 59, 59, 999]
    const v = !isEndOf
      ? first.slice(index)
      : end.slice(index)

    if (isDay) {
      const day = this.get('day') // 0 ~ 6
      const date = this.get('date')
      v[0] = isEndOf ? (date + 6 - day) : date - day
    }

    // eslint-disable-next-line default-case
    switch (unit) {
      case 'year': return this.clone(v)
      case 'month': return this.clone(v)
      case 'date': return this.clone(v)
      case 'day': return this.clone(v) // 周日为一周的第一天
      case 'hour': return this.clone(v)
      case 'minute': return this.clone(v)
      case 'second': return this.clone(v)
      case 'millisecond': return this.clone(v)
    }
  }

  /**
   * @param {'year'|'month'|'date'|'day'|'hour'|'minute'|'second'|'millisecond'} unit
   * @returns {IDate}
   * **/
  endOf (unit) {
    return this.startOf(unit, true)
  }

  /**
   * @param {'year'|'month'|'date'|'day'|'hour'|'minute'|'second'|'millisecond'} unit
   * @param {number} [val = 1] - 倍数
   * @param {boolean} [isLast = false] - 往前还是往后
   * @returns {IDate}
   * **/
  nextOf (unit, val = 1, isLast = false) {
    let index = units.indexOf(unit)
    const isDay = unit === 'day' // 周

    if (!isDay && index === -1) {
      throw new Error(`The \`unit\` value '${unit}' is not in ${units}`)
    }

    if (isDay) index = 2

    const arr = [null, null, null, null, null, null, null]

    if (isLast) {
      arr[index] = isDay ? (this.get('date') - 7 * val) : (this.get(unit) - 1 * val)
    } else {
      arr[index] = isDay ? (this.get('date') + 7 * val) : (this.get(unit) + 1 * val)
    }

    return this.clone(arr)
  }

  /**
   * @param {'year'|'month'|'date'|'day'|'hour'|'minute'|'second'|'millisecond'} unit
   * @param {number} [val = 1] - 倍数
   * @returns {IDate}
   * **/
  lastOf (unit, val = 1) {
    return this.nextOf(unit, val, true)
  }

  /**
   * @param {[year, month, date, hour, minute, second, millisecond]} [values = []]
   * **/
  clone (values = []) {
    const newDate = new IDate(this)

    for (let i = 0; i < values.length; i++) {
      if (values[i] === null || typeof values[i] === 'undefined') continue

      newDate.set(units[units.length - values.length + i], values[i])
    }

    return newDate
  }

  /**
   * @param {'year'|'month'|'date'|'hour'|'minute'|'second'|'millisecond'} unit
   * @param {number|stringNumber} val
   * @returns {number}
   * **/
  set (unit, val) {
    val = +val

    switch (unit) {
      case 'year': return this.setFullYear(val)
      case 'month': return this.setMonth(val - 1)
      case 'date': return this.setDate(val)
      case 'hour': return this.setHours(val)
      case 'minute': return this.setMinutes(val)
      case 'second': return this.setSeconds(val)
      case 'millisecond': return this.setMilliseconds(val)
      default: throw new Error(`The \`unit\` value '${unit}' is not in ${units}`)
    }
  }

  /**
   * @param {'year'|'month'|'date'|'day'|'hour'|'minute'|'second'|'millisecond'} unit
   * @returns {number}
   * **/
  get (unit) {
    switch (unit) {
      case 'year': return this.getFullYear()
      case 'month': return this.getMonth() + 1 // 1 ~ 12
      case 'date': return this.getDate()
      case 'day': return this.getDay() // 0 ~ 6 星期天 0, 星期六 6
      case 'hour': return this.getHours()
      case 'minute': return this.getMinutes()
      case 'second': return this.getSeconds()
      case 'millisecond': return this.getMilliseconds()
      default: throw new Error(`The \`unit\` value '${unit}' is not in ${units}`)
    }
  }

  isLeapYear () {
    return date.isLeapYear(this.getFullYear())
  }

  days (month) {
    return date.days(this.getFullYear(), month)
  }

  format (formatStr) {
    const t = this
    const str = formatStr || 'YYYY-MM-DD HH:mm:ss'

    function padStart (val, len, pad) {
      const s = String(val)
      if (!s || s.length >= len) return s

      return Array(len - s.length + 1).join(pad) + s
    }

    const dict = {
      YYYY: () => t.getFullYear(),
      MM: () => padStart(t.getMonth() + 1, 2, 0),
      DD: () => padStart(t.getDate(), 2, 0),
      HH: () => padStart(t.getHours(), 2, 0),
      mm: () => padStart(t.getMinutes(), 2, 0),
      ss: () => padStart(t.getSeconds(), 2, 0),
      SSS: () => padStart(t.getMilliseconds(), 3, 0)
    }

    const REGEX_FORMAT = /Y{4}|M{2}|D{2}|H{2}|m{2}|s{2}|S{3}/g
    return str.replace(REGEX_FORMAT, (m) => dict[m]())
  }

  isValid () {
    return date.isValid(this)
  }

  create () {
    return new IDate(...arguments)
  }

  diff (date, local = 'zh') {
    const idate = date instanceof IDate ? date : this.create(date)

    if (!idate.isValid()) throw new Error('INVALID Date')

    if (!locales[local]) throw new Error('Not Supported local `' + local + '`')

    let second = (this.getTime() - idate.getTime()) / 1000

    const len = SEC.length
    const index = second < 0 ? 1 : 0
    const value = second = Math.abs(second)
    let i = 0

    for (; second >= SEC[i] && i < len; i++) {
      second /= SEC[i]
    }

    second = Math.floor(second)

    i *= 2

    if (second > (i === 0 ? 9 : 1)) i += 1

    return locales[local](second, i, value)[index].replace('%s', second)
  }

  /**
   * @param {number} val
   * @param {'year'|'month'|'date'|'hour'|'minute'|'second'|'millisecond'} unit
   * @returns {IDate}
   * **/
  add (val, unit) {
    const index = units.indexOf(unit)

    if (index === -1) {
      throw new Error(`The \`unit\` value '${unit}' is not in ${units}`)
    }

    const values = Array(units.length).fill(null)

    values[index] = this.get(unit) + val

    return this.clone(values)
  }
}

export default date
