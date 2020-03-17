import MessageBox from './message-box'

export default function Alert (msg, options = {}) {
  return MessageBox(msg, { title: 'Info', ...options, type: 'alert' })
}
