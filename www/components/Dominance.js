import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { Team } from '../contexts/Client'
import Emoji from './Emoji'
import Updater from './Updater'

const StyledLine = styled.span`
  width: 100%;
  position: relative;
  height: 48px;
`

const Line = styled.div`
  width: calc(${({ percent }) => percent} - 8px);
  margin-top: 3.5px;
  height: 20px;
  position: absolute;
  border-radius: 20px;
  top: 12px;
  left: 4px;
  background-color: ${({ theme, team }) => (team === Team.UNI ? theme.colors[Team.PIGI] : theme.colors[Team.UNI])};
  transition: width 0.5s ease;
  padding: 0.25rem;
`

const LineAnimated = styled(motion.div)`
  height: 28px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  border-radius: 20px;
  top: 12px;
  left: 4px;
  background-color: ${({ theme, team }) => theme.colors[team]};
  text-align: right;
  padding-right: 4px;
  /* padding: 0.25rem; */
`

const StyledUpdater = styled(Updater)`
  position: absolute;
  top: 2px;
  left: 2px;
`

export default function Dominance({ team, updateTotal, UNIDominance, PIGIDominance }) {
  return (
    <StyledLine>
      <Line team={team} percent={'100%'} />
      <LineAnimated
        team={team}
        initial={{ width: 0 }}
        animate={{
          width: `${(team === Team.UNI ? UNIDominance : PIGIDominance) * 100}%`,
          transition: {
            ease: 'easeOut',
            duration: 1.5
          }
        }}
      >
        <StyledUpdater team={team} total={updateTotal} />
        <Emoji emoji={team === Team.UNI ? '🦄' : '🐷'} label={team === Team.UNI ? 'unicorn' : 'pig'} />
      </LineAnimated>
    </StyledLine>
  )
}
