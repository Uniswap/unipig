import { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { BigNumber, formatFixedDecimals } from '@uniswap/sdk'
import { isAddress } from '@ethersproject/address'

import { DECIMALS } from '../constants'
import { useDynamicCallback } from '../hooks'
import { Team } from '../contexts/Client'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Body, Desc, ButtonText, Title, Heading } from '../components/Type'
import Emoji from '../components/Emoji'
import Wallet from '../components/MiniWallet'
import { QRIcon } from '../components/NavIcons'
import { AnimatedFrame, containerAnimation, containerAnimationDown } from '../components/Animation'

const QRScanModal = dynamic(() => import('../components/QRScanModal'), { ssr: false })

const DECIMALS_FACTOR = new BigNumber(10 ** DECIMALS)

const TradeWrapper = styled.span`
  width: 100%;
  height: auto;
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
  top: 0px;
  right: -4px;
  padding: 0px;
`

const StyledTitle = styled(Title)`
  font-size: 2.5rem;
`

const RESTING = 'RESTING'
const PENDING = 'PENDING'
const SUCCESS = 'SUCCESS'

const ERROR_MESSAGE_GENERAL = 'ERROR_MESSAGE_GENERAL'
const ERROR_MESSAGE_INPUT = 'ERROR_MESSAGE_INPUT'
const ERROR_MESSAGE_RECIPIENT = 'ERROR_MESSAGE_RECIPIENT'
const INPUT_AMOUNT_RAW = 'INPUT_AMOUNT_RAW'
const INPUT_AMOUNT_PARSED = 'INPUT_AMOUNT_PARSED'
const RECIPIENT = 'RECIPIENT'
const SEND_STATE = 'SEND_STATE'

const initialSwapState = {
  [ERROR_MESSAGE_GENERAL]: null,
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
        [ERROR_MESSAGE_INPUT]: null,
        [ERROR_MESSAGE_GENERAL]: null
      }
    }
    case RESET_INPUT_AMOUNT: {
      const { rawInputValue } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawInputValue || '',
        [INPUT_AMOUNT_PARSED]: null,
        [ERROR_MESSAGE_INPUT]: null,
        [ERROR_MESSAGE_GENERAL]: null
      }
    }
    case SET_INPUT_AMOUNT_INVALID: {
      const { rawValue, errorMessage } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawValue,
        [INPUT_AMOUNT_PARSED]: null,
        [ERROR_MESSAGE_INPUT]: errorMessage || 'Invalid Input'
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
        [ERROR_MESSAGE_RECIPIENT]: null,
        [ERROR_MESSAGE_GENERAL]: null
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
        [ERROR_MESSAGE_GENERAL]: 'Unknown Error'
      }
    }
    default: {
      throw Error(`Unexpected action type in swapState reducer: '${type}'.`)
    }
  }
}

