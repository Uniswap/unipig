import { useRef } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { transparentize } from 'polished'

import { useStyledTheme } from '../hooks'

const variants = (scale: number): any => ({
  from: {
    scale: 0.5,
    opacity: 1
  },
  to: {
    scale: scale,
    opacity: 0,
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 10
    }
  }
})

const UpdaterBase = styled.div`
  background-color: ${({ color }): string => color};
  border-radius: 10rem;
  z-index: -1 !important;
  position: relative;
`

const Circle = styled(motion.div)`
  position: absolute;
  z-index: -1 !important;
  border: 1px solid ${({ color }): string => color};
  background-color: ${({ color }): string => transparentize(0.8, color)};
  border-radius: 10rem;
`

function Circles({ total, color, scale, ...rest }): JSX.Element {
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
            variants={variants(scale)}
            initial="from"
            animate="to"
            onAnimationComplete={(): void => {
              circlesToShow.current = circlesToShow.current.filter((c): boolean => c.total !== i.total)
            }}
            {...rest}
          />
        )
      )}
    </>
  )
}

export default function Updater({ team, total, size = 20, scale = 3, ...rest }): JSX.Element {
  const theme = useStyledTheme()

  return (
    <UpdaterBase style={{ width: `${size / 2}px`, height: `${size / 2}px` }} color={theme.colors[team]} {...rest}>
      <Circles
        style={{ width: `${size}px`, height: `${size}px`, top: `-${size / 4}px`, right: `-${size / 4}px` }}
        total={total}
        scale={scale}
        color={theme.colors[team]}
      />
    </UpdaterBase>
  )
}
