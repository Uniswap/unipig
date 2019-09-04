import styled from 'styled-components'

import { useTeam, useWallet } from '../contexts/Cookie'
import Emoji from './Emoji'
import Chip from './Chip'
import NavButton from './NavButton'

const Uniswap = styled.span`
  margin: 0;
  color: ${({ theme, white }) => (white ? theme.colors.white : theme.colors.uniswap)};
  margin: 0 0.5rem 0 0.5rem;
  text-transform: none;
`

const L2Text = styled.span`
  font-style: oblique;
`

export default function Header({ showWallet }) {
  const team = useTeam()
  const wallet = useWallet()

  return (
    <>
      <NavButton href={team && wallet ? '/' : '/welcome'}>
        <Emoji emoji={'🦄'} label="unicorn" />
        <Uniswap>Uniswap</Uniswap>
        <Chip variant="gradient" label={<L2Text>L2</L2Text>} />
      </NavButton>
      {showWallet && <NavButton href="/wallet">Wallet</NavButton>}
    </>
  )
}
