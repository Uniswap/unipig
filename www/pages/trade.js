import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  TRADE_EXACT,
  BigNumber,
  getMarketDetails,
  getTradeDetails,
  formatSignificant,
  formatSignificantDecimals,
  formatFixedDecimals
} from '@uniswap/sdk'

import { Team } from '../contexts/Cookie'
import Button from '../components/Button'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Body, Desc, ButtonText } from '../components/Type'
import Emoji from '../components/Emoji'

import { transparentize } from 'polished'

import Wallet from '../components/MiniWallet'

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

function Buy({ wallet, team, reserves, balances }) {
  const router = useRouter()

  //// parse the url
  const { buy } = router.query || {}
  const outputToken = buy ? Team[buy] : null
  const inputToken = outputToken ? (outputToken === Team.UNI ? Team.PIGI : Team.UNI) : null

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
          Boost {Team[outputToken]} by dumping {Team[inputToken]}.
        </b>
      </Body>
      <TradeWrapper>
        <StyledInputWrapper>
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
            emoji={Team[inputToken] === 'UNI' ? '🦄' : '🐷'}
            label={Team[inputToken] === 'UNI' ? 'unicorn' : 'pig'}
          />
        </StyledInputWrapper>
        <ArrowDown>↓</ArrowDown>
        <StyledInputWrapper>
          <Input
            disabled={true}
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
            emoji={Team[outputToken] === 'UNI' ? '🦄' : '🐷'}
            label={Team[outputToken] === 'UNI' ? 'unicorn' : 'pig'}
          />
        </StyledInputWrapper>
        {(inputError || outputError) && <HelperText error={!!inputError}>{inputError || outputError}</HelperText>}
        {!inputError && !outputError && (
          <HelperText error={!!inputError}>
            <b>
              {formatSignificant(marketDetails.marketRate.rateInverted, {
                significantDigits: 4,
                forceIntegerSignificance: true
              })}{' '}
              {Team[inputToken]} = 1 {Team[outputToken]}
            </b>
          </HelperText>
        )}
        <NavButton variant="gradient" stretch href="/trade?confirmed=true">
          <ButtonText>Swap</ButtonText>
        </NavButton>
      </TradeWrapper>
      <Shim size={32} />
      <Wallet wallet={wallet} team={team} balances={balances} />
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

function Manager({ wallet, team, reserves, balances }) {
  const router = useRouter()
  const { buy, confirmed } = router.query || {}
  if (!buy && !confirmed) {
    router.push(`/trade?buy=${Team[Team.UNI]}`, `/trade?buy=${Team[Team.UNI]}`, { shallow: true })
    return null
  }

  return buy ? (
    <Buy wallet={wallet} team={team} reserves={reserves} balances={balances} />
  ) : (
    <Confirmed success={confirmed === 'true' ? true : false} />
  )
}

// TODO add PG API and deal with decimals
Manager.getInitialProps = async () => {
  const random = Math.round(Math.random() * 100, 0)
  return {
    reserves: {
      [Team.UNI]: random * 10000,
      [Team.PIGI]: (100 - random) * 10000
    },
    balances: {
      [Team.UNI]: 5 * 10000,
      [Team.PIGI]: 5 * 10000
    }
  }
}

export default Manager
