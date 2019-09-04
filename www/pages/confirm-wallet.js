import styled from 'styled-components'

import { Team } from '../constants'
import { useWallet, useTeam } from '../contexts/Cookie'
import NavButton from '../components/NavButton'

const TeamHeader = styled.h1`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIG])};
`

function ConfirmWallet({ balances }) {
  const team = useTeam()
  const wallet = useWallet()

  return (
    <>
      <TeamHeader team={team}>Welcome to team {team === Team.UNI ? 'UNI' : 'PIG'}.</TeamHeader>
      <p>Address: {wallet.address}</p>
      <p>UNI: {balances[Team.UNI]}</p>
      <p>PIG: {balances[Team.PIG]}</p>

      <NavButton variant="gradient" href="/">
        Let's go
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
