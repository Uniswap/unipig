import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import { Wallet } from '@ethersproject/wallet'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import { getHost } from '../utils'
import { useAddMnemonic, useMnemonicExists, useTeamExists, Team, useAddTeam } from '../contexts/Cookie'
import NavLink from '../components/NavLink'
import NavButton from '../components/NavButton'
import Progress from '../components/Progress'
import Emoji from '../components/Emoji'
import Shim from '../components/Shim'
import { Heading, Title, Body, Desc, ButtonText } from '../components/Type'
import { AnimatedFrame, containerAnimation, childAnimation } from '../components/Animation'

const CopyWrapper = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const OpacityWrapper = styled.span`
  color: rgba(254, 109, 222, 0.4);
  -webkit-text-fill-color: initial;
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

function Welcome({ mnemonic, team, override }) {
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
    if (mnemonic && (override || !mnemonicExists)) {
      addMnemonic(mnemonic)
    }
  }, [mnemonic, override, mnemonicExists, addMnemonic])

  // save the team (guaranteed to be correct from getInitialProps)
  const addTeam = useAddTeam()
  useEffect(() => {
    if (team && (override || !teamExists)) {
      addTeam(team)
    }
  }, [team, override, teamExists, addTeam])

  // if cookies are enabled, clear url (everything we need is in props)
  const router = useRouter()
  const { query } = router
  useEffect(() => {
    if (cookiesEnabled && Object.keys(query).length > 0) {
      router.push('/welcome', undefined, { shallow: true })
    }
  })

  return (
    <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
      <Heading>{teamExists ? 'Nice to see you again.' : 'Hello friend.'}</Heading>
      <Shim size={1} />
      <Title textStyle="gradient">Welcome {teamExists ? 'back!' : 'to Unipig.'}</Title>
      <Shim size={4} />
      <Desc>
        A gamified demo of Uniswap on Ethereum Layer 2.{' '}
        <NavLink href="/welcome">
          <b>Learn more ↗</b>
        </NavLink>
      </Desc>
      <Shim size={2} />
      <span>
        <CopyWrapper>
          <Emoji emoji="⚡" label="lightning" />
          <pre> </pre>
          <Body textStyle="gradient">Instant.</Body>
          <pre> </pre>
          <OpacityWrapper>No gas and blazing UX</OpacityWrapper>
        </CopyWrapper>
        <CopyWrapper>
          <Emoji emoji="🌐" label="globe" />
          <pre> </pre>
          <Body textStyle="gradient">Scalable.</Body>
          <pre> </pre>
          <OpacityWrapper>~2,000 tx/s</OpacityWrapper>
        </CopyWrapper>
        <CopyWrapper>
          <Emoji emoji="🔗" label="chain" />
          <pre> </pre>
          <Body textStyle="gradient">Secure.</Body>
          <pre> </pre>
          <OpacityWrapper>Optimistic rollup architecture</OpacityWrapper>
        </CopyWrapper>
      </span>
      <Shim size={24} />
      <Progress progress="33%" />

      <AnimatedFrame variants={childAnimation}>
        <ErrorNavButton
          href={teamExists ? '/' : '/join-team'}
          error={cookiesEnabled === false}
          variant={cookiesEnabled === false ? 'outlined' : 'gradient'}
          disabled={!mnemonicExists || !cookiesEnabled}
          stretch
        >
          <ButtonText>
            {cookiesEnabled === false ? 'Enable cookies to continue.' : teamExists ? 'Keep playing!' : 'Let me in!'}
          </ButtonText>
        </ErrorNavButton>
      </AnimatedFrame>
    </AnimatedFrame>
  )
}

Welcome.getInitialProps = async context => {
  const { query, req } = context
  const { mnemonic, team, override, referrer } = query || {}

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
    return {
      mnemonic: wallet ? wallet.mnemonic : Wallet.createRandom().mnemonic,
      team: [Team.UNI, Team.PIGI].includes(Team[team]) ? Team[team] : undefined,
      override: !!override,
      referrer,
      paperWallet: false
    }
  }

  return {
    mnemonic: wallet.mnemonic,
    team: [Team.UNI, Team.PIGI].includes(Team[team]) ? Team[team] : undefined,
    override: !!override,
    referrer,
    paperWallet: true
  }
}

export default Welcome
