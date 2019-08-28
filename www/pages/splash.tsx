import { useState, useEffect } from 'react'
import Router from 'next/router'

import { Team, Cookie } from '../constants'
import { getCookie, redirect } from '../utils'
import { useTeam } from '../contexts/Cookie'

function Wallet(): JSX.Element {
  const [team, joinTeam] = useTeam()

  function joinUnicorn(): void {
    joinTeam(Team.Unicorn)
  }

  function joinPig(): void {
    joinTeam(Team.Unicorn)
  }

  useEffect((): void => {
    if (team) {
      Router.push('/')
    }
  })

  return (
    <>
      <button onClick={joinUnicorn}>Join Unicorn</button>
      <button onClick={joinPig}>Join Pig</button>
    </>
  )
}

function Splash(): JSX.Element {
  const [started, setStarted] = useState(false)

  function start(): void {
    setStarted(true)
  }

  return started ? (
    <Wallet />
  ) : (
    <>
      <p>Ethereum scales with L2</p>
      <button onClick={start}>Start</button>
    </>
  )
}

Splash.getInitialProps = async (context: any): Promise<object> => {
  const { req, res } = context
  const serverSide = !!req && !!res
  const cookie = getCookie(serverSide, context) as Cookie

  // on the server, if a mnemonic or team doesn't exist, and we're not rendering /splash, we _have_ to redirect
  // note: we don't protect against non-existence in client-side nav because our implementation guarantees it
  if (cookie.mnemonic && cookie.team) {
    redirect('/', res)
    return {}
  }

  return {}
}

export default Splash
