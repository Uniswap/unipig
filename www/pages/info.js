import styled from 'styled-components'
import { transparentize } from 'polished'

const StyledFAQ = styled.span`
  background: ${({ theme }) => theme.gradient};
  padding: 1.5rem;
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

const Title = styled.p`
  margin-top: 48px;
  font-size: 24px;
`

const Question = styled.p`
  font-size: 18px;
  margin: 0;
  margin-bottom: 2px;
  line-height: 1.4;
  font-weight: 600;
`

const Answer = styled.p`
  font-size: 18px;
  color: #bcbcbe;
  margin: 0;
  line-height: 1.4;
`

const Link = styled.a`
  color: ${({ theme }) => theme.colors.uniswap};
`

const UniswapLink = styled.a`
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.uniswap)};
  padding: 1rem;
  border-radius: 20px;
  margin-right: 8px;
  text-decoration: none;
  color: white;
  width: 100%;
`

const PlasmaLink = styled.a`
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.plasmaGroup)};
  padding: 1rem;
  border-radius: 20px;
  text-decoration: none;
  color: white;
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
        <Link href="https://medium.com">Read more on Medium ↗</Link>
      </Stat>
      <Stat>
        <Question>What is Optimistic Rollup?</Question>
        <Answer>Generalized layer 2 running on OVM.</Answer>
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
          Yes. Data availability on mainnet ethereum guarantees anyone can challenge invalid transactions.
        </Answer>
      </Stat>
      <Stat>
        <Question>What’s missing from this demo?</Question>
        <Answer>Layer 2 deposits and withdrawls.</Answer>
      </Stat>
      <Stat>
        <Question>How do I build a Dapp on Optimistic rollup?</Question>
        <Answer>Check out the docs and code on Github. Link to docs and stuff</Answer>
      </Stat>
      <Stat>
        <Description>Built by:</Description>
        <span>
          <UniswapLink href="https://uniswap.io">🦄 Uniswap</UniswapLink>
          <PlasmaLink href="https://plasma.group">🐷 Plasma Group</PlasmaLink>
        </span>
      </Stat>
    </StyledFAQ>
  )
}
