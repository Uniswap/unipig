import { useState, useReducer, useEffect } from 'react'
import { useAnimation, motion } from 'framer-motion'
import styled from 'styled-components'
import { transparentize } from 'polished'
import {
  TRADE_EXACT,
  BigNumber,
  getMarketDetails,
  getTradeDetails,
  formatSignificant,
  formatFixedDecimals
} from '@uniswap/sdk'

import { DECIMALS, DataNeeds, OVMWalletInteractions } from '../constants'
import { Team } from '../contexts/Cookie'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Body, Desc, ButtonText, Title, Heading } from '../components/Type'
import Emoji from '../components/Emoji'
import Wallet from '../components/MiniWallet'

const DECIMALS_FACTOR = new BigNumber(10 ** DECIMALS)
const DUMMY_ETH_FACTOR = new BigNumber(10 ** (18 - DECIMALS))

const DUMMY_TOKEN = {
  decimals: DECIMALS
}

const DUMMY_ETH = {
  decimals: 18
}

const DUMMY_TOKEN_AMOUNT = amount => ({
  token: DUMMY_TOKEN,
  amount
})

const DUMMY_ETH_AMOUNT = amount => ({
  token: DUMMY_ETH,
  amount: amount
})

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

const PriceImpactText = styled(Desc)`
  color: ${({ theme }) => transparentize(0.5, theme.colors.textColor)};
  width: 100%;
  max-width: 500px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 0;
`

