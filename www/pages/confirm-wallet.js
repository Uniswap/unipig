import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Team } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Wallet from '../components/MiniWallet'
import Shim from '../components/Shim'
import { Heading, Title, ButtonText, Body } from '../components/Type'
import { AnimatedFrame, containerAnimation, childAnimation } from '../components/Animation'

import Confetti from 'react-dom-confetti'

import Progress from '../components/Progress'

const TeamHeader = styled(Title)`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI])} !important;
`

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 5000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

function ConfirmWallet({ balances, team, wallet }) {
  const [bang, setBang] = useState(false)
  useEffect(() => {
    setTimeout(() => setBang(true), 300)
  }, [])

  return (
    <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
      <Heading>Here’s a wallet and some tokens!</Heading>
      <TeamHeader textStyle="gradient" team={team}>
        Welcome to #team{team === Team.UNI ? 'UNI' : 'PIGI'}.
      </TeamHeader>

      <Shim size={24} />

      <Wallet wallet={wallet} team={team} balances={balances} disableNav />

      <Shim size={24} />

      <Body textStyle="gradient">
        Dump <b>{team === Team.UNI ? 'PIGI' : 'UNI'}</b> for <b>{team === Team.UNI ? 'UNI' : 'PIGI'}</b> to help your
        team gain price{' '}
        <b>
          <i>dominance.</i>
        </b>
      </Body>

      <Shim size={32} />

      {/* <Progress progress="100%" /> */}

      <AnimatedFrame variants={childAnimation}>
        <NavButton variant="gradient" href="/" stretch>
          <ButtonText>Let's play.</ButtonText>
        </NavButton>
      </AnimatedFrame>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Confetti active={bang} config={config} />
      </div>
    </AnimatedFrame>
  )
}

// TODO add PG API and deal with decimals
ConfirmWallet.getInitialProps = async () => {
  return {
    balances: {
      [Team.UNI]: 5,
      [Team.PIGI]: 5
    }
  }
}

export default ConfirmWallet
