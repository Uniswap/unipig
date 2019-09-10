import styled from 'styled-components'

import { useTeam, useWallet } from '../contexts/Cookie'
import Emoji from './Emoji'
import Chip from './Chip'
import NavButton from './NavButton'

import { QRIcon, StatsIcon, ShareIcon } from './NavIcons'

const HomeButton = styled(NavButton)`
  padding: 0 1rem;
`

const Uniswap = styled.span`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme, white }) => (white ? theme.colors.white : theme.colors.uniswap)};
  margin: 0 0.5rem 0 0.5rem;
  text-transform: none;
`

const L2Text = styled.span`
  font-style: oblique;
  font-size: 10px;
  font-weight: 700;
`

const HeaderWrapper = styled.span`
  padding: 1rem 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const LinkWrapper = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const LinkButton = styled(NavButton)`
  height: 40px;
  width: 40px;
  min-height: 60px;
  min-width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
  transition: scale 0.3s ease;

  :hover {
    transform: scale(0.99);
  }
`

export default function Header({ showWallet }) {
  const team = useTeam()
  const wallet = useWallet()

  return (
    <HeaderWrapper>
      <HomeButton href={team && wallet ? '/' : '/welcome'}>
        <Emoji emoji={'🦄'} label="unicorn" />
        <Uniswap>Uniswap</Uniswap>
        <Chip variant="gradient" label={<L2Text>L2</L2Text>} />
      </HomeButton>
      {showWallet && (
        <LinkWrapper>
          <LinkButton href="/wallet">
            <ShareIcon></ShareIcon>
          </LinkButton>
          <LinkButton href="/wallet">
            <StatsIcon></StatsIcon>
          </LinkButton>
          <LinkButton href="/wallet">
            <QRIcon></QRIcon>
          </LinkButton>
        </LinkWrapper>
      )}
    </HeaderWrapper>
  )
}
