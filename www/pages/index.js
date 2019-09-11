import styled from 'styled-components'

import { Team } from '../contexts/Cookie'
import { useStyledTheme } from '../hooks'
import NavButton from '../components/NavButton'
import WalletComponent from '../components/MiniWallet'
import Dominance from '../components/Dominance'
import Shim from '../components/Shim'

import { Title, ButtonText, Body } from '../components/Type'

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

function Home({ wallet, team, addressData, reserves, balances }) {
  const UNIDominance = reserves[Team.UNI] / (reserves[Team.UNI] + reserves[Team.PIGI])

  const theme = useStyledTheme()

  return (
    <>
      <Title size={64} color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
        {UNIDominance >= 0.5
          ? `UNI dominance is at ${Math.round(UNIDominance * 100, 0)}%`
          : `PIG dominance is at ${Math.round((1 - UNIDominance) * 100, 0)}%`}
      </Title>

      <Dominance
        color={UNIDominance >= 0.5 ? 'UNI' : 'PIGI'}
        percent={UNIDominance >= 0.5 ? Math.round(UNIDominance * 100, 2) : Math.round((1 - UNIDominance) * 100, 2)}
      />

      <Body size={18} color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
        {UNIDominance >= 0.5 ? 'Unicorns' : 'Pigs'} are winning!
      </Body>

      <Body color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]} size={18}>
        <i>
          Dump your <b>{team === Team.UNI ? 'PIGI' : 'UNI'}</b> tokens to help your team gain dominance.
        </i>
      </Body>

      <Shim size={32} />

      {addressData.canFaucet && (
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
          <ButtonText>Buy UNI</ButtonText>
        </FlexNavLink>

        <BoostShim />

        <FlexNavLink
          flex={Math.round((1 - UNIDominance) * 100, 0)}
          href={`/trade?buy=${Team[Team.PIGI]}`}
          color={'secondary'}
          variant={team === Team.PIGI ? 'contained' : 'outlined'}
        >
          <ButtonText>Buy PIGI</ButtonText>
        </FlexNavLink>
      </BoostWrapper>

      <Shim size={36} />

      <WalletComponent wallet={wallet} team={team} balances={balances} walletType={'rest'} />
    </>
  )
}

// TODO add PG API and deal with decimals
Home.getInitialProps = async () => {
  const random = Math.round(Math.random() * 100, 0)
  return {
    reserves: {
      [Team.UNI]: random,
      [Team.PIGI]: 100 - random
    },
    balances: {
      [Team.UNI]: 5,
      [Team.PIGI]: 5
    }
  }
}

export default Home
