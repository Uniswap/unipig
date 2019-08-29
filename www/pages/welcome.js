import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Wallet } from '@ethersproject/wallet'

import { useTeam, useWallet, useAddMnemonic } from '../contexts/Cookie'
import { GradientNavLink } from '../components/NavLink'

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.uniswap};
`

const Body = styled.p`
  color: ${({ theme }) => theme.colors.uniswap};
`

const UNI = styled.span`
  color: ${({ theme }) => theme.colors.UNI};
`

const PIG = styled.span`
  color: ${({ theme }) => theme.colors.PIG};
`

const H2 = styled.h2`
  margin: 0;
`

function Welcome({ mnemonic }) {
  const team = useTeam()
  const wallet = useWallet()

  // save mnemonic
  const addMnemonic = useAddMnemonic()
  useEffect(() => {
    addMnemonic(mnemonic)
  }, [addMnemonic, mnemonic])

  // clear mnemonic from url
  const router = useRouter()
  useEffect(() => {
    if (router.query && router.query.mnemonic && wallet) {
      router.push('/welcome', '/welcome', { shallow: true })
    }
  })

  return (
    <div>
      <Title>Welcome to the Devcon 5 Trading Game</Title>
      <Body>
        Who will win? <UNI>UNI</UNI> vs <PIG>PIG</PIG>
      </Body>
      <Body>Experience Layer 2 UX with a Uniswap-based trading game.</Body>
      <GradientNavLink disabled={!wallet} href={team && wallet ? '/' : '/join-team'}>
        <H2>Get Started</H2>
      </GradientNavLink>
    </div>
  )
}

Welcome.getInitialProps = async ({ query }) => {
  const { mnemonic } = query || {}

  if (mnemonic) {
    try {
      const parsedMnemonic = mnemonic.replace(/-/g, ' ')
      Wallet.fromMnemonic(parsedMnemonic)
      return { mnemonic: parsedMnemonic }
    } catch {}
  }

  // in reality this might be some twitter auth scenario
  return { mnemonic: Wallet.createRandom().mnemonic }
}

export default Welcome
