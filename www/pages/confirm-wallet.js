import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Team } from '../constants'
import { useWallet, useTeam } from '../contexts/Cookie'
import { GradientNavLink } from '../components/NavLink'

const TeamHeader = styled.h1`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors.UNI : theme.colors.PIG)};
`

const H2 = styled.h2`
  margin: 0;
`

function ConfirmWallet({ personalUNIBalance, personalPIGBalance }) {
  const team = useTeam()
  const wallet = useWallet()

  // handle redirect
  const router = useRouter()
  useEffect(() => {
    if (!team || !wallet) {
      router.push('/welcome')
    }
  })
  if (!team || !wallet) {
    return null
  }

  return (
    <>
      <TeamHeader team={team}>Welcome to team {team === Team.UNI ? 'UNI' : 'PIG'}.</TeamHeader>
      <p>Address: {wallet.address}</p>
      <p>UNI: {personalUNIBalance}</p>
      <p>PIG: {personalPIGBalance}</p>

      <GradientNavLink href="/">
        <H2>Let's go.</H2>
      </GradientNavLink>
    </>
  )
}

ConfirmWallet.getInitialProps = async () => {
  return { personalUNIBalance: 5, personalPIGBalance: 5 }
}

export default ConfirmWallet
