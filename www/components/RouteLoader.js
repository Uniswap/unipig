import { useEffect, useState } from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { NProgress } from '@tanem/react-nprogress'

const Loader = styled.div`
  width: 100%;
  height: 0.2rem;
  margin-bottom: -0.2rem;
  background-color: ${({ theme }) => theme.colors.greys[5]};

  opacity: ${({ isFinished, progress }) => (isFinished || progress === 0 ? 0 : 1)};
  margin-right: ${({ progress }) => `${(1 - progress) * 100}%`};
`

export default function RouteLoader() {
  const [animating, setAnimating] = useState(false)
  function start() {
    setAnimating(true)
  }
  function end() {
    setAnimating(false)
  }

  useEffect(() => {
    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', end)
    Router.events.on('routeChangeError', end)

    return () => {
      Router.events.on('routeChangeStart', start)
      Router.events.on('routeChangeComplete', end)
      Router.events.on('routeChangeError', end)
    }
  }, [])

  return (
    <NProgress incrementDuration={500} isAnimating={animating} minimum={0.1}>
      {({ animationDuration, isFinished, progress }) => (
        <Loader animationDuration={animationDuration} isFinished={isFinished} progress={progress} />
      )}
    </NProgress>
  )
}
