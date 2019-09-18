import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

import { DataNeeds } from '../constants'
import { Team } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Wallet from '../components/MiniWallet'
import Shim from '../components/Shim'
import { Heading, Title, ButtonText, Body } from '../components/Type'
import { AnimatedFrame, containerAnimation, childAnimation } from '../components/Animation'

const Confetti = dynamic(() => import('../components/Confetti'), { ssr: false })

const TeamHeader = styled(Title)`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI])} !important;
`

function ConfirmWallet({ team, wallet, balancesData }) {
  const [bang, setBang] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setBang(true), 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      <Confetti start={bang} />
      <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
        <Heading>Here’s a wallet and some tokens!</Heading>
        <TeamHeader textStyle="gradient" team={team}>
          Welcome to #team{team === Team.UNI ? 'UNI' : 'PIGI'}.
        </TeamHeader>
        <Shim size={24} />
        <Wallet wallet={wallet} team={team} balances={balancesData} />
        <Shim size={24} />
        <Body textStyle="gradient">
          Dump <b>{team === Team.UNI ? 'PIGI' : 'UNI'}</b> for <b>{team === Team.UNI ? 'UNI' : 'PIGI'}</b> to help your
          team gain price{' '}
          <b>
            <i>dominance.</i>
          </b>
        </Body>
        <Shim size={32} />
        <AnimatedFrame variants={childAnimation}>
          <NavButton variant="gradient" href="/" stretch>
            <ButtonText>Let's play.</ButtonText>
          </NavButton>
        </AnimatedFrame>
      </AnimatedFrame>
    </>
  )
}

ConfirmWallet.getInitialProps = () => {
  return {
    dataNeeds: {
      [DataNeeds.BALANCES]: true
    }
  }
}

export default ConfirmWallet
