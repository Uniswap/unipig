import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'

import { getPermissionString } from '../utils'
import { Team } from '../contexts/Cookie'
import NavButton from '../components/NavButton'
import Shim from '../components/Shim'
import { Title, Body } from '../components/Type'

const TweetContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  iframe,
  a {
    visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')} !important;
  }
`

const TradeWrapper = styled.span`
  width: 100%;
  height: 100%;
  display: grid;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
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

export default function TwitterFaucet({ wallet, team, addressData }) {
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
      return <Body textStyle="gradient">An error occurred...</Body>
    } else if (addressData.canFaucet && !twitterLoaded) {
      return <Body textStyle="gradient">Loading...</Body>
    } else if (polling && (!updatedData || updatedData.canFaucet)) {
      return <Body textStyle="gradient">Listening for your tweet...</Body>
    }
  }

  return (
    <TradeWrapper>
      <Title size={32} textStyle="gradient">
        Tweet at the Unipig to get some tokens.
      </Title>
      <Shim size={16} />

      {metaInformation()}

      {(!addressData.canFaucet || (updatedData && !updatedData.canFaucet)) && (
        <>
          <Body textStyle="gradient">
            Coming through loud and clear @{updatedData ? updatedData.twitterHandle : addressData.twitterHandle}!
          </Body>
          <Shim size={32} />
          <NavButton variant="gradient" href="/">
            Dope
          </NavButton>
        </>
      )}

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
    </TradeWrapper>
  )
}
