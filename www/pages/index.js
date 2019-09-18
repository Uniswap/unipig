import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { motion, useMotionValue } from 'framer-motion'

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

function Home({
  wallet,
  team,
  addressData,
  updateAddressData,
  reservesData,
  balancesData,
  walletModalIsOpen,
  setWalletModalIsOpen
}) {
  const UNIDominance = reservesData[Team.PIGI] / (reservesData[Team.UNI] + reservesData[Team.PIGI])

  const theme = useStyledTheme()

  const x = useMotionValue(0)

  const [count, setCount] = useState(0)

  useEffect(() => {
    const unsubscribeX = x.onChange(() => setCount(Math.round(x.current)))
    return () => {
      unsubscribeX()
    }
  }, [x])

  const showFaucet = addressData.canFaucet && balancesData[Team.UNI] === 0 && balancesData[Team.PIGI] === 0

  return (
    <>
      <WalletModal
        wallet={wallet}
        team={team}
        addressData={addressData}
        updateAddressData={updateAddressData}
        balances={balancesData}
        isOpen={walletModalIsOpen}
        onDismiss={() => {
          setWalletModalIsOpen(false)
        }}
      />
      <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
        <Title color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
          {UNIDominance >= 0.5 ? (
            <FixedNum>Unicorn dominance is at {count}%</FixedNum>
          ) : (
            <FixedNum>Pig dominance is at {count}%</FixedNum>
          )}
        </Title>
        <Shim size={12} />

        <Dominance percent={UNIDominance * 100} />

        <motion.div
          style={{ x }}
          animate={{
            x: UNIDominance >= 0.5 ? Math.round(UNIDominance * 100, 2) : Math.round((1 - UNIDominance) * 100, 2)
          }}
          transition={{ ease: 'easeOut', duration: 1 }}
        ></motion.div>

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
