import React from 'react'

function ToDoItem (props) {
  return (
    <div className="todo-item">{props.data.title}</div>
  )
}

export default function ToDoList (props) {
  return (
    <ul className="todo-list">
      {props.list.map((item, index) => {
        return (
          <ToDoItem data={item} key={index} />
        )
      })}
    </ul>
  )
}
