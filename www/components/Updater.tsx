import { useRef } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { transparentize } from 'polished'

import { useStyledTheme } from '../hooks'

const variants = {
  from: {
    scale: 1,
    opacity: 0.75
  },
  to: {
    scale: 3,
    opacity: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 10
    }
  }
}

const UpdaterBase = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ color }): string => color};
  border-radius: 10rem;
  z-index: -1 !important;
  position: relative;
`

const Circle = styled(motion.div)`
  position: absolute;
  top: -8px;
  left: -8px;
  z-index: -1 !important;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.5px solid ${({ theme, color }): string => color};

  background-color: ${({ theme, color }): string => transparentize(0.8, color)};
  border-radius: 10rem;
`

function Circles({ total, color }): JSX.Element {
  const circlesToShow = useRef([])
  const largestSoFar = useRef(total - 1)

  if (
    total > largestSoFar.current &&
    (circlesToShow.current.length === 0 ||
      circlesToShow.current[circlesToShow.current.length - 1].time + 0.5 * 1000 < Date.now()) &&
    circlesToShow.current.length < 6
  ) {
    circlesToShow.current = circlesToShow.current.concat([{ total, time: Date.now() }])
    largestSoFar.current = total
  }

  return (
    <>
      {circlesToShow.current.map(
        (i): JSX.Element => (
          <Circle
            color={color}
            key={i.total}
            variants={variants}
            initial="from"
            animate="to"
            onAnimationComplete={(): void => {
              circlesToShow.current = circlesToShow.current.filter((c): boolean => c.total !== i.total)
            }}
          />
        )
      )}
    </>
  )
}

export default function Updater({ team, total, ...rest }): JSX.Element {
  const theme = useStyledTheme()

  return (
    <UpdaterBase color={theme.colors[team]} {...rest}>
      <Circles total={total} color={theme.colors[team]} />
    </UpdaterBase>
  )
}
