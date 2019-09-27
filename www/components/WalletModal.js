import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo'
import { Badge, Snackbar, SnackbarContent } from '@material-ui/core'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useMotionValue, useAnimation, motion } from 'framer-motion'
import copy from 'copy-to-clipboard'
import styled from 'styled-components'
import { transparentize } from 'polished'

import { getPermissionString, truncateAddress } from '../utils'
import { useStyledTheme, usePrevious } from '../hooks'
import { useReset, Team } from '../contexts/Client'
import { AnimatedFrame, containerAnimationNoDelay } from './Animation'
import Button from './Button'
import Emoji from './Emoji'
import { WalletInfo, TokenInfo } from './MiniWallet'
import Shim from './Shim'
import { ButtonText } from './Type'
import NavButton from './NavButton'

const QRScanModal = dynamic(() => import('./QRScanModal'), { ssr: false })
const Confetti = dynamic(() => import('./Confetti'), { ssr: false })

const StyledDialogOverlay = styled(DialogOverlay)`
  &[data-reach-dialog-overlay] {
  }
`

const StyledDialogContent = styled(DialogContent)`
  &[data-reach-dialog-content] {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    width: 100%;
    max-width: 448px;
    background-color: ${({ theme }) => transparentize(1, theme.colors.white)};

    @media only screen and (max-width: 448px) {
      margin: 0;
    }
  }
`

const CloseButton = styled(Button)`
  min-width: unset;
  min-height: unset;
  padding: 0.5rem;
  margin-right: -1rem;
  width: 3rem;
  height: 3rem;
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
  margin: 1rem;
`

const StyledAirdrop = styled.span`
  display: flex;
  justify-content: center;
`

const StyledBadge = styled(Badge)`
  .MuiBadge-badge {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.link};
  }
`

const SendButton = styled(Button)`
  min-height: 36px;
  background: rgba(242, 242, 242, 0.2);
  color: black;
`

const Description = styled.p`
  font-weight: 500;
  text-align: center;
`

const ScanButton = styled(Button)`
  min-height: 36px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  width: initial;
  :hover {
    background: rgba(0, 0, 0, 0.7);
  }
`

const SendWrapper = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  flex-direction: row;

  ${SendButton} {
    flex-basis: 50%;
  }
`

const SendShim = styled.span`
  width: 8px;
  height: 8px;
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilteredSnackbarContent = ({ inError, ...rest }) => <SnackbarContent {...rest} />
const StyledSnackbarContent = styled(FilteredSnackbarContent)`
  display: flex;
  flex-direction: row;
  background-color: ${({ inError, theme }) => (inError ? theme.colors.error : 'transparent')};
  ${({ theme }) => theme.gradientBackground};
  border-radius: 12px;
  width: 448px;

  @media screen and (max-width: 448) {
    width: 100%;
  }
`

const Contents = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

const ProgressSVG = styled.svg`
  height: 1.5rem;
  margin: 0.25rem;
`

