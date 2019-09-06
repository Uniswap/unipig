import styled, { keyframes } from 'styled-components'

import RouteLoader from './RouteLoader'
import Header from './Header'
import { useRouter } from 'next/router'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  align-items: center;
`

const BackroundElement = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: none;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1;

  img {
    position: absolute;
    top: -30%;
    right: -10%;
  }
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const AnimatedImg = styled.img`
  animation: ${rotate} ${({ time }) => time} linear infinite;
`

const Element = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  justify-content: ${({ justify }) => justify || 'center'};
  align-items: ${({ align }) => align};
  flex: ${({ grow }) => (grow ? '1 1 auto' : '0 1 auto')};
  width: ${({ width }) => width || '100vw'};
`

export default function Layout({ children }) {
  const { pathname } = useRouter()
  const showWallet = pathname === '/'

  return (
    <Root>
      <BackroundElement>
        <AnimatedImg time={'1000s'} src="static/blob_3.svg" />
        <AnimatedImg time={'500s'} src="static/blob_2.svg" />
        <AnimatedImg time={'500s'} src="static/blob_1.svg" />
      </BackroundElement>
      <Element align="flex-end">
        <RouteLoader />
      </Element>
      <Element align="flex-start" justify={showWallet ? 'space-between' : 'flex-start'} direction="row">
        <Header showWallet={showWallet} />
      </Element>
      <Element align="center" grow={true} width={'450px'}>
        {children}
      </Element>
    </Root>
  )
}
