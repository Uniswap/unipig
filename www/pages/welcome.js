import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Wallet } from '@ethersproject/wallet'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'

import { useAddAccount, useAccountExists, useTeamExists, useAddTeam, getWallet, Team } from '../contexts/Client'
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

function Welcome({ accountFromQuery: account, teamFromQuery: team, override, referrer }) {
  const router = useRouter()

  const accountExists = useAccountExists()
  const addAccount = useAddAccount()

  const teamExists = useTeamExists()
  const addTeam = useAddTeam()

  // initialize account
  useEffect(() => {
    if (accountExists === false || override) {
      addAccount(account || Wallet.createRandom().mnemonic)
    }
  }, [accountExists, override, account, addAccount])

  // initialize (optional) team
  useEffect(() => {
    if (team && (teamExists === false || override)) {
      addTeam(team)
    }
  }, [team, teamExists, override, addTeam])

  // check if cookies are enabled
  const [cookiesEnabled, setCookiesEnabled] = useState()
  useEffect(() => {
    setCookiesEnabled(navigator ? navigator.cookieEnabled : false)
  }, [])

  // if there is a url, clear it if cookies are enabled
  useEffect(() => {
    if (Object.keys(router.query).length > 0 && cookiesEnabled) {
      router.push('/welcome', '/welcome', { shallow: true })
    }
  })

  useEffect(() => {
    if (referrer) {
      console.log(`Referred by ${referrer}`)
    }
  }, [referrer])

  return (
    <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
      <Heading>{teamExists ? 'Nice to see you again.' : 'Hello friend.'}</Heading>
      <Shim size={1} />
      <Title textStyle="gradient">Welcome {teamExists ? 'back!' : 'to Unipig.'}</Title>
      <Shim size={4} />
      <Desc>
        A gamified demo of Uniswap on Ethereum Layer 2.{' '}
        <NavLink href="/info">
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
          <OpacityWrapper>~200 tx/s (x10 with optimizations)</OpacityWrapper>
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
          disabled={!accountExists || !cookiesEnabled}
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
  const { query } = context // query can contain: account, team, override, referrer

  // create a wallet, if mnemonic exists and is valid
  let account
  if (query.account) {
    try {
      const wallet = getWallet(query.account)
      account = wallet.mnemonic || wallet.privateKey
    } catch {
      account = null
    }
  }

  let team
  if (query.team) {
    const parsedTeam = Team[query.team]
    if ([Team.UNI, Team.PIGI].includes(parsedTeam)) {
      team = parsedTeam
    } else {
      team = null
    }
  }

  const override = query.override ? query.override === 'true' : undefined

  const referrer = query.referrer ? query.referrer : undefined

  return { accountFromQuery: account, teamFromQuery: team, override, referrer }
}

export default Welcome
