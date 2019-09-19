import React, { useState, useEffect } from 'react'
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
import { useReset, useMnemonicExists, Team } from '../contexts/Cookie'
import Button from './Button'
import Emoji from './Emoji'
import QRScanModal from './QRScanModal'
import { AnimatedFrame, containerAnimationNoDelay } from './Animation'
import { WalletInfo, TokenInfo } from './MiniWallet'
import Shim from './Shim'
import Confetti from './Confetti'
import { ButtonText } from './Type'
import NavButton from './NavButton'

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

const StyledSnackbar = styled(Snackbar)``

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

const DURATION = 8
function AirdropSnackbar({
  wallet,
  scannedAddress,
  setPopConfetti,
  setScannedAddress,
  lastScannedAddress,
  updateAddressData
}) {
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
            updateAddressData()
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
      const timeout = setTimeout(() => {
        controls.start(animateTo(DURATION))

        if (success) {
          setPopConfetti(true)
        }
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [success, error, controls, setPopConfetti])

  return (
    <StyledSnackbar
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
        pathLength.set(0)
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
                  setTimeout(() => {
                    setScannedAddress()
                  }, 500)
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
    </StyledSnackbar>
  )
}

function Wallet({ wallet, team, onDismiss, addressData, balances, scannedAddress, openQRModal }) {
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

  const [mnemonicCopied, setMnemonicCopied] = useState(false)
  useEffect(() => {
    if (mnemonicCopied) {
      const timeout = setTimeout(() => {
        setMnemonicCopied(false)
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  })
  function copyMnemonic() {
    copy(wallet.mnemonic)
    setMnemonicCopied(true)
  }

  // handle redirect after reset
  const router = useRouter()
  const mnemonicExists = useMnemonicExists()
  useEffect(() => {
    // there might be a race condition here, since `mnemonicExists` might not update sychronously with the cookie...
    // ..., but i think it does, because the context is above this component in the dom tree
    if (!mnemonicExists) {
      router.push('/welcome')
    }
  }, [mnemonicExists, router])

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
            Scan another player to trigger an airdrop. You will both recieve 10 tokens from the Unipig faucet.
          </Description>
        </>
      )}

      <Shim size={24} />
      <WalletTitle>
        <span>Tokens</span>
      </WalletTitle>
      <TokenInfo balances={balances} />
      <Shim size={8} />
      <SendWrapper>
        <SendButton
          as={NavButton}
          href={`/send?token=${Team[Team.UNI]}`}
          variant="text"
          disabled={balances[Team.UNI] === 0}
        >
          Send
        </SendButton>
        <SendShim />
        <SendButton
          as={NavButton}
          href={`/send?token=${Team[Team.PIGI]}`}
          variant="text"
          disabled={balances[Team.PIGI] === 0}
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
        <SendButton variant="text" onClick={copyMnemonic}>
          {mnemonicCopied ? 'Copied' : 'Copy Mnemonic'}
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

function ViewManager({ wallet, team, onDismiss, addressData, balances, scannedAddress, setScannedAddress }) {
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
        onDismiss={onDismiss}
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

  const [popConfetti, setPopConfetti] = useState(false)

  return (
    <>
      <StyledDialogOverlay isOpen={isOpen} onDismiss={onDismiss}>
        <StyledDialogContent>
          <Confetti start={popConfetti} variant="top" />
          <AirdropSnackbar
            wallet={wallet}
            setPopConfetti={setPopConfetti}
            scannedAddress={scannedAddress}
            setScannedAddress={setScannedAddress}
            lastScannedAddress={lastScannedAddress}
            updateAddressData={updateAddressData}
          />
          <AnimatedFrame variants={containerAnimationNoDelay} initial="hidden" animate="show">
            <ViewManager
              wallet={wallet}
              team={team}
              onDismiss={onDismiss}
              addressData={addressData}
              balances={balances}
              scannedAddress={scannedAddress}
              setScannedAddress={setScannedAddress}
            />
          </AnimatedFrame>
        </StyledDialogContent>
      </StyledDialogOverlay>
    </>
  )
}
