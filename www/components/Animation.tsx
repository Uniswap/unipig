import { motion } from 'framer-motion'
import styled from 'styled-components'

export const AnimatedFrame = styled(motion.div)`
  display: grid;
  width: 100%;
`

export const containerAnimationNoDelay = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0,
      when: 'beforeChildren',
      staggerChildren: 0.15
    }
  },
  exit: { opacity: 0, y: 24 }
}

export const containerAnimation = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15,
      when: 'beforeChildren',
      staggerChildren: 0.15
    }
  }
}

export const childAnimation = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0
  }
}
