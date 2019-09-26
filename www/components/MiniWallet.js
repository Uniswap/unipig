import styled from 'styled-components'
import { transparentize, lighten } from 'polished'
import { formatFixedDecimals } from '@uniswap/sdk'

import { DECIMALS } from '../constants'
import { truncateAddress } from '../utils'
import { Team } from '../contexts/Client'
import Shim from './Shim'

const StyledWallet = styled.div`
  color: ${({ team, theme }) => (team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI])} !important;
  padding: 1.5rem;
  background-color: ${({ theme }) => lighten(0.05, theme.colors.black)};
  border-radius: 20px;
  width: 100%;
  opacity: 0.8;
  transition: opacity 0.125s ease;
  text-decoration: none !important;

  :hover {
    opacity: 1;
    cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  }
`

const Badge = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 1.5rem;
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
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.black)};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
`

const TokenShim = styled.span`
  width: 8px;
  height: 8px;
`

export const OpenWalletLink = styled.span`
  text-decoration: none;
  color: white;
  font-weight: 500;
  opacity: 0.6;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
  margin-bottom: 1rem;
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

export function TokenInfo({ OVMBalances }) {
  return (
    <Tokens>
      <TokenValue team={Team.UNI}>
        <span>
          {OVMBalances[Team.UNI] !== undefined ? formatFixedDecimals(OVMBalances[Team.UNI], DECIMALS) : '...'}
        </span>
        <span>UNI</span>
      </TokenValue>
      <TokenShim />
      <TokenValue team={Team.PIGI}>
        <span>
          {OVMBalances[Team.PIGI] !== undefined ? formatFixedDecimals(OVMBalances[Team.PIGI], DECIMALS) : '...'}
        </span>
        <span>PIGI</span>
      </TokenValue>
    </Tokens>
  )
}

export default function Wallet({ wallet, team, OVMBalances, onClick, ...rest }) {
  return (
    <StyledWallet team={team} onClick={onClick} {...rest}>
      {!!onClick && (
        <OpenWalletLink>
          <span>Open Wallet</span>
          <span>↗</span>
        </OpenWalletLink>
      )}
      <WalletInfo wallet={wallet} team={team} />
      <Shim size={12} />
      <TokenInfo OVMBalances={OVMBalances} />
    </StyledWallet>
  )
}
