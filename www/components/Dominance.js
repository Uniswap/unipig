import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

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
  background-color: ${({ theme }) => theme.colors[Team.PIGI]};
  transition: width 0.5s ease;
`

const LineAnimated = styled(motion.div)`
  height: 12px;
  position: absolute;
  border-radius: 20px;
  top: 12px;
  left: 4px;
  background-color: ${({ theme }) => theme.colors[Team.UNI]};
`

export default function Dominance({ percent }) {
  return (
    <StyledLine>
      <Line percent={'100%'} />
      <LineAnimated
        initial={{ width: 0 }}
        animate={{
          width: `${percent}%`,
          transition: {
            ease: 'easeOut',
            duration: 1
          }
        }}
      />
    </StyledLine>
  )
}
