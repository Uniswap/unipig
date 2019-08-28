import { useTeam, useWallet } from '../contexts/Cookie'
import NavLink from '../components/NavLink'

export default function Welcome() {
  const team = useTeam()
  const wallet = useWallet()

  return (
    <>
      <h1>Ethereum scales with L2</h1>
      <NavLink href={team && wallet ? '/' : '/join'}>Get Started</NavLink>
    </>
  )
}
