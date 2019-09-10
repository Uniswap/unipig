import styled from 'styled-components'

import { Team } from '../constants'
import { useTeam } from '../contexts/Cookie'
import { useStyledTheme } from '../hooks'
import NavButton from '../components/NavButton'
import Wallet from '../components/MiniWallet'
import Dominance from '../components/Dominance'
import Shim from '../components/Shim'

import { Heading, Title, ButtonText, Body } from '../components/Type'

const Header = styled.h1`
  color: ${({ color }) => color};
`

const BoostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const BoostShim = styled.span`
  width: 16px;
  height: 16px;
`

const FlexNavLink = styled(NavButton)`
  flex-grow: ${({ flex }) => flex};
`

function Home({ balances, reserves }) {
  const UNIDominance = reserves[Team.UNI] / (reserves[Team.UNI] + reserves[Team.PIG])

  const theme = useStyledTheme()

  const team = useTeam()

  return (
    <>
      <Title size={64} color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIG]}>
        {UNIDominance >= 0.5
          ? `UNI dominance is at ${Math.round(UNIDominance * 100, 2)}%`
          : `PIG dominance is at ${Math.round((1 - UNIDominance) * 100, 2)}%`}
      </Title>

      <Dominance
        color={UNIDominance >= 0.5 ? 'UNI' : 'PIG'}
        percent={UNIDominance >= 0.5 ? Math.round(UNIDominance * 100, 2) : Math.round((1 - UNIDominance) * 100, 2)}
      />

      <Body size={18} color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIG]}>
        {UNIDominance >= 0.5 ? 'Unicorns' : 'Pigs'} are winning!
      </Body>

      <Body color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIG]} size={18}>
        <i>
          Dump your <b>{team === Team.UNI ? 'PIG' : 'UNI'}</b> tokens to help your team gain dominance.
        </i>
      </Body>

      <Shim size={32} />

      <BoostWrapper>
        <FlexNavLink
          flex={Math.round(UNIDominance * 100, 0)}
          href={`/trade?buy=${Team[Team.UNI]}`}
          color={'primary'}
          variant={team === Team.UNI ? 'contained' : 'outlined'}
        >
          <ButtonText>Buy UNI</ButtonText>
        </FlexNavLink>

        <BoostShim />

        <FlexNavLink
          flex={Math.round((1 - UNIDominance) * 100, 0)}
          href={`/trade?buy=${Team[Team.PIG]}`}
          color={'secondary'}
          variant={team === Team.PIG ? 'contained' : 'outlined'}
        >
          <ButtonText>Buy PIG</ButtonText>
        </FlexNavLink>
      </BoostWrapper>

      <Shim size={36} />

      <Wallet walletType={'rest'} balances={balances} />
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
