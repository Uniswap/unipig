import { useEffect } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import { Wallet } from '@ethersproject/wallet'

import { getHost } from '../utils'
import { WalletSource, Team, useAddSource, useAddMnemonic, useSource, useWallet, useTeam } from '../contexts/Cookie'
import NavButton from '../components/NavButton'

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.uniswap};
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

function Welcome({ mnemonic, fromPaper }) {
  const source = useSource()
  const wallet = useWallet()
  const team = useTeam()

  // save the source of the wallet
  const addSource = useAddSource()
  useEffect(() => {
    if (!source) {
      addSource(fromPaper ? WalletSource.PAPER : WalletSource.GENERATED)
    }
  }, [source, fromPaper, addSource])

  // if a wallet doesn't exist, save the mnemonic (guaranteed to be correct from getInitialProps)
  const addMnemonic = useAddMnemonic()
  useEffect(() => {
    if (!wallet) {
      addMnemonic(mnemonic)
    }
  }, [wallet, addMnemonic, mnemonic])

  // once a wallet exists, clear mnemonic from url if it's there
  const router = useRouter()
  const { query } = router
  useEffect(() => {
    if (query && query.mnemonic && wallet) {
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
      <NavButton variant="gradient" href={team ? '/' : '/join-team'} disabled={!!(!source || !wallet)}>
        <H2>Get Started</H2>
      </NavButton>
    </>
  )
}

Welcome.getInitialProps = async context => {
  const { query, req } = context
  const { mnemonic } = query || {}

  // validate the mnemonic if it exists
  let wallet
  if (mnemonic) {
    try {
      const parsedMnemonic = mnemonic.replace(/-/g, ' ')
      wallet = Wallet.fromMnemonic(parsedMnemonic)
    } catch {}
  }

  // check if the address is whitelisted
  let walletIsValid
  if (wallet) {
    walletIsValid = await fetch(`${getHost(req)}/api/validate-paper-wallet`, {
      method: 'POST',
      body: JSON.stringify({ address: wallet.address })
    })
      .then(response => response.ok || false)
      .catch(error => {
        console.error(error)
        return false
      })
  }

  if (!wallet || !walletIsValid) {
    return { mnemonic: wallet ? wallet.mnemonic : Wallet.createRandom().mnemonic, fromPaper: false }
  }

  return { mnemonic: wallet.mnemonic, fromPaper: true }
}

export default Welcome
