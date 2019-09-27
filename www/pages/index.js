import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion, useMotionValue } from 'framer-motion'

import { useStyledTheme } from '../hooks'
import { Team } from '../contexts/Client'
import NavButton from '../components/NavButton'
import WalletComponent from '../components/MiniWallet'
import Dominance from '../components/Dominance'
import Shim from '../components/Shim'
import { Title, ButtonText, Body } from '../components/Type'
import { AnimatedFrame, containerAnimation, childAnimation } from '../components/Animation'

const BoostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const BoostShim = styled.span`
  width: 16px;
  height: 16px;
`

const TwitterButton = styled(NavButton)`
  color: white;
  background-color: #1da1f2;
  :hover {
    background-color: rgba(29, 161, 242, 0.6);
  }
`

const FlexNavButton = styled(NavButton)`
  flex-grow: ${({ flex }) => flex};
`

const FixedNum = styled.span`
  font-variant-numeric: tabular-nums;
`

function DominancePercentage({ UNIDominance }) {
  const [statefulX, setStatefulX] = useState(0)
  const x = useMotionValue(0)

  useEffect(() => {
    const unsubscribeX = x.onChange(() =>
      setStatefulX(((UNIDominance >= 0.5 ? x.current : 1 - x.current) * 100).toFixed(2))
    )
    return () => {
      unsubscribeX()
    }
  }, [x, UNIDominance])

  return (
    <>
      <motion.div
        style={{ x }}
        animate={{
          x: UNIDominance
        }}
        transition={{
          duration: 1.5,
          ease: 'easeOut'
        }}
      />
      <FixedNum>
        {UNIDominance >= 0.5 ? 'Unicorn' : 'Pig'}
        <br />
        dominance {statefulX}%
      </FixedNum>
    </>
  )
}

function Home({ wallet, team, addressData, OVMBalances, OVMReserves, setWalletModalIsOpen }) {
  const UNIDominance =
    OVMReserves[Team.UNI] !== undefined && OVMReserves[Team.PIGI] !== undefined
      ? OVMReserves[Team.PIGI] / (OVMReserves[Team.UNI] + OVMReserves[Team.PIGI])
      : null

  const theme = useStyledTheme()

  const showFaucet = addressData.canFaucet && OVMBalances[Team.UNI] === 0 && OVMBalances[Team.PIGI] === 0

  return (
    <>
      <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
        <Title color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
          <DominancePercentage UNIDominance={UNIDominance} />
        </Title>
        <Shim size={12} />

        <Dominance percent={UNIDominance * 100} />

        <Shim size={12} />

        <Body color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]} size={18}>
          {showFaucet ? (
            <i>You still need to grab some tokens to play. Use the Twitter faucet below to get some.</i>
          ) : (
            <i>
              Dump your <b>{team === Team.UNI ? 'PIGI' : 'UNI'}</b> tokens to help your team gain dominance.
            </i>
          )}
        </Body>

        <Shim size={32} />

        {showFaucet ? (
          <TwitterButton href={`/twitter-faucet`} stretch>
            <ButtonText>Get Tokens from Twitter</ButtonText>
          </TwitterButton>
        ) : (
          <BoostWrapper>
            <FlexNavButton
              disabled={!(OVMBalances[Team.PIGI] > 0)}
              flex={Math.round(UNIDominance * 100, 0)}
              href={`/trade?buy=${Team[Team.UNI]}`}
              color={'primary'}
              variant={team === Team.UNI ? 'contained' : 'outlined'}
            >
              <ButtonText>Dump PIGI</ButtonText>
            </FlexNavButton>

            <BoostShim />

            <FlexNavButton
              disabled={!(OVMBalances[Team.UNI] > 0)}
              flex={Math.round((1 - UNIDominance) * 100, 0)}
              href={`/trade?buy=${Team[Team.PIGI]}`}
              color={'secondary'}
              variant={team === Team.PIGI ? 'contained' : 'outlined'}
            >
              <ButtonText>Dump UNI</ButtonText>
            </FlexNavButton>
          </BoostWrapper>
        )}

        <Shim size={36} />

        <AnimatedFrame variants={childAnimation}>
          <WalletComponent
            wallet={wallet}
            team={team}
            OVMBalances={OVMBalances}
            onClick={() => {
              setWalletModalIsOpen(true)
            }}
          />
        </AnimatedFrame>
      </AnimatedFrame>
    </>
  )
}

Home.getInitialProps = async () => {
  return {
    addressData: true
  }
}

export default Home
