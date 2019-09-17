import { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import Confetti from 'react-dom-confetti'

import { truncateAddress } from '../utils'
import { Team } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Title, Body, ButtonText } from '../components/Type'
import Wallet from '../components/MiniWallet'
import { config } from '../components/ConfettiConfig'

const TweetContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;

  a {
    display: none;
  }

  iframe {
    ${({ hide }) =>
      hide &&
      css`
        visiblity: hidden !important;
        height: 0 !important;
      `}
  }
`

const TradeWrapper = styled.span`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  transition: height 0.125s ease;
`

const TweetPreview = styled.span`
  line-height: 1.5rem;
  width: 100%;
  background: #202124;
  color: #2f80ed;
  padding: 1rem;
  border-radius: 10px;
  word-wrap: all;
`

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 6rem;
  margin: 1rem 0 1rem 0;
`

const StyledBody = styled(Body)`
  text-align: center;
  font-weight: 600;
  margin: 0px;
`

function TwitterFaucet({ wallet, team, addressData, updateAddressData, balances }) {
  // save the initial addressData
  const initialAddressData = useRef(addressData)

  // polling logic to check for valid tweet
  const [polling, setPolling] = useState(false)
  const pollInterval = useRef(4000)
  const [updateError, setUpdateError] = useState()
  useEffect(() => {
    if (polling) {
      let stale = false

      function increasePollInterval() {
        if (pollInterval.current < 60000) {
          pollInterval.current = Math.max(60000, (pollInterval.current / 1000) ** 2 * 1000)
        }
      }

      async function poll() {
        await updateAddressData().catch(error => {
          if (!stale) {
            console.error(error)
            setUpdateError(error)
          }
        })
      }

      const timeout = setTimeout(increasePollInterval, pollInterval.current * 10.5)
      const interval = setInterval(poll, pollInterval.current)

      return () => {
        stale = true
        clearTimeout(timeout)
        clearInterval(interval)
      }
    }
  }, [polling, updateAddressData])

  // initialize twitter stuff
  const [twitterLoaded, setTwitterLoaded] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('scriptjs')('https://platform.twitter.com/widgets.js', () => {
      window.twttr.events.bind('loaded', () => {
        setTwitterLoaded(true)
      })
      window.twttr.events.bind('tweet', () => {
        setPolling(true)
      })
    })
  }, [])

  const justFauceted = initialAddressData.current.canFaucet && !addressData.canFaucet
  const alreadyFauceted = !addressData.canFaucet

  function metaInformation() {
    if (alreadyFauceted) {
      return <StyledBody textStyle="gradient">Coming through loud and clear @{addressData.twitterHandle}!</StyledBody>
    } else if (updateError) {
      return (
        <>
          <StyledBody textStyle="gradient">An error occurred...</StyledBody>
        </>
      )
    } else if (addressData.canFaucet && !twitterLoaded) {
      return (
        <>
          <StyledBody textStyle="gradient">Loading Twitter...</StyledBody>
        </>
      )
    } else if (polling && !justFauceted) {
      return (
        <>
          <StyledBody textStyle="gradient">Listening for your tweet...</StyledBody>
        </>
      )
    }
  }

  return (
    <TradeWrapper>
      <Title size={32} textStyle="gradient">
        {justFauceted
          ? 'TOKENS. IN. YOUR. WALLET.'
          : alreadyFauceted
          ? 'Thank you for tweeting.'
          : 'Tweet at the Unipig to get some tokens.'}
      </Title>
      <Shim size={32} />
      {alreadyFauceted ? (
        <Wallet wallet={wallet} team={team} balances={balances} />
      ) : (
        <TweetPreview>
          {`༼ つ ◕_◕ ༽つ`}
          <br />
          {`@UnipigExchange give 🦄UNI and 🐷PIGI tokens to my Layer 2 wallet: ${truncateAddress(
            wallet.address,
            4
          )} https://unipig.exchange #team${team === Team.UNI ? 'UNI' : 'PIGI'}`}
        </TweetPreview>
      )}
      <InformationContainer>
        <TweetContainer hide={alreadyFauceted || polling || !twitterLoaded}>
          <a
            className="twitter-share-button"
            href="https://twitter.com/intent/tweet"
            data-size="large"
            data-text={`༼ つ ◕_◕ ༽つ
@UnipigExchange give 🦄UNI and 🐷PIGI tokens to my Layer 2 wallet: ${wallet.address}`}
            data-url="https://unipig.exchange"
            data-hashtags={`team${team === Team.UNI ? 'UNI' : 'PIGI'}`}
            data-dnt="true"
          >
            Tweet
          </a>
        </TweetContainer>

        {metaInformation()}
      </InformationContainer>

      {alreadyFauceted && (
        <NavButton variant="gradient" href="/">
          <ButtonText>Dope</ButtonText>
        </NavButton>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Confetti active={justFauceted} config={config} />
      </div>
    </TradeWrapper>
  )
}

// TODO add PG API and deal with decimals
TwitterFaucet.getInitialProps = async () => {
  return {
    balances: {
      [Team.UNI]: 5,
      [Team.PIGI]: 5
    }
  }
}

export default TwitterFaucet
