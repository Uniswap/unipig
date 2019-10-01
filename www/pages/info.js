import styled from 'styled-components'
import { transparentize } from 'polished'

const StyledWallet = styled.span`
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.black)};

  /* background-color: black; */
  padding: 1.5rem;
  /* color: ${({ theme }) => transparentize(0.2, theme.colors.black)}; */
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

const Question = styled.p`
  font-size: 16px;
  margin: 0;
  margin-bottom: 2px;
`

const Answer = styled.p`
  font-size: 16px;
  color: #bcbcbe;
  margin: 0;
`

const Description = styled.p`
  font-size: 14px;
  margin: 0;
`

function Stats() {
  return (
    <StyledWallet>
      <StatsTitle>
        <span>What is this?</span>
        <a href="/"> ✗</a>
      </StatsTitle>
      <Stat>
        <Description>
          A testnet demo of Uniswap running on optimistic rollup to demonstrate the UX improvements that are possible
          with layer 2. Ethereum can scale today.
        </Description>
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
    </StyledWallet>
  )
}

// TODO add PG API and deal with decimals
Stats.getInitialProps = async () => {
  return {}
}

export default Stats
