import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Badge } from '@material-ui/core'

import Emoji from './Emoji'
import Chip from './Chip'
import NavButton from './NavButton'
import Button from './Button'
import { QRIcon, StatsIcon, ShareIcon } from './NavIcons'

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

const StyledChip = styled(Chip)`
  height: 100%;
`

const LinkWrapper = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HomeButton = styled(NavButton)`
  padding: 1rem;
  line-height: 0rem;
`

const IconButton = styled(NavButton)`
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
    padding: 0px;
  }

  :hover {
    transform: scale(0.99);
  }
`

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.link};
  }
`

export default function Header({ wallet, team, showIcons, boostsLeft, setWalletModalIsOpen }) {
  // check if sharing is enabled
  const [canShare, setCanShare] = useState()
  useEffect(() => {
    setCanShare(navigator ? !!navigator.share : false)
  }, [])

  return (
    <>
      <HomeButton href={wallet && team ? '/' : '/welcome'} variant="text">
        <Emoji emoji={'🦄'} label="unicorn" />
        <Uniswap>Uniswap</Uniswap>
        <StyledChip variant="gradient" label={<L2Text>L2</L2Text>} />
      </HomeButton>

      {showIcons && (
        <LinkWrapper>
          {canShare && (
            <IconButton
              as={Button}
              onClick={() => {
                navigator.share({
                  title: 'Unipig Exchange',
                  url: 'https://unipig.exchange/'
                })
              }}
            >
              <ShareIcon />
            </IconButton>
          )}
          <IconButton href="/stats">
            <StatsIcon />
          </IconButton>
          <StyledBadge badgeContent={boostsLeft}>
            <IconButton
              as={Button}
              onClick={() => {
                setWalletModalIsOpen(true)
              }}
            >
              <QRIcon />
            </IconButton>
          </StyledBadge>
        </LinkWrapper>
      )}
    </>
  )
}
