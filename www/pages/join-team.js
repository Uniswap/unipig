import { Team } from '../constants'
import { useJoinTeam, useTeam } from '../contexts/Cookie'
import { useStyledTheme } from '../hooks'
import Emoji from '../components/Emoji'
import Button from '../components/Button'
import NavButton from '../components/NavButton'

export default function JoinTeam() {
  const team = useTeam()
  const joinTeam = useJoinTeam()
  function join(team) {
    return () => {
      joinTeam(team)
    }
  }

  const theme = useStyledTheme()

  return (
    <>
      <h1>Choose a team.</h1>

      <Button variant={team === Team.UNI ? 'contained' : 'outlined'} color="primary" onClick={join(Team.UNI)}>
        <Emoji emoji="🦄" label="unicorn" />
      </Button>

      <Button variant={team === Team.PIG ? 'contained' : 'outlined'} color="secondary" onClick={join(Team.PIG)}>
        <Emoji emoji="🐷" label="pig" />
      </Button>

      <NavButton variant="gradient" disabled={!team} href={'/confirm-wallet'}>
        I pledge allegiance
      </NavButton>
    </>
  )
}
