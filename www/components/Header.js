import styled from 'styled-components'
import { Badge } from '@material-ui/core'

import { useAccountExists, useTeamExists } from '../contexts/Client'
import Emoji from './Emoji'
import Chip from './Chip'
import NavButton from './NavButton'
import NavLink from './NavLink'
import { Body } from './Type'
import Button from './Button'

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

const TextLink = styled(NavLink)`
  font-size: 1rem;
  font-weight: 600;
  margin-right: ${({ noMargin }) => !noMargin && '1.25rem'};
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

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    z-index: 0;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.link};
  }
`

const WalletButton = styled(Button)`
  min-height: unset;
`

const WalletText = styled(Body)`
  font-size: 1rem;
  font-weight: 600;
  padding: 0.25rem;
`

export default function Header({ showIcons, boostsLeft, setWalletModalIsOpen }) {
  const accountExists = useAccountExists()
  const teamExists = useTeamExists()

  return (
    <>
      <HomeButton href={accountExists && teamExists ? '/' : '/welcome'} variant="text">
        <Emoji emoji={'🦄'} label="unicorn" />
        <Uniswap>Uniswap</Uniswap>
        <StyledChip variant="gradient" label={<L2Text>L2</L2Text>} />
      </HomeButton>

      {showIcons && (
        <LinkWrapper>
          <TextLink href="/stats">
            <Body textStyle="gradient">L2 Stats</Body>
          </TextLink>
          <StyledBadge style={{ marginRight: '0.5rem' }} badgeContent={boostsLeft}>
            <WalletButton
              variant="text"
              onClick={() => {
                setWalletModalIsOpen(true)
              }}
            >
              <WalletText textStyle="gradient">Wallet</WalletText>
            </WalletButton>
          </StyledBadge>
        </LinkWrapper>
      )}
    </>
  )
}
