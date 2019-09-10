import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import styled from 'styled-components'
import { transparentize } from 'polished'

import { Team } from '../constants'
import { useReset, useWallet, useTeam } from '../contexts/Cookie'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import { TokenInfo, WalletInfo } from '../components/MiniWallet'

//WORK IN PROGRESS

const StyledWallet = styled.a`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIG])} !important;
  padding: 1.5rem;
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.black)};
  border-radius: 20px;
  width: 100%;
  opacity: 0.8;
  transition: opacity 0.125s ease;
  text-decoration: none;

  :hover {
    opacity: 1;
    cursor: pointer;
  }
`

function Overview({ balances }) {
  const team = useTeam()
  const wallet = useWallet()
  const reset = useReset()
  const [resetPressed, setResetPressed] = useState(false)

  const router = useRouter()
  function onReset() {
    setResetPressed(true)
    reset()
  }

  // handle redirect after reset
  useEffect(() => {
    if (!wallet) {
      router.push('/welcome')
    }
  }, [wallet, router])

  return (
    <StyledWallet>
      <WalletInfo team={team} wallet={wallet} />
      <NavButton variant="gradient" href="/wallet?scan=true">
        Scan
      </NavButton>

      <TokenInfo balances={balances} />

      <Button disabled={resetPressed} variant="gradient" onClick={onReset}>
        Discard Account
      </Button>
    </StyledWallet>
  )
}

function Scan() {
  return <p>scanning...</p>
}

function Manager({ balances }) {
  const router = useRouter()
  const { scan } = router.query || {}

  return !scan ? <Overview balances={balances} /> : <Scan />
}

Manager.getInitialProps = async () => {
  return {
    balances: {
      [Team.UNI]: 100000,
      [Team.PIG]: 100000
    }
  }
}

export default Manager
