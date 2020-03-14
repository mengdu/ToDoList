import ToDoStoreInterface from './base'

export default class LocalStore extends ToDoStoreInterface {
  constructor (options = {}) {
    super()
    this.perfix = options.perfix || ''
    this.boardKey = this.key('board-list')
    this.todoListKey = this.key('todo-list')
  }

  get (key, defaultValue = null) {
    // console.log('[GET]', key)
    const value = localStorage.getItem(key)
    return  value === null ? defaultValue : JSON.parse(value)
  }

  set (key, value) {
    // console.log('[SET]', key, value)
    return localStorage.setItem(key, JSON.stringify(value))
  }

  key (key) {
    return (this.perfix + key).trim()
  }

  async addBoard (data) {
    const list = this.get(this.boardKey, [])
    data.id = Date.now()
    data.createdAt = Date.now()
    this.set(this.boardKey, [...list, data])

    return { ret: 0, msg: 'ok' }
  }

  async delBoard (id) {
    const list = this.get(this.boardKey, [])

    for (const i in list) {
      if (list[i].id === id) {
        list.splice(i, 1)
        break
      }
    }

    this.set(this.boardKey, list)

    return { ret: 0, msg: 'ok' }
  }

  async getBoardList () {
    return { ret: 0, msg: 'ok', list: this.get(this.boardKey, []) }
  }

  async addTask (data) {
    const list = this.get(this.todoListKey, [])
    data.id = Date.now()
    data.createdAt = Date.now()

    this.set(this.todoListKey, [...list, data])
    return { ret: 0, msg: 'ok' }
  }

  async delTask (id) {
    const list = this.get(this.todoListKey, [])

    for (const i in list) {
      if (list[i].id === id) {
        list.splice(i, 1)
        break
      }
    }

    this.set(this.todoListKey, list)

    return { ret: 0, msg: 'ok' }
  }

  async updateTask (data) {
    const id = data.id
    const list = this.get(this.todoListKey, [])
    let hashChange = false

    for (const i in list) {
      if (list[i].id === id) {
        list[i] = {
          ...list[i],
          ...data
        }
        hashChange = true
      }
    }

    if (hashChange) {
      this.set(this.todoListKey, list)
    }
    return { ret: 0, msg: 'ok' }
  }

  async getTaskList (params) {
    const { page = 1, pageSize = 10 } = params
    let list = this.get(this.todoListKey, [])
    const start = (page - 1) * pageSize

    if (params.tagId) {
      list = list.filter(e => e.tagId === params.tagId)
    }

    const status = {
      done: 0,
      pending: 0
    }

    for (const i in list) {
      const item = list[i]
      if (item.status === 0) {
        status.done += 1
      }
      if (item.status === 1) {
        status.pending += 1
      }
    }

    const pageList = list.slice(start, start + pageSize)
  
    return {
      ret: 0,
      msg: 'ok',
      list: pageList,
      count: list.length,
      status: status
    }
  }
}
