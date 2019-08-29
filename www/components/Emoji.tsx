import React, { useRef } from 'react'
import styled from 'styled-components'

const EmojiSpan = styled.span`
  user-select: none;
  font-size: 24px;

  :hover {
    cursor: ${({ onClick }): string => !!onClick && 'pointer'};
  }
`

interface EmojiArguments {
  emoji: string
  label: string
  onClick?: Function
}

export default function Emoji({ emoji, label = 'emoji', onClick, ...rest }: EmojiArguments): JSX.Element {
  const ref = useRef()

  function wrappedOnClick(event): void {
    event.preventDefault()
    onClick(event)
    if (ref && ref.current) {
      ;(ref as any).current.blur()
    }
  }

  function onEnterPressed(event): void {
    event.preventDefault()
    if (event.key === 'Enter') {
      onClick(event)
    }
  }

  return !!onClick ? (
    <EmojiSpan
      ref={ref}
      role="img"
      aria-label={label}
      onClick={wrappedOnClick}
      onKeyPress={onEnterPressed}
      tabIndex={0}
      {...rest}
    >
      {emoji}
    </EmojiSpan>
  ) : (
    <EmojiSpan ref={ref} role="img" aria-label={label} {...rest}>
      {emoji}
    </EmojiSpan>
  )
}
