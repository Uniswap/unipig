import styled from 'styled-components'

import Emoji from './Emoji'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`

const Header = styled.div`
  display: flex;
  flex: 0 1 auto;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
`

const TitleEmoji = styled(Emoji)`
  margin-right: 0.5rem;
`

const TitleText = styled.h2`
  margin: 0;
  font-size: 1rem;
`

const Uniswap = styled.span`
  color: ${({ theme }) => theme.colors.pink};
`

const X = styled.span`
  color: ${({ theme }) => theme.colors.pink};
`

const L2 = styled.span`
  color: red;
`

const Body = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Layout({ children }) {
  return (
    <Root>
      <Header>
        <Title>
          <TitleEmoji label="unicorn">🦄</TitleEmoji>
          <TitleText>
            <Uniswap>Uniswap </Uniswap>
            <X>x </X>
            <L2>L2</L2>
          </TitleText>
        </Title>
      </Header>
      <Body>{children}</Body>
    </Root>
  )
}
