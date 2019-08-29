import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Team } from '../constants'
import { useTeam, useWallet, useReset } from '../contexts/Cookie'
import { useStyledTheme } from '../hooks'
import { GradientButton } from '../components/Button'
import { TransparentNavLink, SolidNavLink } from '../components/NavLink'

const Header = styled.h1`
  color: ${({ color }) => color};
`

const H2 = styled.h2`
  margin: 0;
`

const BoostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 75%;
`

const FlexSolidNavLink = styled(SolidNavLink)`
  flex-grow: ${({ flex }) => flex};
`

const FlexTransparentNavLink = styled(TransparentNavLink)`
  flex-grow: ${({ flex }) => flex};
`

function Home({ UNIBalance, PIGBalance }) {
  const team = useTeam()
  const wallet = useWallet()

  const theme = useStyledTheme()

  const UNIDominance = UNIBalance / (UNIBalance + PIGBalance)

  // reset
  const reset = useReset()
  function resetApp() {
    reset()
  }

  // handle redirect
  const router = useRouter()
  useEffect(() => {
    if (!wallet || !team) {
      router.push('/welcome')
    }
  })
  if (!wallet || !team) {
    return null
  }

  return (
    <>
      <Header color={UNIDominance >= 0.5 ? theme.colors.UNI : theme.colors.PIG}>
        {UNIDominance >= 0.5 ? 'Unicorns' : 'Pigs'} are winning!
      </Header>
      <p>
        {UNIDominance >= 0.5
          ? `Unicorn Dominance: ${Math.round(UNIDominance * 100, 0)}%`
          : `Pig Dominance: ${Math.round((1 - UNIDominance) * 100, 0)}%`}
      </p>
      <p>Team: {team === Team.UNI ? 'UNI' : 'PIG'}</p>
      <p>Address: {wallet.address}</p>

      <BoostWrapper>
        {team === Team.UNI ? (
          <FlexSolidNavLink
            flex={Math.round(UNIDominance * 100, 0)}
            href="/trade?recieve=UNI"
            color={theme.colors.UNI}
            textColor={theme.colors.white}
          >
            <H2>Boost UNI</H2>
          </FlexSolidNavLink>
        ) : (
          <FlexTransparentNavLink
            flex={Math.round(UNIDominance * 100, 0)}
            href="/trade?recieve=UNI"
            color={theme.colors.UNI}
          >
            <H2>Boost UNI</H2>
          </FlexTransparentNavLink>
        )}

        {team === Team.PIG ? (
          <FlexSolidNavLink
            flex={Math.round((1 - UNIDominance) * 100, 0)}
            href="/trade?recieve=PIG"
            color={theme.colors.PIG}
            textColor={theme.colors.white}
          >
            <H2>Boost PIG</H2>
          </FlexSolidNavLink>
        ) : (
          <FlexTransparentNavLink
            flex={Math.round((1 - UNIDominance) * 100, 0)}
            href="/trade?recieve=PIG"
            color={theme.colors.PIG}
          >
            <H2>Boost PIG</H2>
          </FlexTransparentNavLink>
        )}
      </BoostWrapper>

      <GradientButton onClick={resetApp}>Reset</GradientButton>
    </>
  )
}

Home.getInitialProps = async () => {
  const random = Math.random()
  return {
    UNIBalance: random * 100,
    PIGBalance: (1 - random) * 100
  }
}

export default Home
