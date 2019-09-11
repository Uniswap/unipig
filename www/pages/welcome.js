import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import { Wallet } from '@ethersproject/wallet'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import { getHost } from '../utils'
import { Team, useAddMnemonic, useMnemonicExists, useTeamExists } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Progress from '../components/Progress'
import { Heading, Title, Body, Desc, ButtonText } from '../components/Type'

const UNI = styled.span`
  color: ${({ theme }) => theme.colors[Team.UNI]} !important;
  width: 100%;
  font-weight: 600;
`

const PIG = styled.span`
  color: ${({ theme }) => theme.colors[Team.PIGI]} !important;
  width: 100%;
  font-weight: 600;
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilteredNavButton = ({ error, ...rest }) => <NavButton {...rest} />
const ErrorNavButton = styled(FilteredNavButton)`
  ${({ error, theme }) =>
    error &&
    css`
      opacity: 1};
      color: ${theme.colors.error} !important;
      border-color: ${transparentize(0.75, theme.colors.error)} !important;
    `}
`

function Welcome({ mnemonic }) {
  // existence checks for cookie data
  const mnemonicExists = useMnemonicExists()
  const teamExists = useTeamExists()

  // check if cookies are enabled
  const [cookiesEnabled, setCookiesEnabled] = useState()
  useEffect(() => {
    setCookiesEnabled(navigator ? navigator.cookieEnabled : false)
  }, [])

  // save the mnemonic (guaranteed to be correct from getInitialProps)
  const addMnemonic = useAddMnemonic()
  useEffect(() => {
    if (!mnemonicExists) {
      addMnemonic(mnemonic)
    }
  }, [mnemonicExists, mnemonic, addMnemonic])

  // once a mnemonic exists, clear mnemonic from url if it's there (only if cookies are enabled)
  const router = useRouter()
  const { query } = router
  useEffect(() => {
    if (cookiesEnabled && mnemonicExists && query && query.mnemonic) {
      router.push('/welcome', '/welcome', { shallow: true })
    }
  })

  return (
    <>
      <Heading>Hello friend.</Heading>
      <Title textStyle="gradient">Welcome to the Devcon 5 Trading Game</Title>

      <Body textStyle="gradient">
        Who will win? <br />
        <UNI>UNI</UNI> vs <PIG>PIG</PIG>
      </Body>
      <Desc>
        Experience{' '}
        <b>
          <i>L2</i>
        </b>{' '}
        UX with a Uniswap-based trading game.
      </Desc>

      <Progress progress="33%" />

      <ErrorNavButton
        error={cookiesEnabled === false}
        variant={cookiesEnabled === false ? 'outlined' : 'gradient'}
        href={teamExists ? '/' : '/join-team'}
        disabled={!mnemonicExists || !cookiesEnabled}
        stretch
      >
        <ButtonText>{cookiesEnabled === false ? 'Enable cookies to continue.' : 'Let me in!'}</ButtonText>
      </ErrorNavButton>
    </>
  )
}

Welcome.getInitialProps = async context => {
  const { query, req } = context
  const { mnemonic } = query || {}

  // create a wallet, if mnemonic exists and is valid
  let wallet = null
  if (mnemonic) {
    try {
      const parsedMnemonic = mnemonic.replace(/-/g, ' ')
      wallet = Wallet.fromMnemonic(parsedMnemonic)
    } catch {}
  }

  // check if the address is whitelisted
  let walletIsValid = false
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
    return { mnemonic: wallet ? wallet.mnemonic : Wallet.createRandom().mnemonic, paperWallet: false }
  }

  return { mnemonic: wallet.mnemonic, paperWallet: true }
}

export default Welcome
