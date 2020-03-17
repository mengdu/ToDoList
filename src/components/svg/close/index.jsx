import React from 'react'
import { classList } from '../../../utils'

export default function SvgClose (props) {
  return (
    // <svg fill="none" viewBox="0 0 40 40" className={classList(['svg-icon svg-close', props.className])}>
    //   {/* <path fill="currentColor" d="M13 3.903l-.91-.97L8 7.297 3.91 2.933l-.91.97 4.09 4.363L3 12.63l.91.97L8 9.236l4.09 4.364.91-.97-4.09-4.364L13 3.903z"></path> */}
    //   <path fill="currentColor" d="m31.6 10.7l-9.3 9.3 9.3 9.3-2.3 2.3-9.3-9.3-9.3 9.3-2.3-2.3 9.3-9.3-9.3-9.3 2.3-2.3 9.3 9.3 9.3-9.3z"></path>
    // </svg>
    <svg viewBox="0 0 35 35" version="1.1" className={classList(['svg-icon svg-close', props.className])}>
      <path fill="currentColor" d="M19.5,17.5l5.1,5.1l-2,2l-5.1-5.1l-5.1,5.1l-2-2l5.1-5.1l-5.1-5.1l2-2l5.1,5.1l5.1-5.1l2,2L19.5,17.5z"></path>
    </svg>
  )
}
