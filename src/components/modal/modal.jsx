import React from 'react'
import ReactDOM from 'react-dom'
import { useEffect, useRef } from 'react'
import './modal.css'

function isArr (v) {
  return Object.prototype.toString.call(v) === '[object Array]'
}

function Modal (props) {
  const modalEl = useRef(null)
  const multiple = isArr(props.children)
  const {canClickMaskClose, canEscKeydownClose, showClose} = props

  useEffect(() => {
    document.removeEventListener('keydown', handleKeydown, false)
    document.addEventListener('keydown', handleKeydown, false)

    return () => {
      document.removeEventListener('keydown', handleKeydown, false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleKeydown (e) {
    if (e.keyCode === 27 && canEscKeydownClose) {
      props.setClose('esc')
    }
  }

  function handleClose () {
    if (canClickMaskClose) {
      props.setClose('click-mask')
    }
  }

  const header = multiple ? props.children.filter(e => e.props && e.props.slot === 'header') : null
  const footer = multiple ? props.children.filter(e => e.props && e.props.slot === 'footer') : null
  const style = {
    ...props.wrapStyle,
    display: props.show ? null : 'none',
    zIndex: props['z-index'] || null
  }
  const className = [
    'modal-wrapper',
    props.className
  ].filter(e => !!e).join(' ')

  const children = (
    <div className={className} ref={modalEl} style={style} onClick={handleClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ ...props.style, width: props.width || null }}>
        <div className="modal-header">
          {(isArr(header) && header.length > 0) ? header : <span className="modal-title">{props.title}</span>}
          {showClose ? <button className="close" onClick={() => props.setClose('close-button')}>×</button> : null}
        </div>
        <div className="modal-content">
          {multiple ? props.children.filter(e => (!e.props || !e.props.slot)) : props.children}
        </div>
        {(isArr(footer) && footer.length > 0) ? (
          <div className="modal-footer">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )

  return props.appendToBody ? ReactDOM.createPortal(children, document.body) : children
}

export default Modal
