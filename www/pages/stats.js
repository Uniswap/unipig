import styled from 'styled-components'
import { transparentize } from 'polished'
import { useEffect, useState } from 'react'
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

export default function Stats() {
  const [transactionCount, setTransactionCount] = useState()
  const [transactionCountError, setTransactionCountError] = useState()
  useEffect(() => {
    stats()
      .then(setTransactionCount)
      .catch(error => {
        console.error(error)
        setTransactionCountError(true)
      })
  }, [])

  return (
    <StyledWallet>
      <StatsTitle>
        <span>Stats</span>
      </StatsTitle>
      {transactionCountError && <Description>There was an error, please try again soon.</Description>}
      {transactionCount && (
        <>
          <Stat>
            <Value>{transactionCount}</Value>
            <Description>total transactions</Description>
          </Stat>
          <Stat>
            <Value>{((transactionCount * 80000 * 20) / 10 ** 9).toFixed(4)}</Value>
            <Description>ether worth of gas saved</Description>
          </Stat>
          <Stat>
            <Value>{((transactionCount * 200) / 1000 / 60).toFixed(2)}</Value>
            <Description>minutes saved</Description>
          </Stat>
        </>
      )}
    </StyledWallet>
  )
}
