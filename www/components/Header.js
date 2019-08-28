import styled from 'styled-components'

import Emoji from './Emoji'

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

export default function Header() {
  return (
    <Title>
      <TitleEmoji label="unicorn">🦄</TitleEmoji>
      <TitleText>
        <Uniswap>Uniswap </Uniswap>
        <X>x </X>
        <L2>L2</L2>
      </TitleText>
    </Title>
  )
}
