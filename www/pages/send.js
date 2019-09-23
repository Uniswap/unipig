import { useState, useReducer, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, useAnimation } from 'framer-motion'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { BigNumber, formatFixedDecimals } from '@uniswap/sdk'

import { isAddress } from '@ethersproject/address'

import { DECIMALS, DataNeeds, OVMWalletInteractions } from '../constants'
import { Team } from '../contexts/Cookie'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Body, Desc, ButtonText, Title, Heading } from '../components/Type'
import Emoji from '../components/Emoji'
import Wallet from '../components/MiniWallet'
import { QRIcon } from '../components/NavIcons'

const QRScanModal = dynamic(() => import('../components/QRScanModal'), { ssr: false })

const DECIMALS_FACTOR = new BigNumber(10 ** DECIMALS)

const TradeWrapper = styled.span`
  width: 100%;
  height: 100%;
  display: grid;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
`
const StyledInputWrapper = styled.label`
  width: 100%;
  position: relative;
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilteredInput = ({ inputColor, error, ...rest }) => <input {...rest} />
const Input = styled(FilteredInput)`
  border: ${({ error, theme, inputColor }) =>
    error ? `1px solid ${theme.colors.error}` : `1px solid ${theme.colors[inputColor]}`};
  background: #202124;
  color: ${({ error, theme, inputColor }) => (error ? theme.colors.error : theme.colors[inputColor])};
  box-sizing: border-box;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  font-weight: 500;
  font-size: 24px;
  width: 100%;
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;

  :hover,
  :focus {
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilteredButton = ({ inputColor, ...rest }) => <Button {...rest} />
const MaxButton = styled(FilteredButton)`
  position: absolute;
  top: 16px;
  right: 80px;
  padding: 0;
  width: 56px;
  height: 24px;
  min-height: 24px;
  background: ${({ theme, inputColor }) => transparentize(0.95, theme.colors[inputColor])};
  border: ${({ error, theme, inputColor }) =>
    error ? `1px solid ${theme.colors.error}` : `1px solid ${theme.colors[inputColor]}`};
  color: ${({ error, theme, inputColor }) => (error ? theme.colors.error : theme.colors[inputColor])};
  box-sizing: border-box;
  border-radius: 20px;
`

const StyledEmoji = styled(Emoji)`
  position: absolute;
  top: 14px;
  right: 24px;
`

const ArrowDown = styled.span`
  width: 100%;
  text-align: center;
  font-size: 16px;
  padding: 1rem 0px;
`

const HelperText = styled(Desc)`
  color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.textColor)};
  width: 100%;
  max-width: 500px;
  text-align: center;
  font-size: 16px;
`

const IconButton = styled(Button)`
  position: absolute;
  top: -2px;
  right: 12px;
  padding: 0px;
`

const Loader = styled(motion.div)`
  height: 1.5rem;
  width: 1.5rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 100%;
`

const variants = {
  initial: {
    scale: 1
  },
  loading: {
    scale: [1, 1.5],
    transition: {
      yoyo: Infinity,
      duration: 1,
      ease: 'linear'
    }
  },
  finished: {
    scale: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

const RESTING = 'RESTING'
const PENDING = 'PENDING'
const SUCCESS = 'SUCCESS'

const ERROR_MESSAGE_INPUT = 'ERROR_MESSAGE_INPUT'
const ERROR_MESSAGE_RECIPIENT = 'ERROR_MESSAGE_RECIPIENT'
const INPUT_AMOUNT_RAW = 'INPUT_AMOUNT_RAW'
const INPUT_AMOUNT_PARSED = 'INPUT_AMOUNT_PARSED'
const RECIPIENT = 'RECIPIENT'
const SEND_STATE = 'SEND_STATE'

const initialSwapState = {
  [ERROR_MESSAGE_INPUT]: null,
  [ERROR_MESSAGE_RECIPIENT]: null,
  [INPUT_AMOUNT_RAW]: '',
  [INPUT_AMOUNT_PARSED]: null,
  [RECIPIENT]: '',
  [SEND_STATE]: RESTING
}

function init() {
  return initialSwapState
}

const RESET_INPUT_AMOUNT = 'RESET_INPUT_AMOUNT'
const SET_INPUT_AMOUNT = 'SET_INPUT_AMOUNT'
const SET_INPUT_AMOUNT_INVALID = 'SET_INPUT_AMOUNT_INVALID'
const SET_INSUFFICIENT_BALANCE = 'SET_INSUFFICIENT_BALANCE'
const SET_RECIPIENT = 'SET_RECIPIENT'
const SET_RECIPIENT_INVALID = 'SET_RECIPIENT_INVALID'
const SET_ERROR = 'SET_ERROR'
const SET_PENDING = 'SET_PENDING'
const SET_SUCCESS = 'SET_SUCCESS'

function reducer(state, { type, payload = {} } = {}) {
  switch (type) {
    case SET_INPUT_AMOUNT: {
      const { rawInputValue, parsedInputValue } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawInputValue,
        [INPUT_AMOUNT_PARSED]: parsedInputValue,
        [ERROR_MESSAGE_INPUT]: null
      }
    }
    case RESET_INPUT_AMOUNT: {
      const { rawInputValue } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawInputValue || '',
        [INPUT_AMOUNT_PARSED]: null,
        [ERROR_MESSAGE_INPUT]: null
      }
    }
    case SET_INPUT_AMOUNT_INVALID: {
      const { rawValue } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawValue,
        [INPUT_AMOUNT_PARSED]: null,
        [ERROR_MESSAGE_INPUT]: 'Invalid Input'
      }
    }
    case SET_INSUFFICIENT_BALANCE: {
      const { rawInputValue, parsedInputValue } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawInputValue,
        [INPUT_AMOUNT_PARSED]: parsedInputValue,
        [ERROR_MESSAGE_INPUT]: 'Insufficient Balance'
      }
    }
    case SET_RECIPIENT: {
      const { recipient } = payload

      return {
        ...state,
        [RECIPIENT]: recipient,
        [ERROR_MESSAGE_RECIPIENT]: null
      }
    }
    case SET_RECIPIENT_INVALID: {
      const { recipient } = payload

      return {
        ...state,
        [RECIPIENT]: recipient,
        [ERROR_MESSAGE_RECIPIENT]: 'Invalid Recipient'
      }
    }
    case SET_PENDING: {
      return {
        ...state,
        [SEND_STATE]: PENDING
      }
    }
    case SET_SUCCESS: {
      return {
        ...state,
        [SEND_STATE]: SUCCESS
      }
    }
    case SET_ERROR: {
      return {
        ...state,
        [SEND_STATE]: RESTING,
        [ERROR_MESSAGE_INPUT]: 'Unknown Error'
      }
    }
    default: {
      throw Error(`Unexpected action type in swapState reducer: '${type}'.`)
    }
  }
}

