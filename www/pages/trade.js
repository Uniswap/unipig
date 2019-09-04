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

const DECIMALS = 4
const DECIMALS_FACTOR = new BigNumber(10 ** DECIMALS)

const DUMMY_TOKEN = {
  decimals: DECIMALS
}

const DUMMY_TOKEN_AMOUNT = amount => ({
  token: DUMMY_TOKEN,
  amount
})

const Input = styled.input`
  border: ${({ error, theme }) => error && `2px solid ${theme.colors.error}`};
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
      <p>
        Boost {Team[outputToken]} by selling {Team[inputToken]}.
      </p>
      <label>
        Sell {Team[inputToken]}:
        <Input
          required
          error={!!inputError}
          type="number"
          min="0"
          step="0.0001"
          value={inputAmount.raw}
          onChange={onInputAmount}
        />
        <Button onClick={onMaxInputValue}>Max</Button>
      </label>
      <label>
        Buy {Team[outputToken]}:
        <Input error={!!outputError} type="number" min="0" step="0.0001" value={outputAmount.raw} readOnly={true} />
      </label>
      {(inputError || outputError) && <p>{inputError || outputError}</p>}
      <p>
        1 {Team[outputToken]} / {marketDetails.marketRate.rate.toString()} {Team[inputToken]}
      </p>
      <NavButton variant="gradient" href="/trade?confirmed=true">
        Swap
      </NavButton>
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
