import React, { useRef } from 'react'
import styled, { css } from 'styled-components'

const EmojiSpan = styled.span`
  user-select: none;
  font-size: 24px;

  ${({ clickable }) =>
    clickable &&
    css`
      :hover {
        cursor: pointer;
      }
    `}

  :active:focus {
    outline: none;
  }
`

export default function Emoji({ label = 'emoji', onClick = false, children, ...rest }) {
  const ref = useRef()
  const clickable = !!onClick

  function wrappedOnClick(event) {
    event.preventDefault()
    onClick(event)
    ref.current && ref.current.blur()
  }

  function onEnterPressed(event) {
    event.preventDefault()
    if (event.key === 'Enter') {
      onClick(event)
    }
  }

  return (
    <EmojiSpan
      ref={ref}
      role="img"
      aria-label={label}
      {...(clickable
        ? {
            clickable,
            onClick: wrappedOnClick,
            onKeyPress: onEnterPressed,
            tabIndex: '0'
          }
        : {})}
      {...rest}
    >
      {children}
    </EmojiSpan>
  )
}
