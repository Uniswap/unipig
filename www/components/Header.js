import styled from 'styled-components'
import { Badge } from '@material-ui/core'
import { formatSignificant } from '@uniswap/sdk'

import { useStyledTheme } from '../hooks'
import { useAccountExists, useTeamExists, Team } from '../contexts/Client'
import Emoji from './Emoji'
import Chip from './Chip'
import NavButton from './NavButton'
import { Body } from './Type'
import Button from './Button'
import Updater from './Updater'
import { QRIcon } from './NavIcons'

const Uniswap = styled.span`
  font-size: 1rem;
  color: ${({ theme, white }) => (white ? theme.colors.white : theme.colors.uniswap)};
  margin: 0 0.5rem 0 0.5rem;
  text-transform: none;
`

const Back = styled.span`
  font-size: 1.75rem;
  color: ${({ theme, white }) => (white ? theme.colors.white : theme.colors.uniswap)};
`

const L2Text = styled.span`
  font-style: oblique;
  font-size: 10px;
  font-weight: 700;
`

const StyledChip = styled(Chip)`
  height: 100%;
`

const HeaderButton = styled(Button)`
  min-height: unset;
  padding: 0.25rem;
  font-weight: 600;
  min-width: 48px;
`

const ButtonWrapper = styled.span`
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
    margin: 8px 8px 0 0;
  }
`

const StyledUpdater = styled(Updater)`
  margin: 0 1.5rem 0 2rem;
`

const PriceDisplay = styled.div`
  font-size: 12px;
  opacity: 0.75;
  margin-right: -15px;
  color: ${({ color }) => color};
`

export default function Header({
  team,
  updateTotal,
  marketDetails,
  showIcons,
  showUpdater,
  boostsLeft,
  setWalletModalIsOpen
}) {
  const accountExists = useAccountExists()
  const teamExists = useTeamExists()

  const theme = useStyledTheme()

  return (
    <>
      <HomeButton href={accountExists && teamExists ? '/' : '/welcome'} variant="text">
        {showUpdater ? (
          <Back>←</Back>
        ) : (
          <>
            <Emoji emoji={'🦄'} label="unicorn" />
            <Uniswap>Uniswap</Uniswap>
            <StyledChip variant="gradient" label={<L2Text>L2</L2Text>} />
          </>
        )}
      </HomeButton>
      {(showIcons || showUpdater) && (
        <ButtonWrapper>
          {showIcons && (
            <>
              <HeaderButton as={NavButton} variant="text" href="/info">
                <Body size="14" textStyle="gradient">
                  FAQ
                </Body>
              </HeaderButton>
              <HeaderButton as={NavButton} variant="text" href="/stats">
                <Body size="14" textStyle="gradient">
                  Stats
                </Body>
              </HeaderButton>
              <StyledBadge badgeContent={boostsLeft}>
                <Button
                  style={{ margin: 0, padding: 0 }}
                  variant="text"
                  onClick={() => {
                    setWalletModalIsOpen(true)
                  }}
                >
                  <QRIcon />
                </Button>
              </StyledBadge>
            </>
          )}
          {showUpdater && (
            <>
              <PriceDisplay color={team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
                1 {Team[team]} ={' '}
                {marketDetails && marketDetails.marketRate.rateInverted
                  ? formatSignificant(marketDetails.marketRate.rateInverted, {
                      significantDigits: 3,
                      forceIntegerSignificance: true
                    })
                  : '...'}{' '}
                {Team[team === Team.UNI ? Team.PIGI : Team.UNI]}
              </PriceDisplay>
              <StyledUpdater team={team} total={updateTotal} />
            </>
          )}
        </ButtonWrapper>
      )}
    </>
  )
}