function Send({ OVMBalances, updateOVMBalances, OVMSend, token, confirm, setTradeTime }) {
  //// parse the props
  const _balance = OVMBalances[token]
  const balance = useMemo(() => (_balance !== undefined ? new BigNumber(_balance) : null), [_balance])

  // amounts
  const [swapState, dispatchSwapState] = useReducer(reducer, undefined, init)

  const updateValues = useDynamicCallback((_rawValue, _parsedValue) => {
    const rawValue = _rawValue || swapState[INPUT_AMOUNT_RAW]
    const parsedValue = _parsedValue || swapState[INPUT_AMOUNT_PARSED]

    if (!rawValue || !parsedValue) {
      return
    }

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
  })

  useEffect(() => {
    updateValues()
  }, [updateValues])

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

    if (!parsedValue.minus(parsedValue.integerValue()).isZero()) {
      dispatchSwapState({
        type: SET_INPUT_AMOUNT_INVALID,
        payload: { rawValue: typedValue, errorMessage: 'Please specify fewer decimal places' }
      })
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

  const sendState = swapState[SEND_STATE]
  useEffect(() => {
    if (sendState === SUCCESS) {
      confirm()
      updateOVMBalances()
    }
  }, [sendState, confirm, updateOVMBalances])

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
      <AnimatedFrame variants={containerAnimation} initial="hidden" animate="show">
        <TradeWrapper>
          <Body textStyle="gradient">
            <b>Send tokens to a friend.</b>
          </Body>
          <Shim size={20} />
          <StyledInputWrapper>
            <Input
              required
              disabled={!balance || swapState[SEND_STATE] === PENDING || swapState[SEND_STATE] === SUCCESS}
              error={!!swapState[ERROR_MESSAGE_INPUT]}
              type="number"
              min="0"
              step="0.0001"
              placeholder="0"
              value={swapState[INPUT_AMOUNT_RAW]}
              onChange={onInputAmount}
              inputColor={token}
            />
            <MaxButton disabled={!balance} inputColor={token} onClick={onMaxInputValue}>
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
              visibility:
                !!swapState[ERROR_MESSAGE_INPUT] ||
                !!swapState[ERROR_MESSAGE_RECIPIENT] ||
                !!swapState[ERROR_MESSAGE_GENERAL]
                  ? 'visible'
                  : 'hidden'
            }}
            error={true}
          >
            {swapState[ERROR_MESSAGE_INPUT] ||
              swapState[ERROR_MESSAGE_RECIPIENT] ||
              swapState[ERROR_MESSAGE_GENERAL] ||
              'placeholder'}
          </HelperText>
          <Button
            disabled={
              !!swapState[ERROR_MESSAGE_INPUT] ||
              !!swapState[ERROR_MESSAGE_RECIPIENT] ||
              !!swapState[ERROR_MESSAGE_GENERAL] ||
              !!!swapState[INPUT_AMOUNT_PARSED] ||
              !!!swapState[RECIPIENT] ||
              swapState[SEND_STATE] !== RESTING
            }
            variant="gradient"
            stretch
            onClick={() => {
              dispatchSwapState({ type: SET_PENDING })

              const now = Date.now()

              Promise.all([
                OVMSend(swapState[RECIPIENT], token, swapState[INPUT_AMOUNT_PARSED]).then(() => {
                  setTradeTime(Date.now() - now)
                }),
                new Promise(resolve => {
                  setTimeout(resolve, 750)
                })
              ])
                .then(() => {
                  dispatchSwapState({ type: SET_SUCCESS })
                })
                .catch(error => {
                  console.error(error)
                  dispatchSwapState({ type: SET_ERROR })
                })
            }}
          >
            {swapState[SEND_STATE] === PENDING || swapState[SEND_STATE] === SUCCESS ? (
              <ButtonText>Sending...</ButtonText>
            ) : (
              <ButtonText>Send</ButtonText>
            )}
          </Button>
        </TradeWrapper>
      </AnimatedFrame>
    </>
  )
}

function Confirmed({ tradeTime }) {
  return (
    <AnimatedFrame variants={containerAnimationDown} initial="hidden" animate="show">
      <TradeWrapper>
        <Body>💸</Body>
        <Shim size={1} />
        <StyledTitle textStyle="gradient">Transaction Confirmed.</StyledTitle>
        <Shim size={12} />
        <Body color={'white'}>
          <i>Yes. It was that fast.</i>
        </Body>
        <Heading>
          {tradeTime}ms. No gas. <br />
          Still decentralized.
        </Heading>
        <Shim size={2} />
        <NavButton variant="gradient" href="/">
          <ButtonText>Dope</ButtonText>
        </NavButton>
      </TradeWrapper>
    </AnimatedFrame>
  )
}

function Manager({ wallet, team, OVMBalances, updateOVMBalances, OVMSend, token }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const confirm = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const [tradeTime, setTradeTime] = useState()

  return (
    <>
      {!showConfirm ? (
        <Send
          wallet={wallet}
          team={team}
          OVMBalances={OVMBalances}
          updateOVMBalances={updateOVMBalances}
          OVMSend={OVMSend}
          token={token}
          confirm={confirm}
          setTradeTime={setTradeTime}
        />
      ) : (
        <Confirmed tradeTime={tradeTime} />
      )}
      <Shim size={32} />
      <Wallet wallet={wallet} team={team} OVMBalances={OVMBalances} alternateTitle="Token Balances" />
    </>
  )
}

Manager.getInitialProps = async context => {
  const { query, res } = context

  const parsedTeam = Team[query.token]
  const token = [Team.UNI, Team.PIGI].includes(parsedTeam) ? parsedTeam : null

  if (!token) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return {}
  }

  return {
    token
  }
}

export default Manager
