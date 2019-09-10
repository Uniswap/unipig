import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { QRCode } from 'react-qrcode-logo'
import dynamic from 'next/dynamic'

import { useStyledTheme } from '../hooks'
import { Team, useWallet, useTeam, useReset } from '../contexts/Cookie'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { TokenInfo, WalletInfo } from '../components/MiniWallet'

//WORK IN PROGRESS

const QRReader = dynamic({
  loader: () => import('../components/QRReader'),
  ssr: false
})

const StyledWallet = styled.span`
  background-color: ${({ team, theme }) =>
    team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIG]} !important;
  padding: 1.5rem;
  color: ${({ theme }) => transparentize(0.2, theme.colors.black)};
  border-radius: 20px;
  width: 100%;
`

const QRCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
`

const WalletTitle = styled.span`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};
  font-weight: 600;
  opacity: 0.6;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
  margin-bottom: 1rem;
`

const WalletButton = styled(Button)`
  min-height: 36px;
  width: initial;
  margin: 0 auto;
  background: rgba(242, 242, 242, 0.2);
  color: black;
`

const SendButton = styled(Button)`
  min-height: 36px;
  background: rgba(242, 242, 242, 0.2);
  color: black;
`

const SendWrapper = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  flex-direction: row;
`

const SendShim = styled.span`
  width: 8px;
  height: 8px;
`

function Overview({ balances }) {
  const team = useTeam()
  const wallet = useWallet()
  const reset = useReset()
  const [resetPressed, setResetPressed] = useState(false)

  const theme = useStyledTheme()

  const router = useRouter()
  function onReset() {
    setResetPressed(true)
    reset()
  }

  // handle redirect after reset
  useEffect(() => {
    if (!wallet) {
      router.push('/welcome')
    }
  }, [wallet, router])

  if (!wallet) {
    return null
  }

  return (
    <StyledWallet team={team}>
      <WalletTitle>
        <span>Wallet</span>
      </WalletTitle>
      <WalletInfo team={team} wallet={wallet} />

      <QRCodeWrapper>
        <QRCode
          value={`https://unipig.exchange?referrer=${wallet.address}`}
          ecLevel="M"
          size="250"
          quietZone="0"
          bgColor={team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIG]}
          fgColor={theme.colors.black}
          logoImage={'static/blob_2.svg'}
          qrStyle="squares"
        />
      </QRCodeWrapper>

      <WalletButton variant="text">Copy Address</WalletButton>
      <NavButton variant="text" href="/wallet?scan=true">
        Scan
      </NavButton>
      <Shim size={24} />
      <WalletTitle>
        <span>Tokens</span>
      </WalletTitle>
      <TokenInfo balances={balances} />
      <Shim size={8} />
      <SendWrapper>
        <SendButton variant="text">Send</SendButton>
        <SendShim />
        <SendButton variant="text">Send</SendButton>
      </SendWrapper>
      <Shim size={24} />
      <WalletButton disabled={resetPressed} variant="text" onClick={onReset}>
        Discard Account
      </WalletButton>
    </StyledWallet>
  )
}

function Scan() {
  return <QRReader />
}

function Manager({ balances }) {
  const router = useRouter()
  const { scan } = router.query || {}

  return !scan ? <Overview balances={balances} /> : <Scan />
}

Manager.getInitialProps = async () => {
  return {
    balances: {
      [Team.UNI]: 100000,
      [Team.PIG]: 100000
    }
  }
}

export default Manager
