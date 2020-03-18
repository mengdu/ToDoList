import React, { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortAmountUp, faSortAmountDownAlt, faCheck, faCode } from '@fortawesome/free-solid-svg-icons'
import Board from './board'
import ToDoList from './ToDoList'
import Pagination from '../pagination'
import { Confirm } from '../modal'
import { list2dict } from '../../utils'
import taskDoneAudio from '../../assets/audio/task_done.mp3'
import Modal from '../modal/modal'
// import successAudio from '../../assets/audio/success.mp3'
// import buttonClickAudio from '../../assets/audio/button_click.mp3'

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

function ViewRaw (props) {
  const currentBoard = props.currentBoard
  const [data, setData] = useState('')

  useMemo(() => {
    getRaw()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBoard])

  function getRaw () {
    const params = {
      tagId: currentBoard !== 'all' ? currentBoard : ''
    }

    props.store.getTodoRaw(params).then(res => {
      const dict = {}
      for (const i in res.list) {
        const item = res.list[i]
        if (dict[item.tagId]) {
          dict[item.tagId].list.push(item)
        } else {
          dict[item.tagId] = {
            board: item.board,
            list: [item]
          }
        }
      }

      const raw = []

      for (const i in dict) {
        raw.push(`**${dict[i].board ? dict[i].board.label : '未分类'}**\n\n`)
        raw.push(dict[i].list.map(e => {
          return `+ [${e.status === 0 ? 'x' : ' '}] ${e.title}`
        }).join('\n'))
        raw.push('\n\n')
      }
  
      setData(raw.join('') + '\n')
    })
  }
  return (
    <Modal show={props.show} title="View Raw">
      <div className="view-raw">
        <textarea defaultValue={data} className="td-input td-input--block" rows="10"></textarea>
      </div>
      <div slot="footer" className="align-right">
        <button className="modal-confirm-button" onClick={props.onHide}>Confirm</button>
      </div>
    </Modal>
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
  const [sortCreatedAt, setSortCreatedAt] = useState(1)
  const [sortStatus, setSortStatus] = useState()
  const [player, setPlayer] = useState(null)
  const [showRaw, setShowRaw] = useState(false)

  const [allBoardList, boardListDict] = useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return [
      [].concat([{ name: 'all', label: 'All' }], boardList.map(e => {
        e.name = e.id
        return e
      })),
      list2dict(boardList, 'id')
    ]
  }, [boardList])

  useMemo(() => {
    handleGetList()
  }, [currentBoard, page, sortCreatedAt, sortStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleAddBoard (data, cb) {
    store.addBoard(data).then(res => {
      store.getBoardList().then(result => {
        setBoardList(result.list)
      })
    })
    cb(null)
  }

  function handleRemoveBoard (id) {
    const boardName = boardListDict[id] ? boardListDict[id].label : id
    Confirm(<div>Are you sure to remove the <strong>{boardName}</strong> board?</div>, { noReject: true }).then(e => {
      if (!e.confirm) return
      store.delBoard(id).then(res => {
        store.getBoardList().then(result => {
          setCurrentBoard('all')
          setBoardList(result.list)
        })
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

  function handleDeleteTodo (e) {
    Confirm(<div>Are you sure you want to delete this task?</div>, { noReject: true }).then(c => {
      if (c.confirm) {
        store.delTask(e.id).then(() => {
          handleGetList()
        })
      }
    })
  }

  function handleTodoStatus (status, item, index) {
    // console.log(index, status, item.id)
    store.updateTask({
      id: item.id,
      status: status
    }).then((res) => {
      handleGetList()
    })

    // done
    if (status === 0 && player) {
      player.src = taskDoneAudio
      player.play()
    }
  }

  function handleGetList () {
    const params = {
      tagId: currentBoard !== 'all' ? currentBoard : '',
      page: page,
      sortKey: 'createdAt',
      sortType: sortCreatedAt === 1 ? 'desc' : 'asc',
      status: sortStatus
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

    if (props.enableAudio) {
      const audio = new Audio()
      audio.volume = 0.8

      setPlayer(audio)
    }
  }, [store]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="to-do">
      <ViewRaw show={showRaw} onHide={() => setShowRaw(false)} currentBoard={currentBoard} store={store}/>

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
          onAdd={handleAddBoard}
          onRemove={() => handleRemoveBoard(currentBoard)}/>
        <div className="control">
          <div className="main">
            <button className={'td-btn' + (sortStatus === 0 ? ' is-checked' : '')}
              title="Show done only"
              onClick={() => setSortStatus(sortStatus === 0 ? undefined : 0)}>
                <FontAwesomeIcon icon={faCheck} />
            </button>
            <button className="td-btn"
              title="Sort time"
              onClick={() => setSortCreatedAt(sortCreatedAt === 1 ? 2 : 1)}>
                <FontAwesomeIcon icon={sortCreatedAt === 1 ? faSortAmountUp : faSortAmountDownAlt} />
            </button>
          </div>
          <div className="right">
            <button className="td-btn"
              title="View raw"
              onClick={() => setShowRaw(true)}
              >
                <FontAwesomeIcon icon={faCode} />
            </button>
            <ToDoStatus data={status} />
          </div>
        </div>
      </div>
      <div className="content">
        <ToDoList
          list={todoList}
          onChangeStatus={handleTodoStatus}
          onDelete={handleDeleteTodo}/>
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
