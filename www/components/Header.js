import styled from 'styled-components'

import { useTeam, useWallet } from '../contexts/Cookie'
import Emoji from './Emoji'
import Chip from './Chip'
import NavButton from './NavButton'

import { QRIcon, StatsIcon, ShareIcon } from './NavIcons'

const HomeButton = styled(NavButton)`
  padding: 0 1rem;
  @media only screen and (max-width: 480px) {
    padding: 0;
    /* padding-top: 1.5rem; */
    margin: 0;
    margin-left: 1rem;
    text-align: left;
    max-width: 100px;
  }
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
  padding: 1rem 1.5rem;
  /* width: 100vw; */
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;

  @media only screen and (max-width: 480px) {
    padding: 0;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
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

  @media only screen and (max-width: 480px) {
    min-width: 50px;
  }

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
      {showWallet ? (
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
      ) : (
        <span>{''}</span>
      )}
    </HeaderWrapper>
  )
}
