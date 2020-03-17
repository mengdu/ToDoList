import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Modal from './modal'

function Message (props) {
  const [show, setShow] = useState(true)

  function hanldeClose (type) {
    setShow(false)
    props.onClose(type)
  }

  return (
    <Modal
      show={show}
      title={props.title}
      canClickMaskClose={props.canClickMaskClose}
      canEscKeydownClose={props.canEscKeydownClose}
      showClose={props.showClose}
      setClose={hanldeClose}>
      {props.children}
      <div slot="footer" className="align-right">
        {props.type === 'confirm' ? <button className="modal-cancel-button" onClick={() => hanldeClose('cancel')}>{props.cancelButtonText}</button> : null}
        <button className="modal-confirm-button" onClick={() => hanldeClose('confirm')}>{props.confirmButtonText}</button>
      </div>
    </Modal>
  )
}

const defaultOptions = {
  type: '',
  title: 'Title',
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  canClickMaskClose: false,
  canEscKeydownClose: false,
  showClose: true
}

export default function alert (msg, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      ...defaultOptions,
      ...options
    }

    const div = document.createElement('div')
    div.className = opts.type === 'confirm' ? 'confirm-modal' : 'alert-modal'

    document.body.appendChild(div)

    function hanldeClose (type) {
      if (type === 'confirm') {
        resolve({ confirm: true, type })
      } else {
        if (opts.noReject) {
          resolve({ confirm: false, type })
        } else {
          reject(type)
        }
      }

      ReactDOM.unmountComponentAtNode(div)
      div.remove()
    }

    const instance = (<Message
      type={opts.type}
      title={opts.title}
      confirmButtonText={opts.confirmButtonText}
      cancelButtonText={opts.cancelButtonText}
      canClickMaskClose={opts.canClickMaskClose}
      canEscKeydownClose={opts.canEscKeydownClose}
      showClose={opts.showClose}
      onClose={hanldeClose}
      className={opts.className}
      width={opts.width}
      style={opts.style}
      >{msg}</Message>)

    ReactDOM.render(instance, div)
  })
}
