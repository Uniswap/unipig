import { useEffect } from 'react'
import { Wallet } from '@ethersproject/wallet'

import { Team } from '../constants'
import { useTeam, useJoinTeam, useWallet, useAddMnemonic } from '../contexts/Cookie'
import Button from '../components/Button'
import NavLink from '../components/NavLink'

function Join({ mnemonic }) {
  const team = useTeam()
  const joinTeam = useJoinTeam()

  function join(team) {
    return () => {
      joinTeam(team)
    }
  }

  const wallet = useWallet()
  const addMnemonic = useAddMnemonic()
  useEffect(() => {
    if (!wallet) {
      addMnemonic(mnemonic)
    }
  }, [wallet, addMnemonic, mnemonic])

  return (
    <>
      <h1>Join a team</h1>
      <p>{wallet ? wallet.address : Wallet.fromMnemonic(mnemonic).address}</p>
      <Button onClick={join(Team.UNI)} active={team === Team.UNI}>
        UNI
      </Button>
      <Button onClick={join(Team.PIG)} active={team === Team.PIG}>
        PIG
      </Button>

      <NavLink href={'/'} disabled={!wallet || !team}>
        Proceed
      </NavLink>
    </>
  )
}

Join.getInitialProps = async () => {
  return { mnemonic: Wallet.createRandom().mnemonic }
}

export default Join
