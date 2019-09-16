import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { DialogOverlay, DialogContent } from '@reach/dialog'

import Button from './Button'
import { getPermissionString } from '../utils'
import NavButton from './NavButton'
import { ButtonText } from './Type'
import QRScanModal from './QRScanModal'
import { AnimatedFrame, containerAnimationNoDelay } from './Animation'
import { useStyledTheme } from '../hooks'
import { useReset, useMnemonicExists, Team } from '../contexts/Cookie'
import copy from 'copy-to-clipboard'
import { WalletInfo, TokenInfo } from './MiniWallet'
import { transparentize } from 'polished'
import { QRCode } from 'react-qrcode-logo'
import { Badge } from '@material-ui/core'
import Shim from './Shim'

const StyledDialogOverlay = styled(DialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const StyledDialogContent = styled(DialogContent)`
  &[data-reach-dialog-content] {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${({ theme }) => transparentize(1, theme.colors.white)};
  }
`

const StyledWallet = styled.span`
  background-color: ${({ team, theme }) =>
    team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]} !important;
  padding: 1.5rem;
  color: ${({ theme }) => transparentize(0.2, theme.colors.black)};
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const WalletTitle = styled.span`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};
  font-weight: 600;
  opacity: 1;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
  margin-bottom: 1rem;
`

const QRCodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
`

const WalletButton = styled(Button)`
  min-height: 36px;
  width: initial;
  margin: 0 auto;
  padding: 0 1rem;
  background: rgba(242, 242, 242, 0.2);
  color: black;
`

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
  }
`

const SendButton = styled(Button)`
  min-height: 36px;
  background: rgba(242, 242, 242, 0.2);
  color: black;
`

const ScanButton = styled(Button)`
  min-height: 36px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
`

const SendWrapper = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  flex-direction: row;

  ${SendButton} {
    flex-grow: 1;
  }
`

const SendShim = styled.span`
  width: 8px;
  height: 8px;
`

function Wallet({ wallet, team, addressData, balances, openQRModal }) {
  const theme = useStyledTheme()

  const reset = useReset()
  const [clickedBurnOnce, setClickedBurnOnce] = useState(false)
  useEffect(() => {
    if (clickedBurnOnce) {
      const timeout = setTimeout(() => {
        setClickedBurnOnce(false)
      }, 2500)

      return () => {
        clearTimeout(timeout)
      }
    }
  })
  function manageBurn() {
    if (!clickedBurnOnce) {
      setClickedBurnOnce(true)
    } else {
      reset()
    }
  }

  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  })
  function copyAddress() {
    copy(wallet.address)
    setCopied(true)
  }

  // handle redirect after reset
  const router = useRouter()
  const mnemonicExists = useMnemonicExists()
  useEffect(() => {
    if (!mnemonicExists) {
      router.push('/welcome')
    }
  }, [mnemonicExists, router])

  if (!mnemonicExists) {
    return null
  }

  return (
    <AnimatedFrame variants={containerAnimationNoDelay} initial="hidden" animate="show">
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
            bgColor={team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}
            fgColor={theme.colors.black}
            logoImage={'static/blob_2.svg'}
            qrStyle="squares"
          />
        </QRCodeWrapper>

        <Shim size={8} />
        <StyledBadge badgeContent={addressData.boostsLeft || '0'}>
          <ScanButton variant="contained" disabled={addressData.boostsLeft === 0} onClick={openQRModal} stretch>
            Trigger an Airdrop 📦
          </ScanButton>
        </StyledBadge>

        <Shim size={12} />

        <WalletButton variant="text" onClick={copyAddress}>
          {copied ? 'Copied' : 'Copy Address'}
        </WalletButton>
        <Shim size={24} />
        <WalletTitle>
          <span>Tokens</span>
        </WalletTitle>
        <TokenInfo balances={balances} />
        <Shim size={8} />
        <SendWrapper>
          <SendButton variant="text" disabled>
            Send
          </SendButton>
          <SendShim />
          <SendButton variant="text" disabled>
            Send
          </SendButton>
        </SendWrapper>
        <Shim size={24} />
        <WalletButton variant="text" onClick={manageBurn}>
          {clickedBurnOnce ? 'Are you sure?' : 'Burn Account'}
        </WalletButton>
      </StyledWallet>
    </AnimatedFrame>
  )
}

function Airdrop({ wallet, scannedAddress }) {
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const permission = getPermissionString(wallet.address)
    wallet.signMessage(permission.permissionString).then(signature => {
      fetch('/api/airdrop', {
        method: 'POST',
        body: JSON.stringify({ address: wallet.address, time: permission.time, signature, scannedAddress })
      })
        .then(async response => {
          if (!response.ok) {
            throw Error(`${response.status} Error: ${response.statusText}`)
          }

          setSuccess(true)
        })
        .catch(error => {
          console.error(error)
          setError(error)
        })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {error && <p>Uh-oh, an error occurred.</p>}

      {success && <p>woo! you airdropped to yourself and {scannedAddress}</p>}

      <NavButton href="/" variant="gradient" stretch>
        <ButtonText>{!error && !success ? 'Loading...' : error ? 'Bummer.' : 'Dope.'}</ButtonText>
      </NavButton>
    </>
  )
}

function ViewManager({ wallet, team, addressData, balances }) {
  const [QRModalIsOpen, setQRModalIsOpen] = useState(false)
  const [scannedAddress, setScannedAddress] = useState()

  if (scannedAddress) {
    return <Airdrop wallet={wallet} scannedAddress={scannedAddress} />
  } else {
    return (
      <>
        <QRScanModal
          isOpen={QRModalIsOpen}
          onDismiss={() => {
            setQRModalIsOpen(false)
          }}
          onAddress={address => {
            setScannedAddress(address)
          }}
        />

        <Wallet
          wallet={wallet}
          team={team}
          addressData={addressData}
          balances={balances}
          openQRModal={() => {
            setQRModalIsOpen(true)
          }}
        />
      </>
    )
  }
}

export default function WalletModal({ wallet, team, addressData, balances, isOpen, onDismiss }) {
  return (
    <StyledDialogOverlay isOpen={isOpen} onDismiss={onDismiss}>
      <StyledDialogContent>
        <ViewManager wallet={wallet} team={team} addressData={addressData} balances={balances} />
      </StyledDialogContent>
    </StyledDialogOverlay>
  )
}
