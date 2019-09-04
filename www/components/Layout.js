import styled from 'styled-components'

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
`

const Element = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  justify-content: ${({ justify }) => justify || 'center'};
  align-items: ${({ align }) => align};
  flex: ${({ grow }) => (grow ? '1 1 auto' : '0 1 auto')};
`

export default function Layout({ children }) {
  const { pathname } = useRouter()
  const showWallet = pathname === '/'

  return (
    <Root>
      <Element align="flex-end">
        <RouteLoader />
      </Element>
      <Element align="flex-start" justify={showWallet ? 'space-between' : 'flex-start'} direction="row">
        <Header showWallet={showWallet} />
      </Element>
      <Element align="center" grow={true}>
        {children}
      </Element>
    </Root>
  )
}
