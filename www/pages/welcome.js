import { useEffect } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import { Wallet } from '@ethersproject/wallet'

import { getHost } from '../utils'
import { WalletSource, Team, useAddSource, useAddMnemonic, useSource, useWallet, useTeam } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Progress from '../components/Progress'
import Emoji from '../components/Emoji'
import Shim from '../components/Shim'

import { Heading, Title, Body, Desc, ButtonText } from '../components/Type'

const UNI = styled.span`
  color: ${({ theme }) => theme.colors[Team.UNI]} !important;
  width: 100%;
  font-weight: 600;
`

const PIG = styled.span`
  color: ${({ theme }) => theme.colors[Team.PIG]} !important;
  width: 100%;
  font-weight: 600;
`

const CopyWrapper = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const OpacityWrapper = styled.span`
  /* filter: brightness(50); */
  color: rgba(254, 109, 222, 0.4);
  /* width: 100%; */
  -webkit-text-fill-color: initial;
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
      <Heading>Hello friend.</Heading>
      <Shim size={1} />
      <Title textStyle="gradient">Welcome to Unipig.</Title>
      <Shim size={4} />
      <Desc>
        A gamified demo of Uniswap on Ethereum Layer 2.{' '}
        <b>
          <a href="">Learn more ↗</a>
        </b>
      </Desc>
      <Shim size={2} />
      <span>
        <CopyWrapper>
          <Emoji emoji="⚡" label="unicorn" />
          <pre> </pre>
          <Body textStyle="gradient">Instant.</Body>
          <pre> </pre>
          <OpacityWrapper>No gas and instant UX</OpacityWrapper>
        </CopyWrapper>
        <CopyWrapper>
          <Emoji emoji="🌐" label="unicorn" />
          <pre> </pre>
          <Body textStyle="gradient">Scalable.</Body>
          <pre> </pre>
          <OpacityWrapper>~ 2000 tps</OpacityWrapper>
        </CopyWrapper>
        <CopyWrapper>
          <Emoji emoji="🔗" label="unicorn" />
          <pre> </pre>
          <Body textStyle="gradient">Secure.</Body>
          <pre> </pre>
          <OpacityWrapper>Optimistic rollup architecture</OpacityWrapper>
        </CopyWrapper>
      </span>
      <Shim size={24} />
      {/* <Progress progress="30%" /> */}
      <NavButton variant="gradient" href={wallet && team ? '/' : '/join-team'} disabled={!wallet} stretch>
        <ButtonText>Let me in!</ButtonText>
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
