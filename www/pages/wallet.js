import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Team } from '../constants'
import { useReset, useWallet } from '../contexts/Cookie'
import Button from '../components/Button'
import NavButton from '../components/NavButton'

function Overview() {
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
    <>
      <NavButton variant="gradient" href="/wallet?scan=true">
        Scan
      </NavButton>
      <Button disabled={resetPressed} variant="gradient" onClick={onReset}>
        Reset
      </Button>
    </>
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
