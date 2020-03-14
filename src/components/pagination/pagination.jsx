import React from 'react'
import Pager from './paper'
import { classList } from '../../utils'

function Sizes (props) {
  if (props.sizes.length === 0) return null

  return (
    <select className="m-pagination-sizes" value={props.value} onChange={e => (props.onChange && props.onChange(e.target.value))}>
      {props.sizes.map((e, index) => <option key={index} value={e}>{e} 条/页</option>)}
    </select>
  )
}

export default function Pagination (props) {
  const background = props.background
  const align = props.align
  const fontBlod = props.fontBlod
  const sizes = props.sizes || [10, 20, 30, 50, 100]
  const layout = (props.layout || 'total,sizes,prev,pager,next').split(',')
  const prevText = props.prevText || 'Prev'
  const nextText = props.nextText || 'Next'
  const total = props.total || 0
  const pageSize = Math.abs(props.pageSize || 10)
  const currentPage = Math.abs(props.currentPage || 1)
  const pagerCount = Math.abs(props.pagerCount || 5)
  const pageCount = Math.ceil(total / pageSize)

  function toPage (num) {
    props.onCurrentChange && props.onCurrentChange(num)
  }

  function handlePage (page) {
    if (page === 'prev') {
      toPage(currentPage - 1)
    } else if (page === 'next') {
      toPage(currentPage + 1)
    } else {
      if (page !== currentPage) {
        toPage(page)
      }
    }
  }

  const layoutDict = {
    total: <span key="total" className="m-pagination-total">共 {total} 条</span>,
    sizes: <Sizes key="sizes" value={pageSize} sizes={sizes} onChange={props.onSizeChange}/>,
    pager: <Pager key="pager" currentPage={currentPage} pagerCount={pagerCount} pageCount={pageCount} onPage={(e) => handlePage(e)}/>,
    prev: <button key="prev" className="m-pagination-prev" onClick={e => handlePage('prev')} disabled={currentPage <= 1}>{prevText}</button>,
    next: <button key="next" className="m-pagination-next" onClick={e => handlePage('next')} disabled={currentPage >= pageCount}>{nextText}</button>
  }

  return (
    <div
      className={classList(['m-pagination', {
        'is-background': background,
        'text-center': align === 'center',
        'text-right': align === 'right',
        'm-pagination--blod': fontBlod
      }])}>
      {layout.map((item) => layoutDict[item])}
    </div>
  )
}