const DURATION = 7
function AirdropSnackbar({
  wallet,
  updateAddressData,
  updateOVMBalances,
  scannedAddress,
  setScannedAddress,
  lastScannedAddress,
  setPopConfetti
}) {
  const [error, setError] = useState()
  const [success, setSuccess] = useState()

  useEffect(() => {
    if (scannedAddress) {
      const permissionString = getPermissionString(wallet.address)
      wallet.signMessage(permissionString).then(signature => {
        Promise.all([
          fetch('/api/airdrop', {
            method: 'POST',
            body: JSON.stringify({ address: wallet.address, signature, scannedAddress })
          }),
          new Promise(resolve => {
            setTimeout(resolve, 1000)
          })
        ])
          .then(([response]) => {
            if (!response.ok) {
              throw Error(`${response.status} Error: ${response.statusText}`)
            }

            updateOVMBalances()
            updateAddressData()
            setSuccess(true)
          })
          .catch(error => {
            console.error(error)
            setError(error)
          })
      })
    }
  }, [scannedAddress, wallet, updateOVMBalances, updateAddressData])

  function statusMessage() {
    if (!!!error && !!!success) {
      return <span>Sending transaction...</span>
    } else if (!!error) {
      return <span>Sorry, there was an error.</span>
    } else {
      return (
        <span>
          <b>Boom. Airdrop complete.</b> <br /> <Shim size={8} /> You and{' '}
          {(scannedAddress || lastScannedAddress) && truncateAddress(scannedAddress || lastScannedAddress, 4)} just got
          tokens. This transaction was completed in 150ms on OVM layer 2 <br />
          <Shim size={12} />
          <span style={{ color: 'white' }}>Learn more ↗</span>
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

      if (success) {
        setPopConfetti(true)
      }
    }
  }, [success, error, controls, setPopConfetti])

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
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
        controls.set({ pathLength: 0 })
      }}
    >
      <StyledSnackbarContent
        inError={!!error}
        message={
          <Contents>
            <Emoji style={{ marginRight: '.75rem' }} emoji="📦" label="airdrop" />
            {statusMessage()}
          </Contents>
        }
        action={
          <>
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
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                onAnimationComplete={() => {
                  setPopConfetti(false)
                  setScannedAddress()
                }}
              />
            </ProgressSVG>
            <CloseButton
              style={{ margin: '0.25rem' }}
              onClick={() => {
                controls.start(animateTo(0.5))
              }}
            >
              <ButtonText>✗</ButtonText>
            </CloseButton>
          </>
        }
      />
    </Snackbar>
  )
}

