import styled, { css } from 'styled-components'
import { transparentize } from 'polished'
import { formatFixedDecimals } from '@uniswap/sdk'

import { DECIMALS } from '../constants'
import { truncateAddress } from '../utils'
import { Team } from '../contexts/Client'
import Shim from './Shim'
import { useState, useEffect } from 'react'
import { useMotionValue, motion } from 'framer-motion'
import GradientText from './GradientText'

const StyledWallet = styled.div`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI])} !important;
  padding: 1.5rem 1.5rem 1.25rem 1.5rem;
  background: ${({ theme }) => theme.gradient};
  background-color: none;
  border-radius: 20px;
  width: 100%;
  border: 1px solid ${({ theme }) => transparentize(0.9, theme.colors.black)};

  transition: opacity 0.125s ease;
  text-decoration: none !important;
  position: relative;
  box-sizing: border-box;

  ${({ onClick }) =>
    onClick &&
    css`
      :hover {
        opacity: 1;
        border: 1px solid
          ${({ team, theme }) =>
            team === Team.UNI
              ? transparentize(0.9, theme.colors[Team.UNI])
              : transparentize(0.9, theme.colors[Team.PIGI])};
        cursor: pointer;
      }
    `}
`

const Badge = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  border-radius: 8px;
  background-image: url('static/UniMoji.gif');
  background-size: contain;
  background-color: ${({ team, theme }) =>
    team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]} !important;
`

const WalletAddress = styled.p`
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  word-break: break-all;
  margin: 0;
`

const TeamDesc = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  margin-top: 4px;
`

const Tokens = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  flex-direction: row;
`

const TokenValue = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  flex: 1 1 0;
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI])} !important;
  background-color: ${({ theme }) => transparentize(0.6, theme.colors.black)};
  border: 1px solid
    ${({ team, theme }) => transparentize(0.75, team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI])};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
`

const TokenShim = styled.span`
  width: 8px;
  height: 8px;
`

const OpenWalletLink = styled(GradientText)`
  text-decoration: none;
  color: white;
  font-weight: 500;
  font-size: 12px;
  height: 24px;
  position: absolute;
  right: 24px;
  top: 24px;
  margin-top: -4px;
  margin-bottom: 1rem;
  @media only screen and (max-width: 480px) {
    opacity: 0;
    height: 0px;
    margin: 0px;
  }
`

const AlternateTitle = styled(GradientText)`
  margin-top: -4px;
`

const StyledWalletInfo = styled.span`
  display: flex;
  flex: auto;
`

export function WalletInfo({ wallet, team }) {
  return (
    <StyledWalletInfo>
      <Badge team={team}></Badge>
      <span>
        <WalletAddress>{wallet ? truncateAddress(wallet.address, 4) : '...'}</WalletAddress>
        <TeamDesc>Team {team === Team.UNI ? 'UNI' : 'PIGI'} </TeamDesc>
      </span>
    </StyledWalletInfo>
  )
}

function StatefulBalance({ balance }) {
  const [statefulX, setStatefulX] = useState(balance)
  const x = useMotionValue(balance)
  useEffect(() => {
    const unsubscribeX = x.onChange(() => setStatefulX(Math.round(x.current)))
    return () => {
      unsubscribeX()
    }
  }, [x])

  return (
    <>
      <motion.span
        style={{ x }}
        animate={{
          x: balance
        }}
        transition={{
          duration: 1.25,
          ease: 'easeOut'
        }}
      />
      <span>{formatFixedDecimals(statefulX, DECIMALS)}</span>
    </>
  )
}

export function TokenInfo({ team, OVMBalances }) {
  return (
    <>
      <Tokens>
        <TokenValue team={team}>
          <span>{OVMBalances[team] !== undefined ? <StatefulBalance balance={OVMBalances[team]} /> : '...'}</span>
          <span>{team === Team.UNI ? 'UNI' : 'PIGI'}</span>
        </TokenValue>
        <TokenShim />
        <TokenValue team={team === Team.UNI ? Team.PIGI : Team.UNI}>
          <span>
            {OVMBalances[team] !== undefined ? (
              <StatefulBalance balance={OVMBalances[team === Team.UNI ? Team.PIGI : Team.UNI]} />
            ) : (
              '...'
            )}
          </span>
          <span>{team === Team.PIGI ? 'UNI' : 'PIGI'}</span>
        </TokenValue>
      </Tokens>
    </>
  )
}

export default function Wallet({ wallet, team, OVMBalances, onClick, alternateTitle, ...rest }) {
  return (
    <StyledWallet team={team} onClick={onClick} {...rest}>
      {!!onClick && (
        <OpenWalletLink>
          <span>Open Wallet</span>
          <span>↗</span>
        </OpenWalletLink>
      )}
      {alternateTitle ? (
        <AlternateTitle>
          <span>{alternateTitle}</span>
        </AlternateTitle>
      ) : (
        <WalletInfo wallet={wallet} team={team} />
      )}
      <Shim size={12} />
      <TokenInfo team={team} OVMBalances={OVMBalances} />
    </StyledWallet>
  )
}
