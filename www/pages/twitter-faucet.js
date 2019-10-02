import { useEffect, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import dynamic from 'next/dynamic'
import Head from 'next/head'

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

function TwitterFaucet({ wallet, address, team, addressData, updateAddressData, OVMBalances, updateOVMBalances }) {
  const alreadyFauceted = !addressData.canFaucet
  // save the initial addressData
  const initialAddressData = useRef(addressData)
  const justFauceted = !!(initialAddressData.current.canFaucet && !addressData.canFaucet)

  const oldError = initialAddressData.current.twitterFaucetError

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

  const [showDespiteOldError, setShowDespiteOldError] = useState(false)
  useEffect(() => {
    if (polling) {
      const timeout = setTimeout(() => {
        setShowDespiteOldError(true)
      }, 12000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [polling])

  // initialize twitter stuff
  const [twitterLoaded, setTwitterLoaded] = useState(false)
  const [twitterLoadedError, setTwitterLoadedError] = useState(false)
  useEffect(() => {
    function initializeTwitter() {
      window.twttr.ready().then(() => {
        setTwitterLoaded(true)

        window.twttr.events.bind('tweet', () => {
          setPolling(true)
        })
      })
    }

    if (!window.twttr) {
      let stale = false

      setTimeout(() => {
        if (!stale) {
          if (window.twttr) {
            initializeTwitter()
          } else {
            setTimeout(() => {
              if (!stale) {
                if (window.twttr) {
                  initializeTwitter()
                } else {
                  setTwitterLoadedError(true)
                }
              }
            }, 4000)
          }
        }
      }, 1000)

      return () => {
        stale = true
      }
    } else {
      initializeTwitter()
    }
  }, [])

  useEffect(() => {
    if (justFauceted) {
      updateOVMBalances()
      setPolling(false)
    }
  }, [justFauceted, updateOVMBalances])

  function MetaInformation() {
    if (alreadyFauceted) {
      return (
        <StyledBody textStyle="gradient">
          {justFauceted ? `The Unipig just granted you tokens.` : 'Enjoy your tokens responsibly.'}
        </StyledBody>
      )
    } else if (twitterLoadedError) {
      return <StyledBody textStyle="gradient">There was an error loading Twitter.</StyledBody>
    } else if (!twitterLoaded) {
      return <StyledBody textStyle="gradient">Loading Twitter...</StyledBody>
    } else if (polling) {
      return (
        <>
          <StyledBody textStyle="gradient">
            {!!addressData.twitterFaucetError && !!oldError
              ? showDespiteOldError
                ? `Uh-oh, an error occurred: ${addressData.twitterFaucetError}`
                : "Something went wrong last time, let's try again..."
              : null}
            {!!addressData.twitterFaucetError && !!!oldError
              ? `Uh-oh, an error occurred: ${addressData.twitterFaucetError}`
              : null}
            {!!!addressData.twitterFaucetError ? 'Listening for your tweet...' : null}
          </StyledBody>
        </>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <Head>
        <script src="https://platform.twitter.com/widgets.js"></script>
      </Head>
      <Confetti start={justFauceted} />
      <TradeWrapper>
        <Title size={32} textStyle="gradient">
          {alreadyFauceted
            ? justFauceted
              ? `Coming through loud and clear @${addressData.twitterHandle}!`
              : 'Thank you for tweeting.'
            : 'Tweet at the Unipig to get some tokens.'}
        </Title>
        <Shim size={32} />
        {alreadyFauceted ? (
          <StyledWallet wallet={wallet} team={team} OVMBalances={OVMBalances} />
        ) : (
          <TweetPreview>
            {`༼ つ ◕_◕ ༽つ`}
            <br />
            {`Hey @UnipigExchange it's ${truncateAddress(
              address,
              4
            )}, give me some 🦄UNI and 🐷PIGI tokens on Layer 2! https://unipig.exchange #team${
              team === Team.UNI ? 'UNI' : 'PIGI'
            }`}
          </TweetPreview>
        )}
        <InformationContainer>
          <TweetContainer hide={alreadyFauceted || polling || !twitterLoaded}>
            <a
              className="twitter-share-button"
              href="https://twitter.com/intent/tweet"
              data-size="large"
              data-text={`༼ つ ◕_◕ ༽つ
Hey @UnipigExchange it's ${address}, give me some 🦄UNI and 🐷PIGI tokens on Layer 2!`}
              data-url="https://unipig.exchange"
              data-hashtags={`team${team === Team.UNI ? 'UNI' : 'PIGI'}`}
              data-dnt="true"
              width="200"
              height="300"
            >
              Tweet
            </a>
          </TweetContainer>
          <MetaInformation />
        </InformationContainer>

        <NavButton
          variant="gradient"
          disabled={!(alreadyFauceted || (!!addressData.twitterFaucetError && (!!!oldError || showDespiteOldError)))}
          href="/"
        >
          <ButtonText>
            {!!addressData.twitterFaucetError && (!!!oldError || showDespiteOldError) ? 'Bummer' : 'Dope'}
          </ButtonText>
        </NavButton>
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