function Send({ wallet, team, token, balancesData, updateBalancesData, confirm }) {
  //// parse the props
  const balance = new BigNumber(balancesData[token])

  // amounts
  const [swapState, dispatchSwapState] = useReducer(reducer, undefined, init)

  function updateValues(rawValue, parsedValue) {
    if (parsedValue.gt(balance)) {
      dispatchSwapState({
        type: SET_INSUFFICIENT_BALANCE,
        payload: {
          rawInputValue: rawValue,
          parsedInputValue: parsedValue
        }
      })
      return
    }

    dispatchSwapState({
      type: SET_INPUT_AMOUNT,
      payload: {
        rawInputValue: rawValue,
        parsedInputValue: parsedValue
      }
    })
  }

  function onInputAmount(event) {
    const typedValue = event.target.value

    if (typedValue === '') {
      dispatchSwapState({ type: RESET_INPUT_AMOUNT })
      return
    }

    let parsedValue
    try {
      parsedValue = new BigNumber(typedValue).times(DECIMALS_FACTOR)
      if (parsedValue.isNaN()) {
        throw Error()
      }
    } catch {
      dispatchSwapState({
        type: SET_INPUT_AMOUNT_INVALID,
        payload: { rawValue: typedValue }
      })
      return
    }

    if (parsedValue.isZero()) {
      dispatchSwapState({ type: RESET_INPUT_AMOUNT, payload: { rawInputValue: typedValue } })
      return
    }

    updateValues(typedValue, parsedValue)
  }

  function onMaxInputValue() {
    updateValues(formatFixedDecimals(balance, DECIMALS), balance)
  }

  function onAddress(event) {
    const typedValue = event.target.value

    if (typedValue === '') {
      dispatchSwapState({
        type: SET_RECIPIENT,
        payload: { recipient: '' }
      })
      return
    }

    if (isAddress(typedValue)) {
      dispatchSwapState({
        type: SET_RECIPIENT,
        payload: { recipient: typedValue }
      })
      return
    }

    dispatchSwapState({
      type: SET_RECIPIENT_INVALID,
      payload: { recipient: typedValue }
    })
  }

  const [QRModalIsOpen, setQRModalIsOpen] = useState(false)

  const controls = useAnimation()
  const sendState = swapState[SEND_STATE]
  useEffect(() => {
    if (sendState === PENDING) {
      controls.start('loading')
    } else if (sendState === SUCCESS) {
      controls.start('finished')
    } else {
      controls.set('initial')
    }
  }, [sendState, controls])

  return (
    <>
      <QRScanModal
        isOpen={QRModalIsOpen}
        onDismiss={() => {
          setQRModalIsOpen(false)
        }}
        onAddress={address => {
          dispatchSwapState({
            type: SET_RECIPIENT,
            payload: { recipient: address }
          })
          setQRModalIsOpen(false)
        }}
      />
      <Body textStyle="gradient">
        <b>Send tokens to a friend.</b>
      </Body>
      <Shim size={12} />
      <TradeWrapper>
        <StyledInputWrapper>
          <Input
            required
            disabled={swapState[SEND_STATE] === PENDING || swapState[SEND_STATE] === SUCCESS}
            error={!!swapState[ERROR_MESSAGE_INPUT]}
            type="number"
            min="0"
            step="0.0001"
            placeholder="0"
            value={swapState[INPUT_AMOUNT_RAW]}
            onChange={onInputAmount}
            inputColor={token}
          />
          <MaxButton inputColor={token} onClick={onMaxInputValue}>
            Max
          </MaxButton>
          <StyledEmoji
            inputColor={token}
            emoji={Team[token] === 'UNI' ? '🦄' : '🐷'}
            label={Team[token] === 'UNI' ? 'unicorn' : 'pig'}
          />
        </StyledInputWrapper>
        <ArrowDown>↓</ArrowDown>
        <StyledInputWrapper>
          <Input
            required
            disabled={swapState[SEND_STATE] === PENDING || swapState[SEND_STATE] === SUCCESS}
            error={!!swapState[ERROR_MESSAGE_RECIPIENT]}
            type="text"
            value={swapState[RECIPIENT]}
            onChange={onAddress}
            placeholder="0x..."
            inputColor={token}
          />
          <IconButton
            onClick={() => {
              setQRModalIsOpen(true)
            }}
          >
            <QRIcon />
          </IconButton>
        </StyledInputWrapper>
        <HelperText
          style={{
            visibility: !!swapState[ERROR_MESSAGE_INPUT] || !!swapState[ERROR_MESSAGE_RECIPIENT] ? 'visible' : 'hidden'
          }}
          error={true}
        >
          {swapState[ERROR_MESSAGE_INPUT] || swapState[ERROR_MESSAGE_RECIPIENT] || 'placeholder'}
        </HelperText>
        <Button
          disabled={
            !!swapState[ERROR_MESSAGE_INPUT] ||
            !!swapState[ERROR_MESSAGE_RECIPIENT] ||
            !!!swapState[INPUT_AMOUNT_PARSED] ||
            !!!swapState[RECIPIENT]
          }
          variant="gradient"
          stretch
          onClick={() => {
            if (swapState[SEND_STATE] === RESTING) {
              dispatchSwapState({ type: SET_PENDING })

              Promise.all([
                fetch('/api/ovm-wallet', {
                  method: 'POST',
                  body: JSON.stringify({
                    interactionType: OVMWalletInteractions.SEND,
                    address: wallet.address,
                    recipient: swapState[RECIPIENT],
                    inputToken: token,
                    inputAmount: swapState[INPUT_AMOUNT_PARSED].toNumber()
                  })
                }),
                new Promise(resolve => {
                  setTimeout(resolve, 1000)
                })
              ])
                .then(([response]) => {
                  if (!response.ok) {
                    throw Error(`${response.status} Error: ${response.statusText}`)
                  }
                  dispatchSwapState({ type: SET_SUCCESS })
                })
                .catch(error => {
                  console.error(error)
                  dispatchSwapState({ type: SET_ERROR })
                })
            }
          }}
        >
          {swapState[SEND_STATE] === PENDING || swapState[SEND_STATE] === SUCCESS ? (
            <Loader
              variants={variants}
              animate={controls}
              initial="initial"
              onAnimationComplete={() => {
                updateBalancesData()
                setTimeout(() => {
                  confirm()
                }, 50)
              }}
            />
          ) : (
            <ButtonText>Send</ButtonText>
          )}
        </Button>
      </TradeWrapper>
      <Shim size={32} />
      <Wallet wallet={wallet} team={team} balances={balancesData} />
    </>
  )
}

