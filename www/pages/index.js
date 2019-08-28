import { redirect } from '../utils'
import { useResetWallet, useWallet, useTeam } from '../contexts/Cookie'

export default function App() {
  const wallet = useWallet()
  const [team] = useTeam()
  const reset = useResetWallet()

  // handles the redirect after resetWallet
  if (!team) {
    redirect('/splash')
  }

  return (
    <>
      <h1>{wallet.address}</h1>
      <button onClick={reset}>Reset</button>
    </>
  )
}
