import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { Team } from '../contexts/Client'

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
  background-color: ${({ theme }) => theme.colors[Team.PIGI]};
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
  background-color: ${({ theme }) => theme.colors[Team.UNI]};
  text-align: right;
  padding-right: 4px;
  /* padding: 0.25rem; */
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
            duration: 1.5
          }
        }}
      >
        🦄
      </LineAnimated>
    </StyledLine>
  )
}
