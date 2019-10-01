import { useRef } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import { useStyledTheme } from '../hooks'

const variants = {
  from: {
    scale: 1,
    opacity: 0.75
  },
  to: {
    scale: 3.5,
    opacity: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 5
    }
  }
}

const Circle = styled(motion.div)`
  position: absolute;
  z-index: -1 !important;
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${({ theme }): string => theme.colors.white};
  border-radius: 10rem;
`

function Circles({ total }): JSX.Element {
  const circlesToShow = useRef([])

  if (
    !circlesToShow.current.map((c): number => c.total).includes(total) &&
    (circlesToShow.current.length === 0 ||
      circlesToShow.current[circlesToShow.current.length - 1].time < Date.now() - 1 * 1000)
  ) {
    circlesToShow.current = circlesToShow.current.concat([{ total, time: Date.now() }])
  }

  return (
    <>
      {circlesToShow.current.map(
        (i): JSX.Element => (
          <Circle
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

const UpdaterBase = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${({ color }): string => color};
  border-radius: 10rem;
`

export default function Updater({ team, total, ...rest }): JSX.Element {
  const theme = useStyledTheme()

  return (
    <UpdaterBase color={theme.colors[team]} {...rest}>
      <Circles total={total} />
    </UpdaterBase>
  )
}
