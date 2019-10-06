import styled from 'styled-components'
import Shim from '../components/Shim'

import { transparentize } from 'polished'

const StyledFAQ = styled.span`
  /* background: ${({ theme }) => theme.gradient}; */
  padding: 0;
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  color: ${({ theme }) => theme.colors.uniswap};
  @media only screen and (max-width: 480px) {
        padding: 0.25rem;
      }
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

const Title = styled.p`
  margin-top: 48px;
  font-size: 24px;
  font-weight: 800;
`

const Question = styled.p`
  font-size: 18px;
  margin: 0;
  margin-bottom: 6px;
  line-height: 1.4;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.uniswap};
`

const Answer = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.uniswap};
  margin: 0;
  line-height: 1.4;
`

const UniswapLink = styled.a`
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.uniswap)};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-right: 8px;
  text-decoration: none;
  color: white;
  text-align: center;
  width: 100%;
`

const PlasmaLink = styled.a`
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.plasmaGroup)};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  color: white;
  text-align: center;
  width: 100%;
`

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
`

export default function Info() {
  return (
    <StyledFAQ>
      <StatsTitle>
        <Title>What is Unipig?</Title>
      </StatsTitle>
      <Stat>
        <Description>
          A testnet demo of Uniswap running on optimistic rollup to demonstrate the UX improvements that are possible
          with layer 2.
        </Description>
        <Description>Ethereum can scale today.</Description>
        {/* <Link href="https://medium.com" target="_blank" rel="noopener noreferrer">
          Read more on Medium ↗
        </Link> */}
      </Stat>
      <Stat>
        <Description>{'Made with <3 by:'}</Description>
        <div style={{ display: 'flex' }}>
          <UniswapLink href="https://uniswap.io" target="_blank" rel="noopener noreferrer">
            🦄 Uniswap
          </UniswapLink>
          <PlasmaLink href="https://plasma.group" target="_blank" rel="noopener noreferrer">
            🐷 Plasma Group
          </PlasmaLink>
        </div>
      </Stat>

      <Shim size={24} />

      <StatsTitle>
        <Title>FAQ</Title>
      </StatsTitle>
      <Stat>
        <Question>What is Optimistic Rollup?</Question>
        <Answer>
          A layer 2 scaling solution that allows you to run fully general solidity smart contracts. Powered by the OVM.
        </Answer>
      </Stat>
      <Stat>
        <Question>What are the UX benefits of Optimistic rollup?</Question>
        <Answer>
          Instant transactions
          <br />
          Native meta-transactions
          <br />
          Native account abstraction
          <br />
          No gas
        </Answer>
      </Stat>
      <Stat>
        <Question>How does OVM compare to other scaling solutions?</Question>
        <Answer>
          No moon math. (SNARKS, STARKS, etc.)
          <br />
          Not a sidechain. (Data availability on ETH 1.0)
          <br />
          Smart contracts (Generalized, interoperable)
          <br />
          Simple infrastructure. (No consensus)
        </Answer>
      </Stat>
      <Stat>
        <Question>How many transactions per second?</Question>
        <Answer>
          ETH 1.0 (today): ~250 tps
          <br />
          ETH 1.0 (optimized): ~2000 tps
          <br />
          ETH 2.0 (sharded): 2000 * # of shards
        </Answer>
      </Stat>
      <Stat>
        <Question>Is Optimistic Rollup secure?</Question>
        <Answer>
          Yes. Data availability on mainnet Ethereum guarantees anyone can challenge invalid transactions.
        </Answer>
      </Stat>
      <Stat>
        <Question>What’s missing from this demo?</Question>
        <Answer>Layer 2 deposits and withdrawls. Instead, we airdrop testnet tokens to your wallet.</Answer>
      </Stat>
      <Stat>
        <Question>How do I build a dApp on Optimistic rollup?</Question>
        <Answer>
          Check out the docs and code on Github. A lot of awesome functionality is still under development. If you’re
          looking for ways to scale your project, you can contact Plasma Group to request a consultation.
        </Answer>
      </Stat>
    </StyledFAQ>
  )
}
