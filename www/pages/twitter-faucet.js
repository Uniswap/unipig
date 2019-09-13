import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'

import { getPermissionString } from '../utils'
import { Team } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Title, Body, ButtonText } from '../components/Type'
import { truncateAddress } from '../utils'
import Wallet from '../components/MiniWallet'

import Confetti from 'react-dom-confetti'
import { config } from '../components/ConfettiConfig'

const TweetContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;

  iframe,
  a {
    visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')} !important;
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
  width: 100%;
  background: #202124;
  color: #2f80ed;
  padding: 1rem;
  border-radius: 10px;
  word-wrap: all;
`

const StyledBody = styled(Body)`
  text-align: center;
  font-weight: 600;
  margin: 0px;
`

async function getFaucetData(address, time, signature) {
  return await fetch(`/api/get-address-data`, {
    method: 'POST',
    body: JSON.stringify({ address, time, signature })
  }).then(async response => {
    if (!response.ok) {
      throw Error(`${response.status} Error: ${response.statusText}`)
    }

    return await response.json()
  })
}

function TwitterFaucet({ wallet, team, addressData, balances }) {
  // get a permission signature
  const permission = useMemo(() => getPermissionString(wallet.address), [wallet.address])
  const [signature, setSignature] = useState()
  useEffect(() => {
    let stale = false

    wallet.signMessage(permission.permissionString).then(signature => {
      if (!stale) {
        setSignature(signature)
      }
    })

    return () => {
      stale = true
      setSignature()
    }
  }, [wallet, permission.permissionString])

  // polling logic to check for valid tweet
  const [polling, setPolling] = useState(false)
  const [updatedData, setUpdatedData] = useState()
  const [updatedDataError, setUpdatedDataError] = useState()
  useEffect(() => {
    if (polling && permission.time && signature) {
      let stale = false

      function poll() {
        getFaucetData(wallet.address, permission.time, signature)
          .then(data => {
            if (!stale) {
              setUpdatedData(data)
            }
          })
          .catch(error => {
            console.error(error)
            setUpdatedDataError(error)
          })
      }

      const interval = setInterval(poll, 4000)

      return () => {
        stale = true
        clearInterval(interval)
      }
    }
  }, [polling, permission.time, permission.signature, signature, wallet.address])

  // initialize twitter stuff
  const [twitterLoaded, setTwitterLoaded] = useState(false)
  useEffect(() => {
    let stale = false

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('scriptjs')('https://platform.twitter.com/widgets.js', () => {
      if (!stale) {
        window.twttr.events.bind('loaded', () => {
          setTwitterLoaded(true)
        })
        window.twttr.events.bind('tweet', () => {
          setPolling(true)
        })
      }
    })

    return () => {
      stale = true
    }
  }, [])

  function metaInformation() {
    if (updatedDataError) {
      return (
        <>
          <Shim size={32} />
          <StyledBody textStyle="gradient">An error occurred...</StyledBody>
        </>
      )
    } else if (addressData.canFaucet && !twitterLoaded) {
      return (
        <>
          <StyledBody textStyle="gradient">Loading Twitter...</StyledBody>
        </>
      )
    } else if (polling && (!updatedData || updatedData.canFaucet)) {
      return (
        <>
          <Shim size={32} />
          <StyledBody textStyle="gradient">Listening for your tweet...</StyledBody>
        </>
      )
    }
  }

  return (
    <TradeWrapper>
      <Title size={32} textStyle="gradient">
        {!addressData.canFaucet || (updatedData && !updatedData.canFaucet)
          ? 'TOKENS. IN. YOUR. WALLET.'
          : 'Tweet at the Unipig to get some tokens.'}
      </Title>
      <Shim size={32} />

      {!addressData.canFaucet || (updatedData && !updatedData.canFaucet) ? (
        <Wallet wallet={wallet} team={team} balances={balances} disableNav />
      ) : (
        <TweetPreview>
          ༼ つ ◕_◕ ༽つ @UnipigExchange give 🦄UNI and 🐷PIGI tokens to my Layer 2 wallet:
          {truncateAddress('0x486a5415db4e45e06a0f7970207751ce54791c60', 8)} https://unipig.exchange #teamPIGI
        </TweetPreview>
      )}

      <Shim size={32} />

      <TweetContainer hide={!addressData.canFaucet || !twitterLoaded || (updatedData && !updatedData.canFaucet)}>
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

      {!addressData.canFaucet || (updatedData && !updatedData.canFaucet) ? (
        <>
          {/* <Shim size={32} /> */}
          <StyledBody textStyle="gradient">
            Coming through loud and clear @{updatedData ? updatedData.twitterHandle : addressData.twitterHandle}!
          </StyledBody>
          <Shim size={32} />
          <NavButton variant="gradient" href="/">
            <ButtonText>Dope</ButtonText>
          </NavButton>
        </>
      ) : (
        <>
          {/* <Shim size={32} /> */}
          {metaInformation()}
          <Shim size={32} />
          <NavButton disabled variant="gradient" href="/">
            <ButtonText>Dope</ButtonText>
          </NavButton>
        </>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Confetti active={!addressData.canFaucet || (updatedData && !updatedData.canFaucet)} config={config} />
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