const Percentage = styled.span`
  color: ${({ theme }) => theme.colors.success};
  font-size: 16px;
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

const ERROR_MESSAGE = 'ERROR_MESSAGE'
const INPUT_AMOUNT_RAW = 'INPUT_AMOUNT_RAW'
const INPUT_AMOUNT_PARSED = 'INPUT_AMOUNT_PARSED'
const OUTPUT_AMOUNT_RAW = 'OUTPUT_AMOUNT_RAW'
const OUTPUT_AMOUNT_PARSED = 'OUTPUT_AMOUNT_PARSED'
const MARKET_RATE_PRE_INVERTED = 'MARKET_RATE_PRE_INVERTED'
const EXECUTION_RATE_INVERTED = 'EXECUTION_RATE_INVERTED'
const MARKET_RATE_PRICE_IMPACT = 'MARKET_RATE_PRICE_IMPACT'
const SWAP_STATE = 'SWAP_STATE'

const initialSwapState = {
  [ERROR_MESSAGE]: null,
  [INPUT_AMOUNT_RAW]: '',
  [INPUT_AMOUNT_PARSED]: null,
  [OUTPUT_AMOUNT_RAW]: '',
  [OUTPUT_AMOUNT_PARSED]: null,
  [EXECUTION_RATE_INVERTED]: null,
  [MARKET_RATE_PRICE_IMPACT]: null,
  [SWAP_STATE]: RESTING
}

function init(marketRatePreInverted) {
  return {
    ...initialSwapState,
    [MARKET_RATE_PRE_INVERTED]: marketRatePreInverted
  }
}

const SET_INPUT_AMOUNT = 'SET_INPUT_AMOUNT'
const SET_INPUT_AMOUNT_INVALID = 'SET_INPUT_AMOUNT_INVALID'
const SET_INSUFFICIENT_BALANCE = 'SET_INSUFFICIENT_BALANCE'
const SET_ERROR = 'SET_ERROR'
const RESET_INPUT_AMOUNT = 'RESET_INPUT_AMOUNT'
const SET_PENDING = 'SET_PENDING'
const SET_SUCCESS = 'SET_SUCCESS'

function reducer(state, { type, payload = {} } = {}) {
  switch (type) {
    case SET_INPUT_AMOUNT: {
      const {
        rawInputValue,
        parsedInputValue,
        rawOutputValue,
        parsedOutputValue,
        executionRateInverted,
        marketRatePriceImpact
      } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawInputValue,
        [INPUT_AMOUNT_PARSED]: parsedInputValue,
        [OUTPUT_AMOUNT_RAW]: rawOutputValue,
        [OUTPUT_AMOUNT_PARSED]: parsedOutputValue,
        [EXECUTION_RATE_INVERTED]: executionRateInverted,
        [MARKET_RATE_PRICE_IMPACT]: marketRatePriceImpact,
        [ERROR_MESSAGE]: null
      }
    }
    case SET_INPUT_AMOUNT_INVALID: {
      const { rawValue } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawValue,
        [INPUT_AMOUNT_PARSED]: null,
        [OUTPUT_AMOUNT_RAW]: null,
        [OUTPUT_AMOUNT_PARSED]: null,
        [EXECUTION_RATE_INVERTED]: null,
        [MARKET_RATE_PRICE_IMPACT]: null,
        [ERROR_MESSAGE]: 'Invalid Input'
      }
    }
    case SET_INSUFFICIENT_BALANCE: {
      const { rawInputValue, parsedInputValue, rawOutputValue, parsedOutputValue, executionRateInverted } = payload

      return {
        ...state,
        [INPUT_AMOUNT_RAW]: rawInputValue,
        [INPUT_AMOUNT_PARSED]: parsedInputValue,
        [OUTPUT_AMOUNT_RAW]: rawOutputValue,
        [OUTPUT_AMOUNT_PARSED]: parsedOutputValue,
        [EXECUTION_RATE_INVERTED]: executionRateInverted,
        [MARKET_RATE_PRICE_IMPACT]: null,
        [ERROR_MESSAGE]: 'Insufficient Balance'
      }
    }
    case SET_ERROR: {
      return {
        ...state,
        [ERROR_MESSAGE]: 'Unknown Error'
      }
    }
    case SET_PENDING: {
      return {
        ...state,
        [SWAP_STATE]: PENDING
      }
    }
    case SET_SUCCESS: {
      return {
        ...state,
        [SWAP_STATE]: SUCCESS
      }
    }
    case RESET_INPUT_AMOUNT: {
      const { rawInputValue } = payload

      return {
        ...initialSwapState,
        [INPUT_AMOUNT_RAW]: rawInputValue || '',
        [MARKET_RATE_PRE_INVERTED]: state[MARKET_RATE_PRE_INVERTED]
      }
    }
    default: {
      throw Error(`Unexpected action type in swapState reducer: '${type}'.`)
    }
  }
}

function Buy({ wallet, team, reservesData, balancesData, updateBalancesData, inputToken, outputToken, confirm }) {
  //// parse the props
  const inputBalance = new BigNumber(balancesData[inputToken])
  const inputReserve = new BigNumber(reservesData[inputToken])
  const outputReserve = new BigNumber(reservesData[outputToken])
  // fake it by pretending the input currency is ETH
  const marketDetails = getMarketDetails(undefined, {
    token: DUMMY_TOKEN,
    ethReserve: DUMMY_ETH_AMOUNT(inputReserve.times(DUMMY_ETH_FACTOR)),
    tokenReserve: DUMMY_TOKEN_AMOUNT(outputReserve)
  })

  // amounts
  const [swapState, dispatchSwapState] = useReducer(reducer, marketDetails.marketRate.rateInverted, init)

  function updateValues(rawValue, parsedValue) {
    let tradeDetails
    try {
      tradeDetails = getTradeDetails(TRADE_EXACT.INPUT, parsedValue.times(DUMMY_ETH_FACTOR), marketDetails)
      if (tradeDetails.outputAmount.amount.isZero()) {
        throw Error()
      }
    } catch (error) {
      console.error(error)
      dispatchSwapState({ type: SET_INPUT_AMOUNT_INVALID, payload: { rawValue, errorMessage: 'Invalid Trade' } })
      return
    }

    const outputAmount = tradeDetails.outputAmount.amount
    const formattedOutputAmount = formatFixedDecimals(outputAmount, DECIMALS)

    if (parsedValue.gt(inputBalance)) {
      dispatchSwapState({
        type: SET_INSUFFICIENT_BALANCE,
        payload: {
          rawInputValue: rawValue,
          parsedInputValue: parsedValue,
          rawOutputValue: formattedOutputAmount,
          parsedOutputValue: outputAmount,
          executionRateInverted: tradeDetails.executionRate.rateInverted
        }
      })
      return
    }

    const marketRatePriceImpact = tradeDetails.marketDetailsPost.marketRate.rateInverted
      .minus(tradeDetails.marketDetailsPre.marketRate.rateInverted)
      .dividedBy(tradeDetails.marketDetailsPre.marketRate.rateInverted)
      .multipliedBy(100)

    dispatchSwapState({
      type: SET_INPUT_AMOUNT,
      payload: {
        rawInputValue: rawValue,
        parsedInputValue: parsedValue,
        rawOutputValue: formattedOutputAmount,
        parsedOutputValue: outputAmount,
        executionRateInverted: tradeDetails.executionRate.rateInverted,
        marketRatePriceImpact
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
    updateValues(formatFixedDecimals(inputBalance, DECIMALS), inputBalance)
  }

  const controls = useAnimation()
  const sendState = swapState[SWAP_STATE]
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
      <Body textStyle="gradient">
        <b>
          Boost {Team[outputToken]} by dumping {Team[inputToken]}.
        </b>
      </Body>
      <Shim size={12} />
      <TradeWrapper>
        <StyledInputWrapper>
          <Input
            required
            disabled={swapState[SWAP_STATE] === PENDING || swapState[SWAP_STATE] === SUCCESS}
            error={!!swapState[ERROR_MESSAGE]}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={swapState[INPUT_AMOUNT_RAW]}
            onChange={onInputAmount}
            inputColor={inputToken}
          />
          <MaxButton inputColor={inputToken} onClick={onMaxInputValue}>
            Max
          </MaxButton>
          <StyledEmoji
            inputColor={inputToken}
            emoji={Team[inputToken] === 'UNI' ? '🦄' : '🐷'}
            label={Team[inputToken] === 'UNI' ? 'unicorn' : 'pig'}
          />
        </StyledInputWrapper>
        <ArrowDown>↓</ArrowDown>
        <StyledInputWrapper>
          <Input
            disabled={true}
            error={!!swapState[ERROR_MESSAGE]}
            type="number"
            min="0"
            step="0.01"
            value={swapState[OUTPUT_AMOUNT_RAW]}
            readOnly={true}
            placeholder="0"
            inputColor={outputToken}
          />
          <StyledEmoji
            inputColor={outputToken}
            emoji={Team[outputToken] === 'UNI' ? '🦄' : '🐷'}
            label={Team[outputToken] === 'UNI' ? 'unicorn' : 'pig'}
          />
        </StyledInputWrapper>
        {!!swapState[ERROR_MESSAGE] ? (
          <HelperText error={true}>{swapState[ERROR_MESSAGE]}</HelperText>
        ) : (
          <HelperText error={false}>
            <b>
              1 {Team[outputToken]} ={' '}
              {formatSignificant(swapState[EXECUTION_RATE_INVERTED] || swapState[MARKET_RATE_PRE_INVERTED], {
                significantDigits: 3,
                forceIntegerSignificance: true
              })}{' '}
              {Team[inputToken]}
            </b>
          </HelperText>
        )}
        <Button
          disabled={!!swapState[ERROR_MESSAGE] || !!!swapState[INPUT_AMOUNT_PARSED]}
          variant="gradient"
          stretch
          onClick={() => {
            if (swapState[SWAP_STATE] === RESTING) {
              dispatchSwapState({ type: SET_PENDING })

              Promise.all([
                fetch('/api/ovm-wallet', {
                  method: 'POST',
                  body: JSON.stringify({
                    interactionType: OVMWalletInteractions.SWAP,
                    address: wallet.address,
                    inputToken,
                    inputAmount: swapState[INPUT_AMOUNT_PARSED].toNumber()
                  })
                }),
                new Promise(resolve => {
                  setTimeout(resolve, 2000)
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
          {swapState[SWAP_STATE] === PENDING || swapState[SWAP_STATE] === SUCCESS ? (
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
            <ButtonText>Swap</ButtonText>
          )}
        </Button>
        {swapState[MARKET_RATE_PRICE_IMPACT] && (
          <PriceImpactText>
            This trade will boost the value of {Team[outputToken]} by{' '}
            <b>
              <Percentage>
                +
                {formatSignificant(swapState[MARKET_RATE_PRICE_IMPACT], {
                  significantDigits: 2,
                  forceIntegerSignificance: true
                })}
                %
              </Percentage>
            </b>
          </PriceImpactText>
        )}
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

function Manager({ wallet, team, reservesData, balancesData, updateBalancesData, inputToken, outputToken }) {
  const [showConfirm, setShowConfirm] = useState(false)
  function confirm() {
    setShowConfirm(true)
  }

  return !showConfirm ? (
    <Buy
      wallet={wallet}
      team={team}
      reservesData={reservesData}
      balancesData={balancesData}
      updateBalancesData={updateBalancesData}
      outputToken={outputToken}
      inputToken={inputToken}
      confirm={confirm}
    />
  ) : (
    <Confirmed wallet={wallet} team={team} balancesData={balancesData} />
  )
}

Manager.getInitialProps = async context => {
  const { query, res } = context
  const { buy } = query

  const outputToken = buy ? (Team[buy] === Team.UNI || Team[buy] === Team.PIGI ? Team[buy] : null) : null
  const inputToken = outputToken ? (outputToken === Team.UNI ? Team.PIGI : Team.UNI) : null

  if (!inputToken || !outputToken) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return {}
  }

  return {
    dataNeeds: {
      [DataNeeds.BALANCES]: true,
      [DataNeeds.RESERVES]: true
    },
    inputToken,
    outputToken
  }
}

export default Manager
