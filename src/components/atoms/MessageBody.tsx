import React, { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

type Props = {
  className?: string
  message: string
  html: string
}

export default function MessageBody({ className, message, html }: Props) {
  const history = useHistory()
  const messageEl = useRef(null)

  useEffect(() => {
    if (!messageEl.current) {
      return
    }
    const listener = (e) => {
      const href = e.target.getAttribute('href')
      const url = new URL(href)
      if (url.host === location.host) {
        history.push(url.pathname)
      } else {
        window.open(url.href, '_blank')
      }

      e.preventDefault()
      e.stopPropagation()
    }
    messageEl.current
      .querySelectorAll('a')
      .forEach((e) => e.addEventListener('click', listener))
    return () => {
      messageEl.current
        .querySelectorAll('a')
        .forEach((e) => e.removeEventListener('click', listener))
    }
  }, [messageEl])

  return (
    <Wrap
      className={className}
      ref={messageEl}
      attr-message={message}
      dangerouslySetInnerHTML={{ __html: html }}
    ></Wrap>
  )
}

const Wrap = styled.div`
  padding: 5px 0 0 0;
  word-break: break-all;
  p {
    font-size: 14px;
    line-height: 20px;
    margin: 0;
    white-space: pre-wrap;
  }
  a {
    color: var(--color-link);
  }
`
