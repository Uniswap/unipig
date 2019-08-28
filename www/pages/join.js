import { useEffect } from 'react'
import { Wallet } from '@ethersproject/wallet'

import { Team } from '../constants'
import { useJoinTeam, useWallet, useAddMnemonic } from '../contexts/Cookie'
import { useStyledTheme } from '../hooks'
import Button from '../components/Button'
import { useRouter } from 'next/router'

function Join({ mnemonic }) {
  const joinTeam = useJoinTeam()
  const router = useRouter()
  function join(team) {
    return () => {
      joinTeam(team)
      router.push('/')
    }
  }

  const wallet = useWallet()
  const addMnemonic = useAddMnemonic()
  useEffect(() => {
    if (!wallet) {
      addMnemonic(mnemonic)
    }
  }, [wallet, addMnemonic, mnemonic])

  const theme = useStyledTheme()

  return (
    <>
      <h1>Join a team</h1>
      <p>{wallet ? wallet.address : Wallet.fromMnemonic(mnemonic).address}</p>

      <div>
        <Button onClick={join(Team.UNI)} fill={false} noFillColor={theme.colors.UNI}>
          UNI
        </Button>
        <Button onClick={join(Team.PIG)} fill={false} noFillColor={theme.colors.PIG}>
          PIG
        </Button>
      </div>
    </>
  )
}

Join.getInitialProps = async () => {
  return { mnemonic: Wallet.createRandom().mnemonic }
}

export default Join
