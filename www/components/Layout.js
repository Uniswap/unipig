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
  justify-content: flex-start;
`

const BackroundElement = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: none;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: -1;
  overflow: hidden;
  filter: brightness(30%);
  transform: scale(1.2);

  img {
    position: absolute;
    top: -30%;
    right: -400px;
  }

  @media only screen and (max-width: 480px) {
    transform: scale(1);
    img {
      top: -50%;
      right: -40vw;
    }
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
  user-select: none;
`

const Element = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  justify-content: ${({ justify }) => justify || 'center'};
  align-items: ${({ align }) => align};
  flex: ${({ grow }) => (grow ? '1 1 auto' : '0 1 auto')};
  width: ${({ width }) => width || '100vw'};

  @media only screen and (max-width: 480px) {
    width: calc(100% - 32px);
  }
`

export default function Layout({ wallet, team, children, setWalletModalIsOpen }) {
  const { pathname } = useRouter()
  const showIcons = pathname === '/'

  return (
    <Root>
      <BackroundElement>
        <AnimatedImg time={'200s'} src="static/blob_2.svg" />
        <AnimatedImg time={'500s'} src="static/blob_3.svg" />
        <AnimatedImg time={'250s'} src="static/blob_1.svg" />
      </BackroundElement>
      <Element align="flex-start">
        <RouteLoader />
      </Element>
      <Element align="flex-start" justify={showIcons ? 'space-between' : 'flex-start'} direction="row">
        <Header wallet={wallet} team={team} showIcons={showIcons} setWalletModalIsOpen={setWalletModalIsOpen} />
      </Element>
      <Element align="flex-start" grow={false} width={'448px'}>
        {children}
      </Element>
    </Root>
  )
}
