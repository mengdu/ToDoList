import React from 'react'
import './checkbox.css'

export default function Checkbox (props) {
  const trueValue = typeof props.trueValue === 'undefined' ? true : props.trueValue
  const falseValue = typeof props.falseValue === 'undefined' ? false : props.falseValue
  const checked = props.value === trueValue
  const value = checked ? trueValue : falseValue

  function handleChange (e) {
    if (props.onChange) {
      props.onChange(e.target.checked ? trueValue : falseValue)
    }
  }

  return (
    <div className="checkbox">
      <label>
        <input type="checkbox" value={value} checked={checked} onChange={handleChange}/>
        <span className="status"></span>
      </label>
    </div>
  )
}
