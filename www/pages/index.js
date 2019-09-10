import styled from 'styled-components'

import { Team, useTeam, useWallet, useSource, WalletSource } from '../contexts/Cookie'
import { useStyledTheme } from '../hooks'
import NavButton from '../components/NavButton'

const Header = styled.h1`
  color: ${({ color }) => color};
`

const BoostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 75%;
`

const FlexNavLink = styled(NavButton)`
  flex-grow: ${({ flex }) => flex};
`

function Home({ balances, reserves }) {
  const UNIDominance = reserves[Team.UNI] / (reserves[Team.UNI] + reserves[Team.PIG])

  const theme = useStyledTheme()

  const source = useSource()
  const wallet = useWallet()
  const team = useTeam()

  return (
    <>
      <Header color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIG]}>
        {UNIDominance >= 0.5 ? 'Unicorns' : 'Pigs'} are winning!
      </Header>
      <p>
        {UNIDominance >= 0.5
          ? `Unicorn Dominance: ${Math.round(UNIDominance * 100, 2)}%`
          : `Pig Dominance: ${Math.round((1 - UNIDominance) * 100, 2)}%`}
      </p>
      <p>Team: {Team[team]}</p>
      <p>Address: {wallet.address}</p>

      <p>UNI: {balances[Team.UNI]}</p>
      <p>PIG: {balances[Team.PIG]}</p>

      {source === WalletSource.GENERATED && (
        <NavButton href={`/twitter-faucet`} variant={'gradient'}>
          Get Tokens from Twitter
        </NavButton>
      )}

      <BoostWrapper>
        <FlexNavLink
          flex={Math.round(UNIDominance * 100, 0)}
          href={`/trade?buy=${Team[Team.UNI]}`}
          color={'primary'}
          variant={team === Team.UNI ? 'contained' : 'outlined'}
        >
          Boost UNI
        </FlexNavLink>

        <FlexNavLink
          flex={Math.round((1 - UNIDominance) * 100, 0)}
          href={`/trade?buy=${Team[Team.PIG]}`}
          color={'secondary'}
          variant={team === Team.PIG ? 'contained' : 'outlined'}
        >
          Boost PIG
        </FlexNavLink>
      </BoostWrapper>
    </>
  )
}

// TODO add PG API and deal with decimals
Home.getInitialProps = async () => {
  const random = Math.round(Math.random() * 100, 0)
  return {
    balances: {
      [Team.UNI]: 5,
      [Team.PIG]: 5
    },
    reserves: {
      [Team.UNI]: random,
      [Team.PIG]: 100 - random
    }
  }
}

export default Home
