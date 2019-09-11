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
  background-color: ${({ theme, dominantTeam }) =>
    dominantTeam === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]};
  transition: width 0.5s ease;
`

export default function Dominance({ dominantTeam, percent }) {
  return (
    <StyledLine>
      <Line percent="100%" dominantTeam={dominantTeam === Team.UNI ? Team.PIGI : Team.UNI} />
      <Line percent={`${percent}%`} dominantTeam={dominantTeam} />
    </StyledLine>
  )
}
