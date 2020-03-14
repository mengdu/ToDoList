import React, { useMemo } from 'react'
import { classList } from "../../utils"

function pagers (pagerCount, pageCount, currentPage) {
  // copy form https://github.com/ElemeFE/element/blob/dev/packages/pagination/src/pager.vue
  const halfPagerCount = (pagerCount - 1) / 2

  let showPrevMore = false
  let showNextMore = false

  if (pageCount > pagerCount) {
    if (currentPage > pagerCount - halfPagerCount) {
      showPrevMore = true
    }
    if (currentPage < pageCount - halfPagerCount) {
      showNextMore = true
    }
  }
  const pagers = []

  if (showPrevMore && !showNextMore) {
    const startPage = pageCount - (pagerCount - 2)
    for (let i = startPage; i < pageCount; i++) {
      pagers.push(i)
    }
  } else if (!showPrevMore && showNextMore) {
    for (let i = 2; i < pagerCount; i++) {
      pagers.push(i)
    }
  } else if (showPrevMore && showNextMore) {
    const offset = Math.floor(pagerCount / 2) - 1
    for (let i = currentPage - offset; i <= currentPage + offset; i++) {
      pagers.push(i)
    }
  } else {
    for (let i = 2; i < pageCount; i++) {
      pagers.push(i)
    }
  }

  return {
    pagers,
    showPrevMore,
    showNextMore
  }
}

export default function Pager (props) {
  const pageCount = props.pageCount
  const pagerCount = props.pagerCount
  const currentPage = props.currentPage
  const pager = useMemo(() => {
    return pagers(pagerCount, pageCount, currentPage)
  }, [pageCount, pagerCount, currentPage])

  function handleClick (e) {
    if (e.target.tagName === 'UL') return

    let newPage = e.target.dataset.page

    const pagerCountOffset = pagerCount - 2
  
    if (newPage === 'prev-more') {
      newPage = currentPage - pagerCountOffset
    } else if (newPage === 'next-more') {
      newPage = currentPage + pagerCountOffset
    }

    if (newPage !== currentPage) {
      props.onPage && props.onPage(Number(newPage))
    }
  }

  return (
    <ul className="m-pager" onClick={handleClick}>
      {pageCount > 0 ? <li key="first" className={classList(['m-pager-number', { active: currentPage === 1 }])} data-page="1">1</li> : null}
      {pager.showPrevMore ? <li key="prev-more" className={classList(['m-pager-number'])} data-page="prev-more">&laquo;</li> : null}
      {pager.pagers.map((e, index) => <li key={index} className={classList(['m-pager-number', {active: currentPage === e }])} data-page={e}>{e}</li>)}
      {pager.showNextMore ? <li key="next-more" className={classList(['m-pager-number'])} data-page="next-more">&raquo;</li> : null}
      {(currentPage <= pageCount && pageCount !== 1) ? <li key="last" className={classList(['m-pager-number', { active: currentPage === pageCount }])} data-page={pageCount}>{pageCount}</li> : null}
    </ul>
  )
}
