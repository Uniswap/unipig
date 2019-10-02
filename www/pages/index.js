import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion, useMotionValue } from 'framer-motion'
import { formatSignificant } from '@uniswap/sdk'

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

const FlexNavButton = styled(NavButton)`
  flex-grow: 1;
`

const TwitterButton = styled(NavButton)`
  color: white;
  background-color: #1da1f2;
  :hover {
    background-color: rgba(29, 161, 242, 0.6);
  }
`

const FixedNum = styled.span`
  font-variant-numeric: tabular-nums;
`

const PriceDisplay = styled.div`
  width: 100%;
  text-align: center;
  opacity: 0.75;
  color: ${({ color }) => color};
`

function DominancePercentage({ UNIDominance, PIGIDominance }) {
  const [statefulX, setStatefulX] = useState(0)
  const x = useMotionValue(0)

  useEffect(() => {
    const unsubscribeX = x.onChange(() => setStatefulX((x.current * 100).toFixed(2)))
    return () => {
      unsubscribeX()
    }
  }, [x, UNIDominance])

  return (
    <>
      <motion.div
        style={{ x }}
        animate={{
          x: UNIDominance >= 0.5 ? UNIDominance : PIGIDominance
        }}
        transition={{
          duration: 1.5,
          ease: 'easeOut'
        }}
      />
      <FixedNum>
        {UNIDominance >= 0.5 ? 'UNI' : 'PIGI price'}
        <br />
        dominance {statefulX}%
      </FixedNum>
    </>
  )
}

function Home({
  wallet,
  team,
  addressData,
  OVMBalances,
  OVMReserves,
  marketDetails,
  setWalletModalIsOpen,
  updateTotal
}) {
  const UNIDominance =
    OVMReserves[Team.UNI] !== undefined && OVMReserves[Team.PIGI] !== undefined
      ? OVMReserves[Team.PIGI] / (OVMReserves[Team.UNI] + OVMReserves[Team.PIGI])
      : null
  const PIGIDominance = UNIDominance && 1 - UNIDominance

  const theme = useStyledTheme()

  const showFaucet = addressData.canFaucet && OVMBalances[Team.UNI] === 0 && OVMBalances[Team.PIGI] === 0

  return (
    <>
      <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
        <Title color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
          <DominancePercentage UNIDominance={UNIDominance} PIGIDominance={PIGIDominance} />
        </Title>
        <Shim size={12} />

        <Dominance team={team} updateTotal={updateTotal} UNIDominance={UNIDominance} PIGIDominance={PIGIDominance} />

        <Shim size={12} />

        <Body color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]} size={18}>
          {showFaucet ? (
            <i>You still need to grab some tokens to play. Use the Twitter faucet below to get some.</i>
          ) : (
            <i>
              Sell <b>{team === Team.UNI ? 'PIGI' : 'UNI'}</b> tokens to help your team achieve price dominance!
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
              disabled={!(OVMBalances[team === Team.UNI ? Team.PIGI : Team.UNI] > 0)}
              href={`/trade?buy=${team === Team.UNI ? Team[Team.UNI] : Team[Team.PIGI]}`}
              color={team === Team.UNI ? 'primary' : 'secondary'}
              variant="contained"
            >
              <ButtonText>Sell {team === Team.UNI ? 'PIGI' : 'UNI'}</ButtonText>
            </FlexNavButton>

            <BoostShim />

            <FlexNavButton
              disabled={!(OVMBalances[team === Team.PIGI ? Team.PIGI : Team.UNI] > 0)}
              href={`/trade?buy=${team === Team.PIGI ? Team[Team.UNI] : Team[Team.PIGI]}`}
              color={team === Team.PIGI ? 'primary' : 'secondary'}
              variant={'outlined'}
            >
              <ButtonText>Sell {team === Team.PIGI ? 'PIGI' : 'UNI'}</ButtonText>
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

        <Shim size={24} />

        <AnimatedFrame variants={childAnimation}>
          <PriceDisplay color={team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
            1 {Team[team]} ={' '}
            {marketDetails && marketDetails.marketRate.rateInverted
              ? formatSignificant(marketDetails.marketRate.rateInverted, {
                  significantDigits: 3,
                  forceIntegerSignificance: true
                })
              : '...'}{' '}
            {Team[team === Team.UNI ? Team.PIGI : Team.UNI]}
          </PriceDisplay>
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
