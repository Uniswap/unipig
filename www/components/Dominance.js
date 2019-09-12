import React from 'react'
import styled from 'styled-components'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'

import { Team } from '../contexts/Cookie'

const StyledLine = styled.span`
  width: 100%;
  position: relative;
  height: 48px;
`

const variants = {
  hidden: { width: 1 },
  show: {
    width: '100%',
    transition: {
      delay: 0.15,
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
}

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

const LineAnimated = styled(motion.div)`
  height: 12px;
  position: absolute;
  border-radius: 20px;
  top: 12px;
  left: 4px;
  background-color: ${({ theme, dominantTeam }) =>
    dominantTeam === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]};
`

export default function Dominance({ dominantTeam, percent }) {
  return (
    <StyledLine>
      <Line percent={'100%'} dominantTeam={dominantTeam === Team.UNI ? Team.PIGI : Team.UNI} />
      <LineAnimated
        initial={{ width: 0 }}
        animate={{
          width: `${percent}%`,
          transition: {
            ease: 'easeOut',
            duration: 1
          }
        }}
        dominantTeam={dominantTeam}
      />
    </StyledLine>
  )
}
