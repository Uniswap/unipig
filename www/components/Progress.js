import React from 'react'
import styled, { css } from 'styled-components'

const StyledLine = styled.span`
  width: 100%;
  position: relative;
  height: 32px;
`

const Line = styled.div`
  width: calc(${({ lineWidth }) => lineWidth} - 32px);
  height: 3px;
  margin-left: 12px;
  border-radius: 8px;
  ${({ theme, color }) =>
    color === 'grey'
      ? css`
          background-color: ${theme.colors.greys[8]};
        `
      : theme.gradientBackground};
`

const Line1 = styled.div`
  width: calc(${({ lineWidth }) => lineWidth} - 24px);
  height: 3px;
  margin-top: -3px;
  margin-left: 12px;
  border-radius: 8px;
  ${({ theme, color }) =>
    color === 'grey'
      ? css`
          background-color: ${theme.colors.greys[8]};
        `
      : theme.gradientBackground};
`

export default function Progress({ progress }) {
  return (
    <StyledLine>
      <Line lineWidth="100%" color="grey" />
      <Line1 lineWidth={progress} />
    </StyledLine>
  )
}
