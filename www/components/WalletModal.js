import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo'
import { Badge, Snackbar, SnackbarContent } from '@material-ui/core'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useMotionValue, useAnimation, motion } from 'framer-motion'
import copy from 'copy-to-clipboard'
import styled from 'styled-components'
import { transparentize } from 'polished'

import { useReset, useMnemonicExists, Team } from '../contexts/Cookie'
import { getPermissionString, truncateAddress } from '../utils'
import { useStyledTheme, usePrevious } from '../hooks'
import Button from './Button'
import Emoji from './Emoji'
import QRScanModal from './QRScanModal'
import { AnimatedFrame, containerAnimationNoDelay } from './Animation'
import { WalletInfo, TokenInfo } from './MiniWallet'
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilteredSnackbarContent = ({ inError, ...rest }) => <SnackbarContent {...rest} />
const StyledSnackbarContent = styled(FilteredSnackbarContent)`
  background-color: ${({ inError, theme }) => inError && theme.colors.error};
`

const Contents = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProgressSVG = styled.svg`
  height: 1.5rem;
  margin: 0.25rem;
`

const DURATION = 6
function AirdropSnackbar({ wallet, scannedAddress, setScannedAddress, lastScannedAddress, updateAddressData }) {
  const [error, setError] = useState()
  const [success, setSuccess] = useState()

  useEffect(() => {
    if (scannedAddress) {
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
            await updateAddressData()
          })
          .catch(error => {
            console.error(error)
            setError(error)
          })
      })
    }
  }, [scannedAddress, wallet, updateAddressData])

  function statusMessage() {
    if (!!!error && !!!success) {
      return <span>Loading...</span>
    } else if (!!error) {
      return <span>Sorry, there was an error.</span>
    } else {
      return (
        <span>
          Nice! You and{' '}
          {(scannedAddress || lastScannedAddress) && truncateAddress(scannedAddress || lastScannedAddress, 4)} just got
          tokens.
        </span>
      )
    }
  }

  const pathLength = useMotionValue(0)
  const controls = useAnimation()
  const animateTo = duration => ({
    pathLength: 1,
    transition: { type: 'tween', duration, ease: 'linear' }
  })
  const [isFinished, setIsFinished] = useState(false)
  useEffect(() => {
    if (success || error) {
      controls.start(animateTo(DURATION))
    }
  }, [success, error, controls])

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={!!scannedAddress}
      autoHideDuration={null}
      onClose={() => {}}
      onMouseEnter={() => {
        if (pathLength.isAnimating()) {
          controls.stop()
        }
      }}
      onMouseLeave={() => {
        if (pathLength.get() !== 0 && !pathLength.isAnimating() && !isFinished) {
          controls.start(animateTo(DURATION * (1 - pathLength.get())))
        }
      }}
      onExited={() => {
        setError()
        setSuccess()
        setIsFinished(false)
        pathLength.set(0)
      }}
    >
      <StyledSnackbarContent
        inError={!!error}
        message={
          <Contents>
            <Emoji style={{ marginRight: '0.3rem' }} emoji="📦" label="airdrop" />
            {statusMessage()}
          </Contents>
        }
        action={
          <ProgressSVG viewBox="0 0 50 50">
            <motion.path
              fill="none"
              strokeWidth="4"
              stroke="white"
              strokeDasharray="0 1"
              d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
              initial={false}
              style={{
                pathLength,
                rotate: 90,
                translateX: 5,
                translateY: 5,
                scaleX: -1 // Reverse direction of line animation
              }}
              animate={controls}
              onAnimationComplete={() => {
                setIsFinished(true)
              }}
            />
            <motion.path
              fill="none"
              strokeWidth="3"
              stroke="white"
              d="M14,26 L 22,33 L 35,16"
              initial={false}
              strokeDasharray="0 1"
              animate={{ pathLength: isFinished ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              onAnimationComplete={() => {
                setScannedAddress()
              }}
            />
          </ProgressSVG>
        }
      />
    </Snackbar>
  )
}

function Wallet({ wallet, team, addressData, balances, scannedAddress, openQRModal }) {
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
            logoImage={team === Team.UNI ? 'static/unicorn.png' : 'static/pig.png'}
            qrStyle="squares"
          />
        </QRCodeWrapper>

        <Shim size={8} />
        <StyledBadge badgeContent={addressData.boostsLeft || 0}>
          <ScanButton
            variant="contained"
            disabled={!!scannedAddress || (addressData.boostsLeft || 0) === 0}
            onClick={openQRModal}
            stretch
          >
            Trigger an Airdrop
            <Emoji style={{ marginLeft: '0.3rem' }} emoji="📦" label="airdrop" />
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

function ViewManager({ wallet, team, addressData, balances, scannedAddress, setScannedAddress }) {
  const [QRModalIsOpen, setQRModalIsOpen] = useState(false)

  return (
    <>
      <QRScanModal
        isOpen={QRModalIsOpen}
        onDismiss={() => {
          setQRModalIsOpen(false)
        }}
        onAddress={address => {
          setScannedAddress(address)
          setQRModalIsOpen(false)
        }}
      />

      <Wallet
        wallet={wallet}
        team={team}
        addressData={addressData}
        balances={balances}
        scannedAddress={scannedAddress}
        openQRModal={() => {
          setQRModalIsOpen(true)
        }}
      />
    </>
  )
}

export default function WalletModal({ wallet, team, addressData, updateAddressData, balances, isOpen, onDismiss }) {
  const [scannedAddress, setScannedAddress] = useState()
  const lastScannedAddress = usePrevious(scannedAddress)

  return (
    <>
      <AirdropSnackbar
        wallet={wallet}
        scannedAddress={scannedAddress}
        setScannedAddress={setScannedAddress}
        lastScannedAddress={lastScannedAddress}
        updateAddressData={updateAddressData}
      />
      <StyledDialogOverlay isOpen={isOpen} onDismiss={onDismiss}>
        <StyledDialogContent>
          <ViewManager
            wallet={wallet}
            team={team}
            addressData={addressData}
            balances={balances}
            scannedAddress={scannedAddress}
            setScannedAddress={setScannedAddress}
          />
        </StyledDialogContent>
      </StyledDialogOverlay>
    </>
  )
}
