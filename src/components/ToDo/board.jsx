import React, { useState } from 'react'
import { classList } from '../../utils'

export default function Board (props) {
  const [showInput, setShowInput] = useState(false)

  function handleAddBoard (e) {
    if (e.keyCode !== 13) return

    const input = e.target.value.trim()
    if (input) {
      props.onAdd({ label: input }, (err) => {
        if (!err) setShowInput(false)
      })
    } else {
      setShowInput(false)
    }
  }

  const addButton = (
    showInput
      ? <input type="text" autoFocus className="board-input" placeholder="Board name" onKeyDown={handleAddBoard} onBlur={e => !e.target.value && setShowInput(false)}/>
      : <button title="Add a new board" onClick={(e) => {setShowInput(true)}} className="bt-add-board">+</button>
  )

  return (
    <div className="board">
      <div className="board-content">
        {props.list.map((item, index) => (
          <button
            className={classList(['board-item', { 'is-active': props.value === item.name }])}
            key={index}
            onClick={() => props.onSelected(item.name)}>{item.label}</button>
        ))}
        {addButton}
      </div>
      <div className="board-right">
      </div>
    </div>
  )
}
