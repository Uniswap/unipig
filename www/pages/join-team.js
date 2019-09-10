import styled from 'styled-components'

import { Team, useAddTeam, useTeam } from '../contexts/Cookie'
import Emoji from '../components/Emoji'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Progress from '../components/Progress'
import Shim from '../components/Shim'

import { Heading, Title, ButtonText } from '../components/Type'

const StyledButton = styled(Button)`
  margin-bottom: 24px;
`

export default function JoinTeam() {
  const team = useTeam()
  const addTeam = useAddTeam()
  function join(team) {
    return () => {
      addTeam(team)
    }
  }

  return (
    <>
      <Heading>Oink or Horn.</Heading>
      <Title textStyle="gradient">Choose a team.</Title>

      <Shim />

      <StyledButton variant={team === Team.UNI ? 'contained' : 'outlined'} color="primary" onClick={join(Team.UNI)}>
        <Emoji emoji="🦄" label="unicorn" />
      </StyledButton>

      <StyledButton variant={team === Team.PIG ? 'contained' : 'outlined'} color="secondary" onClick={join(Team.PIG)}>
        <Emoji emoji="🐷" label="pig" />
      </StyledButton>

      <Shim size={56} />

      <Progress progress="60%" />

      <NavButton variant="gradient" disabled={!team} href={'/confirm-wallet'} stretch>
        <ButtonText>I pledge allegiance</ButtonText>
      </NavButton>
    </>
  )
}
