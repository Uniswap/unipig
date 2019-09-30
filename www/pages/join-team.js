import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/camelcase
import { Team, useTeamExists, useAddTeam, useTeam_UNWISE } from '../contexts/Client'
import Emoji from '../components/Emoji'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Progress from '../components/Progress'
import Shim from '../components/Shim'
import { Heading, Title, ButtonText } from '../components/Type'
import { AnimatedFrame, containerAnimation, childAnimation } from '../components/Animation'

const StyledButton = styled(Button)`
  margin-bottom: 24px;
`

function JoinTeam({ skipConfirm }) {
  const teamExists = useTeamExists()
  const addTeam = useAddTeam()
  const team = useTeam_UNWISE()

  function join(teamToJoin) {
    return () => {
      if (teamToJoin !== team) {
        addTeam(teamToJoin)
      }
    }
  }

  return (
    <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
      <Heading>Oink or Horn.</Heading>
      <Title textStyle="gradient">Choose a team.</Title>

      <Shim size={32} />

      <StyledButton
        variant={team === Team.UNI ? 'contained' : 'outlined'}
        color="primary"
        onClick={join(Team.UNI)}
        stretch
      >
        <Emoji emoji="🦄" label="unicorn" />
      </StyledButton>

      <StyledButton
        variant={team === Team.PIGI ? 'contained' : 'outlined'}
        color="secondary"
        onClick={join(Team.PIGI)}
        stretch
      >
        <Emoji emoji="🐷" label="pig" />
      </StyledButton>

      <Shim size={24} />

      <Progress progress="66%" />
      <AnimatedFrame variants={childAnimation}>
        <NavButton
          variant="gradient"
          disabled={teamExists !== true}
          href={skipConfirm ? '/' : '/confirm-wallet'}
          stretch
        >
          <ButtonText>I pledge allegiance</ButtonText>
        </NavButton>
      </AnimatedFrame>
    </AnimatedFrame>
  )
}

JoinTeam.getInitialProps = async context => {
  const { query } = context // query can contain: skipConfirm

  const skipConfirm = query.skipConfirm ? query.skipConfirm === 'true' : undefined

  return { skipConfirm }
}

export default JoinTeam
