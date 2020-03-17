import React from 'react'
import Checkbox from '../checkbox'
import { classList } from '../../utils'

function ToDoItem (props) {

  return (
    <div className={classList(['todo-item', { 'is-done': props.data.status === 0 }])}>
      <div className="left">
        <Checkbox value={props.data.status} trueValue={0} falseValue={1} onChange={props.onStatus}/>
      </div>
      <div className="content">
        <h4 className="title">{props.data.title}</h4>
      </div>
    </div>
  )
}

export default function ToDoList (props) {
  return (
    <ul className="todo-list">
      {props.list.length === 0 ? <div className="no-data">No data</div> : null}
      {props.list.map((item, index) => {
        return (
          <ToDoItem data={item} key={index} onStatus={e => props.onChangeStatus(e, item, index)}/>
        )
      })}
    </ul>
  )
}
