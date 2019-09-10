import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  TRADE_EXACT,
  BigNumber,
  getMarketDetails,
  getTradeDetails,
  formatFixedDecimals,
  formatSignificantDecimals
} from '@uniswap/sdk'

import { Team } from '../constants'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Heading, Title, Body, Desc, ButtonText } from '../components/Type'
import Emoji from '../components/Emoji'

import { transparentize } from 'polished'

import Wallet from '../components/Wallet'

const DECIMALS = 4
const DECIMALS_FACTOR = new BigNumber(10 ** DECIMALS)

const DUMMY_TOKEN = {
  decimals: DECIMALS
}

const DUMMY_TOKEN_AMOUNT = amount => ({
  token: DUMMY_TOKEN,
  amount
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

const Input = styled.input`
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
`

const MaxButton = styled(Button)`
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
  color: ${({ theme, inputColor }) => theme.colors[inputColor]};
  font-weight: 500;
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
  color: ${({ error, theme, inputColor }) => (error ? theme.colors.error : theme.colors.textColor)};
  width: 100%;
  max-width: 500px;
  text-align: center;
  font-size: 16px;
`

function Buy({ balances, reserves }) {
  const router = useRouter()

  //// parse the url
  const { buy } = router.query || {}
  const outputToken = buy ? Team[buy] : null
  const inputToken = outputToken ? (outputToken === Team.UNI ? Team.PIG : Team.UNI) : null

  //// parse the props
  const inputBalance = new BigNumber(balances[inputToken])
  const inputReserve = new BigNumber(reserves[inputToken])
  const outputReserve = new BigNumber(reserves[outputToken])
  // fake it by pretending the input currency is ETH
  const marketDetails = getMarketDetails(undefined, {
    token: DUMMY_TOKEN,
    ethReserve: DUMMY_TOKEN_AMOUNT(inputReserve),
    tokenReserve: DUMMY_TOKEN_AMOUNT(outputReserve)
  })

  // amounts
  const [inputError, setInputError] = useState()
  const [outputError, setOutputError] = useState()
  const [inputAmount, setInputAmount] = useState({ raw: '', parsed: undefined })
  const [outputAmount, setOutputAmount] = useState({ raw: '', parsed: undefined })
  // updaters
  function setValues(inputAmountRaw, inputAmountParsed, outputAmountRaw, outputAmountParsed, inputError, outputError) {
    setInputAmount({ raw: inputAmountRaw, parsed: inputAmountParsed })
    setOutputAmount({ raw: outputAmountRaw, parsed: outputAmountParsed })
    setInputError(inputError)
    setOutputError(outputError)
  }
  function updateValues(rawValue, parsedValue) {
    let tradeDetails
    try {
      tradeDetails = getTradeDetails(TRADE_EXACT.INPUT, parsedValue, marketDetails)
    } catch {
      setValues(rawValue, undefined, '', undefined, 'Invalid Input')
      return
    }

    const outputAmount = tradeDetails.outputAmount.amount
    const formattedOutputAmount = formatSignificantDecimals(outputAmount, DECIMALS, {
      significantDigits: 4,
      forceIntegerSignificance: true
    })

    if (parsedValue.gt(inputBalance)) {
      setValues(rawValue, parsedValue, formattedOutputAmount, outputAmount, 'Insufficient Balance')
      return
    }

    setValues(rawValue, parsedValue, formattedOutputAmount, outputAmount)
  }
  function onInputAmount(event) {
    const typedValue = event.target.value

    if (typedValue === '') {
      setValues('', undefined, '', undefined)
      return
    }

    let parsedValue
    try {
      parsedValue = new BigNumber(typedValue).times(DECIMALS_FACTOR)
      if (parsedValue.isNaN()) {
        throw Error()
      }
    } catch {
      setValues(typedValue, undefined, '', undefined, 'Invalid Input')
      return
    }

    updateValues(typedValue, parsedValue)
  }
  function onMaxInputValue() {
    updateValues(formatFixedDecimals(inputBalance, DECIMALS), inputBalance)
  }

  // handle redirect
  useEffect(() => {
    if (!outputToken) {
      router.push('/')
    }
  })
  if (!outputToken) {
    return null
  }

  return (
    <>
      <Body textStyle="gradient">
        <b>
          Boost {Team[outputToken]} by selling {Team[inputToken]}.
        </b>
      </Body>
      <TradeWrapper>
        <StyledInputWrapper>
          {/* Sell {Team[inputToken]}: */}
          <Input
            required
            error={!!inputError}
            type="number"
            min="0"
            step="0.0001"
            placeholder="0"
            value={inputAmount.raw}
            onChange={onInputAmount}
            inputColor={inputToken}
          />
          {!inputError && (
            <MaxButton inputColor={inputToken} onClick={onMaxInputValue}>
              Max
            </MaxButton>
          )}
          <StyledEmoji
            inputColor={inputToken}
            // emoji={Team[inputToken] === 'UNI' ? '🦄' : '🐷'}
            emoji={Team[inputToken] === 'UNI' ? 'UNI' : 'PIG'}
            label={Team[inputToken] === 'UNI' ? 'unicorn' : 'pig'}
          />
        </StyledInputWrapper>
        <ArrowDown>↓</ArrowDown>
        <StyledInputWrapper>
          {/* Buy {Team[outputToken]}: */}
          <Input
            error={!!outputError}
            type="number"
            min="0"
            step="0.0001"
            value={outputAmount.raw}
            readOnly={true}
            placeholder="0"
            inputColor={outputToken}
          />
          <StyledEmoji
            inputColor={outputToken}
            emoji={Team[outputToken] === 'UNI' ? 'UNI' : 'PIG'}
            label={Team[outputToken] === 'UNI' ? 'unicorn' : 'pig'}
          />
        </StyledInputWrapper>
        {(inputError || outputError) && <HelperText error={!!inputError}>{inputError || outputError}</HelperText>}
        {!inputError && !outputError && (
          <HelperText error={!!inputError}>
            <b>
              {1 / marketDetails.marketRate.rate.toString()} {Team[inputToken]} = 1 {Team[outputToken]}
            </b>
          </HelperText>
        )}
        <NavButton variant="gradient" stretch href="/trade?confirmed=true">
          <ButtonText>Swap</ButtonText>
        </NavButton>
      </TradeWrapper>
      <Shim size={32} />
      <Wallet balances={balances} />
    </>
  )
}

function Confirmed({ success }) {
  return (
    <>
      <NavButton variant="gradient" href="/">
        {success ? 'Dope' : ':('}
      </NavButton>
    </>
  )
}

function Manager({ balances, reserves }) {
  const router = useRouter()
  const { buy, confirmed } = router.query || {}
  if (!buy && !confirmed) {
    router.push(`/trade?buy=${Team[Team.UNI]}`, `/trade?buy=${Team[Team.UNI]}`, { shallow: true })
    return null
  }

  return buy ? (
    <Buy balances={balances} reserves={reserves} />
  ) : (
    <Confirmed success={confirmed === 'true' ? true : false} />
  )
}

Manager.getInitialProps = async () => {
  return {
    balances: {
      [Team.UNI]: 100000,
      [Team.PIG]: 100000
    },
    reserves: {
      [Team.UNI]: 10000000,
      [Team.PIG]: 20000000
    }
  }
}

export default Manager
