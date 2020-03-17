import MessageBox from './message-box'

export default function Confirm (msg, options = {}) {
  return MessageBox(msg, { title: 'Dialog', ...options, type: 'confirm' })
}