function Wallet({ wallet, team, addressData, OVMBalances, onDismiss, scannedAddress, openQRModal }) {
  const theme = useStyledTheme()

  const reset = useReset()
  const [clickedBurnOnce, setClickedBurnOnce] = useState(false)
  useEffect(() => {
    if (clickedBurnOnce) {
      const timeout = setTimeout(() => {
        setClickedBurnOnce(false)
      }, 2000)

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

  const [addressCopied, setAddressCopied] = useState(false)
  useEffect(() => {
    if (addressCopied) {
      const timeout = setTimeout(() => {
        setAddressCopied(false)
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  })
  function copyAddress() {
    copy(wallet.address)
    setAddressCopied(true)
  }

  const [accountCopied, setAccountCopied] = useState(false)
  useEffect(() => {
    if (accountCopied) {
      const timeout = setTimeout(() => {
        setAccountCopied(false)
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  })
  function copyAccount() {
    copy(
      `${window.location.href}welcome?account=${
        wallet.mnemonic ? wallet.mnemonic.replace(/ /g, '-') : wallet.privateKey
      }&team=${Team[team]}&override=${true}`
    )
    setAccountCopied(true)
  }

  return (
    <StyledWallet team={team}>
      <WalletTitle>
        <span>Wallet</span>
        <CloseButton
          onClick={() => {
            onDismiss()
          }}
        >
          <ButtonText>✗</ButtonText>
        </CloseButton>
      </WalletTitle>
      <WalletInfo team={team} wallet={wallet} />

      <QRCodeWrapper>
        <QRCode
          value={`https://unipig.exchange?referrer=${wallet.address}`}
          ecLevel="M"
          size="250"
          quietZone="10px"
          bgColor={team === Team.UNI ? theme.colors[Team.UNI] : theme.colors[Team.PIGI]}
          fgColor={theme.colors.black}
          logoImage={team === Team.UNI ? 'static/unicon.png' : 'static/pigcon.png'}
          qrStyle="squares"
        />
      </QRCodeWrapper>

      <Shim size={16} />
      {(addressData.boostsLeft || 0) !== 0 && (
        <>
          <StyledAirdrop>
            <StyledBadge badgeContent={addressData.boostsLeft}>
              <ScanButton variant="contained" disabled={!!scannedAddress} onClick={openQRModal} stretch>
                Trigger an Airdrop
                <Emoji style={{ marginLeft: '0.3rem' }} emoji="📦" label="airdrop" />
              </ScanButton>
            </StyledBadge>
          </StyledAirdrop>
          <Description>
            Scan another player to trigger an airdrop. You will both recieve tokens from the Unipig faucet.
          </Description>
        </>
      )}

      <Shim size={24} />
      <WalletTitle>
        <span>Tokens</span>
      </WalletTitle>
      <TokenInfo OVMBalances={OVMBalances} />
      <Shim size={8} />
      <SendWrapper>
        <SendButton
          as={NavButton}
          href={`/send?token=${Team[Team.UNI]}`}
          variant="text"
          disabled={OVMBalances[Team.UNI] === 0}
        >
          Send
        </SendButton>
        <SendShim />
        <SendButton
          as={NavButton}
          href={`/send?token=${Team[Team.PIGI]}`}
          variant="text"
          disabled={OVMBalances[Team.PIGI] === 0}
        >
          Send
        </SendButton>
      </SendWrapper>
      <Shim size={24} />
      <WalletTitle>
        <span>Manage Wallet</span>
      </WalletTitle>
      <SendWrapper>
        <SendButton variant="text" onClick={copyAddress}>
          {addressCopied ? 'Copied' : 'Copy Address'}
        </SendButton>
        <SendShim />
        <SendButton variant="text" onClick={copyAccount}>
          {accountCopied ? 'Copied' : 'Export Account'}
        </SendButton>
      </SendWrapper>
      <Shim size={8} />
      <SendWrapper>
        <SendButton variant="text" onClick={manageBurn}>
          {clickedBurnOnce ? 'Are you sure?' : 'Burn Account'}
        </SendButton>
        <SendShim />
        <SendButton style={{ visibility: 'hidden' }} variant="text">
          ''
        </SendButton>
      </SendWrapper>
    </StyledWallet>
  )
}

function ViewManager({ wallet, team, addressData, OVMBalances, onDismiss, scannedAddress, setScannedAddress }) {
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
        OVMBalances={OVMBalances}
        onDismiss={onDismiss}
        scannedAddress={scannedAddress}
        openQRModal={() => {
          setQRModalIsOpen(true)
        }}
      />
    </>
  )
}

export default function WalletModal({
  wallet,
  team,
  addressData,
  updateAddressData,
  OVMBalances,
  updateOVMBalances,
  isOpen,
  onDismiss
}) {
  const [scannedAddress, setScannedAddress] = useState()
  const lastScannedAddress = usePrevious(scannedAddress)

  const [popConfetti, setPopConfetti] = useState(false)

  // handle redirect after reset
  const router = useRouter()
  useEffect(() => {
    if (wallet === null) {
      router.push('/welcome')
    }
  }, [wallet, router])
  if (wallet === null) {
    return null
  }

  return (
    <>
      <StyledDialogOverlay isOpen={isOpen} onDismiss={onDismiss}>
        <StyledDialogContent>
          <Confetti start={popConfetti} variant="top" />
          <AirdropSnackbar
            wallet={wallet}
            updateAddressData={updateAddressData}
            updateOVMBalances={updateOVMBalances}
            scannedAddress={scannedAddress}
            setScannedAddress={setScannedAddress}
            lastScannedAddress={lastScannedAddress}
            setPopConfetti={setPopConfetti}
          />
          <AnimatedFrame variants={containerAnimationNoDelay} initial="hidden" animate="show">
            <ViewManager
              wallet={wallet}
              team={team}
              addressData={addressData}
              OVMBalances={OVMBalances}
              onDismiss={onDismiss}
              scannedAddress={scannedAddress}
              setScannedAddress={setScannedAddress}
            />
          </AnimatedFrame>
        </StyledDialogContent>
      </StyledDialogOverlay>
    </>
  )
}
