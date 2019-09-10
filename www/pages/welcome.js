import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Wallet } from '@ethersproject/wallet'

import { Team } from '../constants'
import { useTeam, useWallet, useAddMnemonic } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Progress from '../components/Progress'
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
      <Heading>Hello friend.</Heading>
      <Title textStyle="gradient">Welcome to the Devcon 5 Trading Game</Title>
      <Body textStyle="gradient">
        Who will win? <br></br>
        <UNI>UNI</UNI> vs <PIG>PIG</PIG>
      </Body>
      <Desc>
        Experience{' '}
        <b>
          <i>L2</i>
        </b>{' '}
        UX with a Uniswap-based trading game.
      </Desc>
      <Progress progress="30%" />
      <NavButton variant="gradient" href={wallet && team ? '/' : '/join-team'} disabled={!wallet} stretch>
        <ButtonText>Let me in!</ButtonText>
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
