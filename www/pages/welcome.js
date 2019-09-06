import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Wallet } from '@ethersproject/wallet'

import { Team } from '../constants'
import { useTeam, useWallet, useAddMnemonic } from '../contexts/Cookie'
import NavButton from '../components/NavButton'

const Title = styled.h1`
  margin: 0;
  /* color: ${({ theme }) => theme.colors.uniswap}; */
  font-size: 48px;
  background: linear-gradient(to right, #fe6dde 0%, #fe6d6d 100%);
  background-clip: text;
`

const Body = styled.p`
  color: ${({ theme }) => theme.colors.uniswap};
`

const UNI = styled.span`
  color: ${({ theme }) => theme.colors[Team.UNI]};
`

const PIG = styled.span`
  color: ${({ theme }) => theme.colors[Team.PIG]};
`

const H2 = styled.h2`
  margin: 0;
`

function Welcome({ mnemonic }) {
  const wallet = useWallet()
  const team = useTeam()

  // if a wallet doesn't exist, save the mnemonic
  const addMnemonic = useAddMnemonic()
  useEffect(() => {
    if (!wallet) {
      addMnemonic(mnemonic)
    }
  }, [wallet, addMnemonic, mnemonic])

  // once a wallet exists, clear mnemonic from url if it's there
  const router = useRouter()
  useEffect(() => {
    if (wallet && router.query && router.query.mnemonic) {
      router.push('/welcome', '/welcome', { shallow: true })
    }
  })

  return (
    <>
      <Title>Welcome to the Devcon 5 Trading Game</Title>
      <Body>
        Who will win? <UNI>UNI</UNI> vs <PIG>PIG</PIG>
      </Body>
      <Body>Experience Layer 2 UX with a Uniswap-based trading game.</Body>
      <NavButton variant="gradient" href={wallet && team ? '/' : '/join-team'} disabled={!wallet}>
        <H2>Get Started</H2>
      </NavButton>
    </>
  )
}

// TODO figure out Sybil
Welcome.getInitialProps = async context => {
  const { query } = context
  const { mnemonic } = query || {}

  if (mnemonic) {
    try {
      const parsedMnemonic = mnemonic.replace(/-/g, ' ')
      Wallet.fromMnemonic(parsedMnemonic)
      return { mnemonic: parsedMnemonic }
    } catch {}
  }

  return { mnemonic: Wallet.createRandom().mnemonic }
}

export default Welcome
