import React from 'react'
import styled from 'styled-components'

import { Team } from '../contexts/Cookie'

const StyledLine = styled.span`
  width: 100%;
  position: relative;
  height: 48px;
`

const Line = styled.div`
  width: calc(${({ percent }) => percent} - 8px);
  height: 12px;
  position: absolute;
  border-radius: 20px;
  top: 12px;
  left: 4px;
  background-color: ${({ theme, color }) => (color === 'UNI' ? theme.colors[Team.UNI] : theme.colors[Team.PIG])};
  transition: width 0.5s ease;
`

const Dominance = props => (
  <StyledLine>
    <Line percent="100%" color={props.color === 'UNI' ? 'PIG' : 'UNI'} />
    <Line percent={props.percent + '%'} color={props.color === 'UNI' ? 'UNI' : 'PIG'} />
  </StyledLine>
)

export default Dominance
