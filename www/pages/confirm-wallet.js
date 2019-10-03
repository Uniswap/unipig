import dynamic from 'next/dynamic'
import styled from 'styled-components'

import { Team } from '../contexts/Client'
import NavButton from '../components/NavButton'
import Wallet from '../components/MiniWallet'
import Shim from '../components/Shim'
import { Heading, Title, ButtonText, Body } from '../components/Type'
import { AnimatedFrame, containerAnimation, childAnimation } from '../components/Animation'

const Confetti = dynamic(() => import('../components/Confetti'), { ssr: false })

const TeamHeader = styled(Title)`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI])} !important;
`

export default function ConfirmWallet({ wallet, team, OVMBalances }) {
  return (
    <>
      <Confetti start={OVMBalances[Team.UNI] !== undefined && OVMBalances[Team.PIGI] !== undefined} />
      <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
        <Heading>Here’s a wallet!</Heading>
        <TeamHeader textStyle="gradient" team={team}>
          Welcome to #team{team === Team.UNI ? 'UNI' : 'PIGI'}.
        </TeamHeader>

        <Shim size={24} />
        <Wallet wallet={wallet} team={team} OVMBalances={OVMBalances} />
        <Shim size={24} />

        <Body textStyle="gradient">
          <b>Buy {team === Team.UNI ? 'UNI' : 'PIGI'}</b> with {team === Team.UNI ? 'PIGI' : 'UNI'} to help your team
          gain price{' '}
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