function Confirmed({ wallet, team, balancesData }) {
  return (
    <TradeWrapper>
      <Body>💸</Body>
      <Shim size={1} />
      <Title textStyle="gradient">Transaction Confirmed.</Title>
      <Shim size={12} />
      <Body color={'white'}>
        <i>Yes. It was that fast.</i>
      </Body>
      <Heading>
        150ms. No gas. <br />
        Still decentralized.
      </Heading>
      <Shim size={2} />
      <NavButton variant="gradient" href="/">
        <ButtonText>Dope</ButtonText>
      </NavButton>
      <Shim size={32} />
      <Wallet wallet={wallet} team={team} balances={balancesData} />
    </TradeWrapper>
  )
}

function Manager({ wallet, team, balancesData, updateBalancesData, token }) {
  const [showConfirm, setShowConfirm] = useState(false)
  function confirm() {
    setShowConfirm(true)
  }

  return !showConfirm ? (
    <Send
      wallet={wallet}
      team={team}
      token={token}
      balancesData={balancesData}
      updateBalancesData={updateBalancesData}
      confirm={confirm}
    />
  ) : (
    <Confirmed wallet={wallet} team={team} balancesData={balancesData} />
  )
}

Manager.getInitialProps = async context => {
  const { query, res } = context
  const { token: _token } = query

  const token = _token ? (Team[_token] === Team.UNI || Team[_token] === Team.PIGI ? Team[_token] : null) : null

  if (!token) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return {}
  }

  return {
    dataNeeds: {
      [DataNeeds.BALANCES]: true
    },
    token
  }
}

export default Manager
