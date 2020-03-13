export default class ToDoStoreInterface {
  async addBoard (data) {
    return { ret: 0, msg: 'ok' }
  }

  async delBoard (id) {
    return { ret: 0, msg: 'ok' }
  }

  async getBoardList () {
    return { ret: 0, msg: 'ok', list: [] }
  }

  async addTask (data) {
    return { ret: 0, msg: 'ok' }
  }

  async delTask (id) {
    return { ret: 0, msg: 'ok' }
  }

  async updateTask (data) {
    return { ret: 0, msg: 'ok' }
  }

  async getTaskList (params) {
    return { ret: 0, msg: 'ok', list: [], count: 0 }
  }
}
