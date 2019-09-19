import { useEffect, useCallback } from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { useAnimation, motion } from 'framer-motion'

const BASE_INTERVAL = 0.5 // seconds
const MAXIMUM_DURATION = 16 // seconds
const TIME_TO_MINIMUM = 0.2 // seconds
const MINIMUM_WIDTH = 0.1 // %
const MAXIMUM_WIDTH = 0.975 // %

const GRANULARITY = Math.round(MAXIMUM_DURATION / BASE_INTERVAL)
const TIME_INTERVAL_TO_MINIMUM = TIME_TO_MINIMUM * (1 / MAXIMUM_DURATION)

const evenTimeIntervals = [0, ...Array.from(Array(GRANULARITY).keys()).map(i => (i + 1) / GRANULARITY)]
const customTimeIntervals = [0, TIME_INTERVAL_TO_MINIMUM, ...evenTimeIntervals.slice(2).map(i => Math.pow(i, 2))]
const randomWidthIntervals = [
  0,
  MINIMUM_WIDTH,
  ...Array.from(Array(GRANULARITY - 2).keys())
    .map(() => Math.random())
    .sort()
    .map(i => MINIMUM_WIDTH + i * (MAXIMUM_WIDTH - MINIMUM_WIDTH)),
  MAXIMUM_WIDTH
]

const variants = {
  start: {
    width: '0%',
    opacity: 1
  },
  animating: {
    width: randomWidthIntervals.map(i => `${Math.round(i * 100)}%`),
    transition: {
      duration: MAXIMUM_DURATION,
      ease: 'easeInOut',
      times: customTimeIntervals
    }
  },
  finish: {
    width: '100%',
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  },
  done: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

const Loader = styled(motion.div)`
  position: fixed;
  height: 0.2rem;
  margin-bottom: -0.2rem;
  background-color: ${({ theme }) => theme.colors.uniswap};
`

export default function RouteLoader() {
  const controls = useAnimation()

  const start = useCallback(async () => {
    controls.start('animating')
  }, [controls])
  const end = useCallback(async () => {
    await controls.start('finish')
    await controls.start('done')
    controls.set('start')
  }, [controls])

  useEffect(() => {
    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', end)
    Router.events.on('routeChangeError', end)

    return () => {
      Router.events.on('routeChangeStart', start)
      Router.events.on('routeChangeComplete', end)
      Router.events.on('routeChangeError', end)
    }
  }, [start, end])

  return <Loader variants={variants} initial="start" animate={controls} />
}
