import NavButton from '../components/NavButton'
import styled from 'styled-components'
import { transparentize } from 'polished'

import { ButtonText } from '../components/Type'

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

function Stats() {
  return (
    <StyledWallet>
      <StatsTitle>
        <span>Stats</span>
        <a href="/"> ✗</a>
      </StatsTitle>
      <Stat>
        <Value>1,238</Value>
        <Description>total transactions</Description>
      </Stat>
      <Stat>
        <Value>1,238</Value>
        <Description>total transactions</Description>
      </Stat>
      <Stat>
        <Value>1,238</Value>
        <Description>total transactions</Description>
      </Stat>
      <Stat>
        <Value>1,238</Value>
        <Description>total transactions</Description>
      </Stat>
      <Stat>
        <Value>1,238</Value>
        <Description>total transactions</Description>
      </Stat>
      {/* <NavButton variant="gradient" stretch href="/">
        <ButtonText>Dope</ButtonText>
      </NavButton> */}
    </StyledWallet>
  )
}

// TODO add PG API and deal with decimals
Stats.getInitialProps = async () => {
  return {}
}

export default Stats
