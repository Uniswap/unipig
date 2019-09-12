import React from 'react'
import styled, { css } from 'styled-components'

const StyledLine = styled.span`
  width: 100%;
  position: relative;
  height: 48px;
`

const Line = styled.div`
  width: calc(${({ lineWidth }) => lineWidth} - 8px);
  height: 3px;
  position: absolute;
  border-radius: 8px;
  top: 12px;
  left: 4px;
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
      <Line lineWidth={progress} />
    </StyledLine>
  )
}
