import { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import dynamic from 'next/dynamic'

import { truncateAddress } from '../utils'
import { Team } from '../contexts/Client'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Title, Body, ButtonText } from '../components/Type'
import Wallet from '../components/MiniWallet'

const Confetti = dynamic(() => import('../components/Confetti'), { ssr: false })

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
  /* text-align: center; */
  font-weight: 600;
  margin: 0px;
`

const StyledWallet = styled(Wallet)`
  background-color: rgba(255, 255, 255, 0.1);
`

function TwitterFaucet({ wallet, team, addressData, updateAddressData, OVMBalances, updateOVMBalances }) {
  // save the initial addressData
  const initialAddressData = useRef(addressData)

  // polling logic to check for valid tweet
  const [polling, setPolling] = useState(false)
  const pollInterval = useRef(4000)
  useEffect(() => {
    if (polling) {
      function increasePollInterval() {
        if (pollInterval.current < 60000) {
          pollInterval.current = Math.max(60000, (pollInterval.current / 1000) ** 2 * 1000)
        }
      }

      const timeout = setTimeout(increasePollInterval, pollInterval.current * 10.5)
      const interval = setInterval(updateAddressData, pollInterval.current)

      return () => {
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

  const justFauceted = !!(initialAddressData.current.canFaucet && !addressData.canFaucet)
  const alreadyFauceted = !addressData.canFaucet

  useEffect(() => {
    if (justFauceted) {
      updateOVMBalances()
    }
  }, [justFauceted, updateOVMBalances])

  function metaInformation() {
    if (alreadyFauceted) {
      return (
        <StyledBody textStyle="gradient">
          {justFauceted ? `The Unipig just granted you tokens.` : 'Enjoy your tokens responsibly.'}
        </StyledBody>
      )
    } else if (addressData.canFaucet && !twitterLoaded) {
      return (
        <>
          <StyledBody textStyle="gradient">Loading Twitter...</StyledBody>
        </>
      )
    } else if (addressData.twitterFaucetError) {
      return (
        <>
          <StyledBody textStyle="gradient">Sorry, an error occurred. Try again soon!</StyledBody>
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
    <>
      <Confetti start={justFauceted} />
      <TradeWrapper>
        <Title size={32} textStyle="gradient">
          {justFauceted
            ? `Coming through loud and clear @${addressData.twitterHandle}!`
            : alreadyFauceted
            ? 'Thank you for tweeting.'
            : 'Tweet at the Unipig to get some tokens.'}
        </Title>
        <Shim size={32} />
        {alreadyFauceted ? (
          <StyledWallet wallet={wallet} team={team} OVMBalances={OVMBalances} />
        ) : (
          <TweetPreview>
            {`༼ つ ◕_◕ ༽つ`}
            <br />
            {`@UnipigExchange give 🦄UNI and 🐷PIGI tokens to my Layer 2 wallet: ${
              wallet ? truncateAddress(wallet.address, 4) : '...'
            } https://unipig.exchange #team${team === Team.UNI ? 'UNI' : 'PIGI'}`}
          </TweetPreview>
        )}
        <InformationContainer>
          <TweetContainer hide={alreadyFauceted || polling || !twitterLoaded}>
            <a
              className="twitter-share-button"
              href="https://twitter.com/intent/tweet"
              data-size="large"
              data-text={`༼ つ ◕_◕ ༽つ
@UnipigExchange give 🦄UNI and 🐷PIGI tokens to my Layer 2 wallet: ${wallet ? wallet.address : ''}`}
              data-url="https://unipig.exchange"
              data-hashtags={`team${team === Team.UNI ? 'UNI' : 'PIGI'}`}
              data-dnt="true"
            >
              Tweet
            </a>
          </TweetContainer>

          {metaInformation()}
        </InformationContainer>

        {alreadyFauceted ? (
          <NavButton variant="gradient" href="/">
            <ButtonText>Dope</ButtonText>
          </NavButton>
        ) : (
          <NavButton variant="gradient" disabled href="/">
            <ButtonText>Dope</ButtonText>
          </NavButton>
        )}
      </TradeWrapper>
    </>
  )
}

TwitterFaucet.getInitialProps = async () => {
  return {
    addressData: true
  }
}

export default TwitterFaucet
