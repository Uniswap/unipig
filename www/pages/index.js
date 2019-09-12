import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, useMotionValue } from 'framer-motion'

import { useStyledTheme } from '../hooks'
import { Team } from '../contexts/Cookie'
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

function Home({ wallet, team, addressData, reserves, balances }) {
  const UNIDominance = reserves[Team.UNI] / (reserves[Team.UNI] + reserves[Team.PIGI])

  const theme = useStyledTheme()

  const x = useMotionValue(0)

  const [count, setCount] = useState(0)

  useEffect(() => {
    const unsubscribeX = x.onChange(() => setCount(Math.round(x.current)))
    return () => {
      unsubscribeX()
    }
  }, [x])

  return (
    <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
      <Title size={64} color={UNIDominance >= 0.5 ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}>
        {UNIDominance >= 0.5 ? (
          <FixedNum>UNI dominance is at {count}%</FixedNum>
        ) : (
          <FixedNum>Pig dominance is at {count}%</FixedNum>
        )}
      </Title>
      <Shim size={12} />

      <Dominance
        dominantTeam={UNIDominance >= 0.5 ? Team.UNI : Team.PIGI}
        percent={UNIDominance > 0.5 ? UNIDominance * 100 : (1 - UNIDominance) * 100}
      />

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
        {addressData.canFaucet ? (
          <i>You still need to grab some tokens to play. Use the Twitter faucet below to get some.</i>
        ) : (
          <i>
            Dump your <b>{team === Team.UNI ? 'PIGI' : 'UNI'}</b> tokens to help your team gain dominance.
          </i>
        )}
      </Body>

      <Shim size={32} />

      {addressData.canFaucet ? (
        <TwitterButton href={`/twitter-faucet`} stretch>
          <ButtonText>Get Tokens from Twitter</ButtonText>
        </TwitterButton>
      ) : (
        <BoostWrapper>
          <FlexNavButton
            flex={Math.round(UNIDominance * 100, 0)}
            href={`/trade?buy=${Team[Team.UNI]}`}
            color={'primary'}
            variant={team === Team.UNI ? 'contained' : 'outlined'}
          >
            <ButtonText>Buy UNI</ButtonText>
          </FlexNavButton>

          <BoostShim />

          <FlexNavButton
            flex={Math.round((1 - UNIDominance) * 100, 0)}
            href={`/trade?buy=${Team[Team.PIGI]}`}
            color={'secondary'}
            variant={team === Team.PIGI ? 'contained' : 'outlined'}
          >
            <ButtonText>Buy PIGI</ButtonText>
          </FlexNavButton>
        </BoostWrapper>
      )}

      <Shim size={36} />

      <AnimatedFrame variants={childAnimation}>
        <WalletComponent wallet={wallet} team={team} balances={balances} walletType={'rest'} />
      </AnimatedFrame>
    </AnimatedFrame>
  )
}

// TODO add PG API and deal with decimals
Home.getInitialProps = async () => {
  const random = Math.round(Math.random() * 100, 0)
  return {
    reserves: {
      [Team.UNI]: random,
      [Team.PIGI]: 100 - random
    },
    balances: {
      [Team.UNI]: 5,
      [Team.PIGI]: 5
    }
  }
}

export default Home
