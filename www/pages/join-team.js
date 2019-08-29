import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Team } from '../constants'
import { useJoinTeam, useTeam, useWallet } from '../contexts/Cookie'
import { useStyledTheme } from '../hooks'
import Emoji from '../components/Emoji'
import { TransparentButton, SolidButton } from '../components/Button'
import { GradientNavLink } from '../components/NavLink'

const H2 = styled.h2`
  margin: 0;
`

export default function JoinTeam() {
  const team = useTeam()
  const joinTeam = useJoinTeam()
  function join(team) {
    return () => {
      joinTeam(team)
    }
  }
  const wallet = useWallet()

  const theme = useStyledTheme()

  // handle redirect
  const router = useRouter()
  useEffect(() => {
    if (!wallet) {
      router.push('/welcome')
    }
  })
  if (!wallet) {
    return null
  }

  return (
    <>
      <h1>Choose a team.</h1>

      {team === Team.UNI ? (
        <SolidButton color={theme.colors.UNI} textColor={theme.colors.white}>
          <Emoji emoji="🦄" label="unicorn" />
          <H2>UNI</H2>
        </SolidButton>
      ) : (
        <TransparentButton onClick={join(Team.UNI)} color={theme.colors.UNI}>
          <Emoji emoji="🦄" label="unicorn" />
          <H2>UNI</H2>
        </TransparentButton>
      )}

      {team === Team.PIG ? (
        <SolidButton color={theme.colors.PIG} textColor={theme.colors.white}>
          <Emoji emoji="🐷" label="pig" />
          <H2>PIG</H2>
        </SolidButton>
      ) : (
        <TransparentButton onClick={join(Team.PIG)} color={theme.colors.PIG}>
          <Emoji emoji="🐷" label="pig" />
          <H2>PIG</H2>
        </TransparentButton>
      )}

      <GradientNavLink disabled={!team} href={'/confirm-wallet'}>
        <H2>I pledge allegiance.</H2>
      </GradientNavLink>
    </>
  )
}
