import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { motion, useMotionValue, transform } from 'framer-motion'

import { DataNeeds } from '../constants'
import { useStyledTheme } from '../hooks'
import { Team } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import WalletComponent from '../components/MiniWallet'
import Dominance from '../components/Dominance'
import Shim from '../components/Shim'
import { Title, ButtonText, Body } from '../components/Type'
import { AnimatedFrame, containerAnimation, childAnimation } from '../components/Animation'

const WalletModal = dynamic(() => import('../components/WalletModal'), { ssr: false })

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

const inputRange = [0, 1]
const outputRange = [0, 100]
function DominancePercentage({ UNIDominance }) {
  const [statefulX, setStatefulX] = useState(0)
  const x = useMotionValue(0)

  useEffect(() => {
    const unsubscribeX = x.onChange(() =>
      setStatefulX(Math.round(transform(UNIDominance >= 0.5 ? x.current : 1 - x.current, inputRange, outputRange), 2))
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
          duration: 1.25,
          ease: 'easeOut'
        }}
      />
      <FixedNum>
        {UNIDominance >= 0.5 ? 'Unicorn' : 'Pig'} dominance is at {statefulX}%
      </FixedNum>
    </>
  )
}

function Home({
  wallet,
  team,
  addressData,
  updateAddressData,
  reservesData,
  balancesData,
  updateBalancesData,
  walletModalIsOpen,
  setWalletModalIsOpen
}) {
  const UNIDominance = reservesData[Team.PIGI] / (reservesData[Team.UNI] + reservesData[Team.PIGI])

  const theme = useStyledTheme()

  const showFaucet = addressData.canFaucet && balancesData[Team.UNI] === 0 && balancesData[Team.PIGI] === 0

  return (
    <>
      <WalletModal
        wallet={wallet}
        team={team}
        addressData={addressData}
        updateAddressData={updateAddressData}
        balances={balancesData}
        updateBalancesData={updateBalancesData}
        isOpen={walletModalIsOpen}
        onDismiss={() => {
          setWalletModalIsOpen(false)
        }}
      />
      <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
        <Title color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
          <DominancePercentage UNIDominance={UNIDominance} />
        </Title>
        <Shim size={12} />

        <Dominance percent={UNIDominance * 100} />

        <Body size={18} color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
          {UNIDominance >= 0.5 ? 'Unicorns' : 'Pigs'} are winning!
        </Body>

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
              disabled={balancesData[Team.PIGI] === 0}
              flex={Math.round(UNIDominance * 100, 0)}
              href={`/trade?buy=${Team[Team.UNI]}`}
              color={'primary'}
              variant={team === Team.UNI ? 'contained' : 'outlined'}
            >
              <ButtonText>Dump PIGI</ButtonText>
            </FlexNavButton>

            <BoostShim />

            <FlexNavButton
              disabled={balancesData[Team.UNI] === 0}
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
            balances={balancesData}
            walletType={'rest'}
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
    dataNeeds: {
      [DataNeeds.ADDRESS]: true,
      [DataNeeds.BALANCES]: true,
      [DataNeeds.RESERVES]: true
    }
  }
}

export default Home
