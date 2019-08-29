import styled from 'styled-components'

import Emoji from './Emoji'
import { GradientChip } from './Chip'

const Title = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
`

const Uniswap = styled.h4`
  margin: 0;
  color: ${({ theme, white }) => (white ? theme.colors.white : theme.colors.uniswap)};
  margin: 0 0.5rem 0 0.5rem;
  min-width: unset;
`

const L2Text = styled.h4`
  margin: 0;
  font-style: oblique;
`

export default function Header() {
  return (
    <Title>
      <Emoji emoji={'🦄'} label="unicorn" />
      <Uniswap>Uniswap</Uniswap>
      <GradientChip>
        <L2Text>L2</L2Text>
      </GradientChip>
    </Title>
  )
}
