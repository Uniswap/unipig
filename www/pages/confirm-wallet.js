import styled from 'styled-components'

import { Team, useTeam } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Wallet from '../components/MiniWallet'
import Shim from '../components/Shim'

import { Heading, Title, ButtonText, Body } from '../components/Type'

const TeamHeader = styled(Title)`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIG])} !important;
`

function ConfirmWallet({ balances }) {
  const team = useTeam()

  return (
    <>
      <TeamHeader textStyle="gradient" team={team}>
        Welcome to team {team === Team.UNI ? 'UNI' : 'PIG'}.
      </TeamHeader>
      <Heading>Here’s a wallet and some tokens!</Heading>

      <Wallet balances={balances} />

      <Shim size={24} />

      <Body textStyle="gradient">
        Dump <b>{team === Team.UNI ? 'PIG' : 'UNI'}</b> for <b>{team === Team.UNI ? 'UNI' : 'PIG'}</b> to help your team
        gain price{' '}
        <b>
          <i>dominance.</i>
        </b>
      </Body>

      <Shim size={32} />

      <NavButton variant="gradient" href="/" stretch>
        <ButtonText>Let's play.</ButtonText>
      </NavButton>
    </>
  )
}

// TODO add PG API and deal with decimals
ConfirmWallet.getInitialProps = async () => {
  return {
    balances: {
      [Team.UNI]: 5,
      [Team.PIG]: 5
    }
  }
}

export default ConfirmWallet
