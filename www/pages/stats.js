import styled from 'styled-components'
import { transparentize } from 'polished'
import { useEffect, useState } from 'react'

import { POLL_DURATION } from '../constants'
import { stats } from '../utils'

const StyledWallet = styled.span`
  ${({ theme }) => theme.gradientBackground};

  /* background-color: black; */
  padding: 1.5rem;
  color: ${({ theme }) => transparentize(0.2, theme.colors.black)};
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
`

const StatsTitle = styled.span`
  text-decoration: none;
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

const Stat = styled.span`
  padding: 1rem 0;
`

const Value = styled.p`
  font-size: 48px;
  font-weight: 700;
  margin: 0;
`

const Description = styled.p`
  font-size: 16px;
  margin: 0;
`

let cachedTransactionCount

export default function Stats() {
  const [transactionCount, setTransactionCount] = useState()
  useEffect(() => {
    cachedTransactionCount = transactionCount
  }, [transactionCount])

  const [transactionCountError, setTransactionCountError] = useState()
  useEffect(() => {
    function updateCount() {
      console.log('updating!')
      stats()
        .then(setTransactionCount)
        .catch(error => {
          console.error(error)
          setTransactionCountError(true)
        })
    }

    updateCount()
    const interval = setInterval(updateCount, POLL_DURATION)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const currentTransactionCount = transactionCount || cachedTransactionCount

  return (
    <StyledWallet>
      <StatsTitle>
        <span>Stats</span>
      </StatsTitle>
      {!currentTransactionCount && !transactionCountError ? <Description>Loading...</Description> : null}
      {transactionCountError && !currentTransactionCount ? (
        <Description>There was an error, please try again soon.</Description>
      ) : null}
      {currentTransactionCount ? (
        <>
          <Stat>
            <Value>{currentTransactionCount}</Value>
            <Description>total transactions</Description>
          </Stat>
          <Stat>
            <Value>{((currentTransactionCount * 80000 * 20) / 10 ** 9).toFixed(4)}</Value>
            <Description>ether worth of gas saved</Description>
          </Stat>
          <Stat>
            <Value>{((currentTransactionCount * 200) / 1000 / 60).toFixed(2)}</Value>
            <Description>minutes saved</Description>
          </Stat>
        </>
      ) : null}
    </StyledWallet>
  )
}
