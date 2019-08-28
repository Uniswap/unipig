import { useRouter } from 'next/router'

import { Team } from '../constants'
import { useTeam, useWallet, useReset } from '../contexts/Cookie'
import Button from '../components/Button'

export default function Home() {
  const team = useTeam()
  const wallet = useWallet()

  const reset = useReset()
  const router = useRouter()
  function resetApp() {
    reset()
    router.push('/welcome')
  }

  if (!wallet || !team) {
    return null
  }

  return (
    <>
      <h1>Team {team === Team.UNI ? 'UNI' : 'PIG'}</h1>
      <p>{wallet.address}</p>
      <Button onClick={resetApp}>Reset</Button>
    </>
  )
}
