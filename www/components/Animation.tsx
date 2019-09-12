import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

export const AnimatedFrame = styled(motion.div)`
  display: grid;
  width: 100%;
`

export const containerAnimation = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.2
    }
  },
  exit: { opacity: 0, y: 48 }
}

export const childAnimation = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0
  }
}
