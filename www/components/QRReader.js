import { useRef } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'

import Button from '../components/Button'

const Wrapper = styled.div`
  width: 100vh;
  /* height: 100vh; */
  max-width: ${({ legacyMode }) => (legacyMode ? '40%' : '100%')};
  max-height: ${({ legacyMode }) => (legacyMode ? '40%' : '100%')};
  max-width: 100%;
  max-height: 100%;
  margin: auto;

  section:first-child {
    ${({ legacyMode }) => legacyMode && `transform: scale(0.8)`};
  }

  @media only screen and (max-width: 480px) {
    width: 100%;
  }
`

const FixedButton = styled(Button)`
  margin: 100px auto;
`

const addressRegex = new RegExp(/(?<address>0x[0-9a-fA-F]{40})/)

export default function QRReader({ onAddress, onError, forceLegacy }) {
  const qrRef = useRef()

  const legacyMode = forceLegacy || !!!navigator.mediaDevices // it's ok to do this since we're guaranteeing no ssr

  function onScan(scan) {
    if (legacyMode && scan === null) {
      onError(Error('No QR code found.'))
    }

    if (scan !== null) {
      if (scan.match(addressRegex)) {
        onAddress(scan.match(addressRegex)[0])
      } else {
        onError(Error('Invalid QR data.'))
      }
    }
  }

  return (
    <Wrapper legacyMode={legacyMode}>
      <QrReader
        ref={qrRef}
        delay={500}
        facingMode="environment"
        resolution={1000}
        showViewFinder={true}
        legacyMode={legacyMode}
        onScan={onScan}
        onError={onError}
        style={{ height: !!legacyMode ? '0px' : 'auto', opacity: !!legacyMode ? '0' : '1' }}
      />
      {legacyMode && (
        <>
          <FixedButton
            variant="outlined"
            color="primary"
            onClick={() => {
              qrRef.current.openImageDialog()
            }}
          >
            Scan a Unipig wallet.
          </FixedButton>
          <p>To send an airdrop, find another Unipig player and ask them to open their wallet to find their QR code.</p>
        </>
      )}
    </Wrapper>
  )
}
