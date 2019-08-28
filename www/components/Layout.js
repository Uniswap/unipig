import styled from 'styled-components'

import RouteLoader from './RouteLoader'
import Header from './Header'

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
  flex-direction: column;
  justify-content: center;
  align-items: ${({ align }) => align};
  flex: ${({ grow }) => (grow ? '1 1 auto' : '0 1 auto')};
`

export default function Layout({ children }) {
  return (
    <Root>
      <Element align="flex-end">
        <RouteLoader />
      </Element>
      <Element align="flex-start">
        <Header />
      </Element>
      <Element align="center" grow={true}>
        {children}
      </Element>
    </Root>
  )
}
