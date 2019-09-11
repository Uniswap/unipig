import styled from 'styled-components'

import Emoji from './Emoji'
import Chip from './Chip'
import NavButton from './NavButton'

import { QRIcon, StatsIcon, ShareIcon } from './NavIcons'

const HeaderWrapper = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem;

  @media only screen and (max-width: 480px) {
    padding: 0;
  }
`

const HomeButton = styled(NavButton)`
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer !important;
  }
`

const Uniswap = styled.span`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme, white }) => (white ? theme.colors.white : theme.colors.uniswap)};
  margin: 0 0.5rem 0 0.5rem;
  text-transform: none;

  :hover {
    text-decoration: none !important;
  }
`

const L2Text = styled.span`
  font-style: oblique;
  font-size: 10px;
  font-weight: 700;
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

export default function Header({ wallet, team, showWallet }) {
  return (
    <HeaderWrapper>
      <HomeButton href={wallet && team ? '/' : '/welcome'}>
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
