import React, { useState } from 'react'
import Board from './board'
import ToDoList from './ToDoList'

function ToDoStatus (props) {
  return (
    <div className="todo-status">
      <div className="status-item done"><span className="number">100</span> Done</div>
      <div className="status-item doing"><span className="number">23</span> Doing</div>
      <div className="status-item pending"><span className="number">12</span> Pending</div>
      <div className="status-item note"><span className="number">5</span> Note</div>
    </div>
  )
}

export default function ToDo (props) {
  const [currentBoard, setCurrentBoard] = useState('all')
  const [boardList, setBoardList] = useState([{ name: 'all', label: 'All' }, { name: 'my', label: 'My Board' }])
  const [todoList, setTodoList] = useState([
    { title: 'Hello World !' }
  ])

  function handleAddBoard (data, cb) {
    setBoardList([...boardList, { name: Date.now(), label: data.label }])
    cb(null)
  }

  function handleAddTodo (e) {
    if (e.keyCode !== 13) return
    const input = e.target.value.trim()

    if (input) {
      setTodoList([...todoList, { title: input }])
    }

    e.target.value = ''
  }

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
          list={boardList}
          value={currentBoard}
          onSelected={e => setCurrentBoard(e)}
          onAdd={handleAddBoard}/>
      </div>
      <div className="content">
        <ToDoList list={todoList} />
      </div>
      <div className="footer">
        <ToDoStatus />
      </div>
    </div>
  )
}