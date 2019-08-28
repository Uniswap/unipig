import styled from 'styled-components'

import Emoji from './Emoji'
import Chip from './Chip'

const Title = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
`

const Uniswap = styled.h4`
  margin: 0;
  color: ${({ theme, white }) => (white ? theme.colors.white : theme.colors.uniswap)};
  margin: 0 0.5rem 0 0.5rem;
`

const L2 = styled(Chip)`
  font-weight: 700;
  font-style: oblique;
  padding: 0.1rem 0.5rem 0.1rem 0.5rem;
  border-radius: 1rem;
`

const L2Text = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.white};
`

export default function Header() {
  return (
    <Title>
      <Emoji label="unicorn">🦄</Emoji>
      <Uniswap>Uniswap</Uniswap>
      <L2>
        <L2Text>L2</L2Text>
      </L2>
    </Title>
  )
}
