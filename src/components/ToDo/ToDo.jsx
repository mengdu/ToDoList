import React, { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Board from './board'
import ToDoList from './ToDoList'
import Pagination from '../pagination'

function ToDoStatus (props) {
  return (
    <div className="todo-status">
      <div className="status-item"><span className="number">{props.data.total}</span> Total</div>
      <div className="status-item pending"><span className="number error">{props.data.pending}</span> Pending</div>
      <div className="status-item done"><span className="number info">{props.data.done}</span> Done</div>
      {/* <div className="status-item doing"><span className="number">23</span> Doing</div> */}
      {/* <div className="status-item note"><span className="number">5</span> Note</div> */}
    </div>
  )
}

export default function ToDo (props) {
  const store = props.store
  const [currentBoard, setCurrentBoard] = useState('all')
  const [boardList, setBoardList] = useState([])
  const [todoList, setTodoList] = useState([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [status, setStaus] = useState({ done: 0, pending: 0 })

  const allBoardList = useMemo(() => {
    return [].concat([{ name: 'all', label: 'All' }], boardList.map(e => {
      e.name = e.id
      return e
    }))
  }, [boardList])

  useMemo(() => {
    handleGetList()
  }, [currentBoard, page]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleAddBoard (data, cb) {
    store.addBoard(data).then(res => {
      store.getBoardList().then(result => {
        setBoardList(result.list)
      })
    })
    cb(null)
  }

  function handleRemoveBoard (id) {
    store.delBoard(id).then(res => {
      store.getBoardList().then(result => {
        setCurrentBoard('all')
        setBoardList(result.list)
      })
    })
  }

  function handleAddTodo (e) {
    if (e.keyCode !== 13) return
    const input = e.target.value.trim()

    if (input) {
      const newTodo = {
        title: input,
        status: 1,
        type: 1,
        tagId: currentBoard !== 'all' ? currentBoard : null
      }

      store.addTask(newTodo).then(res => {
        // store.getTaskList({}).then(res => {
        //   setTodoList(res.list)
        // })
        handleGetList()
      })
      // setTodoList([...todoList, { title: input }])
    }

    e.target.value = ''
  }

  function handleTodoStatus (status, item, index) {
    // console.log(index, status, item.id)
    store.updateTask({
      id: item.id,
      status: status
    }).then((res) => {
      handleGetList()
    })
  }

  function handleGetList () {
    const params = {
      tagId: currentBoard !== 'all' ? currentBoard : '',
      page: page
    }

    store.getTaskList(params).then(res => {
      setTodoList(res.list)
      setCount(res.count)
      setStaus(res.status)
    })
  }

  useEffect(() => {
    store.getBoardList().then(result => {
      setBoardList(result.list)
    })

    // handleGetList()
  }, [store]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="to-do">
      <div className="header">
        <div className="input-box">
          <input type="text"
            placeholder="What needs to be done?"
            className="todo-input"
            onKeyDown={handleAddTodo}/>
        </div>
        <Board
          list={allBoardList}
          value={currentBoard}
          onSelected={e => {setCurrentBoard(e);setPage(1)}}
          onAdd={handleAddBoard}/>
        <div className="control">
          <ToDoStatus data={status} />
          <div className="right">
            {currentBoard !== 'all'
              ? <button className="td-btn" title="Remove current board" onClick={() => handleRemoveBoard(currentBoard)}><FontAwesomeIcon icon={faTrashAlt} /></button>
              : null}
          </div>
        </div>
      </div>
      <div className="content">
        <ToDoList list={todoList} onChangeStatus={handleTodoStatus}/>
      </div>
      <div className="footer">
        <Pagination
          currentPage={page}
          total={count}
          pageSize={10}
          layout="prev,pager,next"
          background={true}
          onCurrentChange={setPage}
          />
      </div>
    </div>
  )
}
