import { useRef } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'

import Button from '../components/Button'

const Wrapper = styled.div`
  width: 100vh;
  max-width: ${({ legacyMode }) => (legacyMode ? '30%' : '100%')};
  max-height: ${({ legacyMode }) => (legacyMode ? '30%' : '100%')};
  max-width: 100%;
  max-height: 100%;
  margin: auto;

  section:first-child {
    transform: scale(0.5) translateY(40%);
  }
  @media only screen and (max-width: 480px) {
    width: 100%;

    section:first-child {
      transform: scale(0.9) translateY(20%);
    }
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
    <Wrapper>
      <QrReader
        ref={qrRef}
        delay={500}
        facingMode="environment"
        resolution={1000}
        showViewFinder={true}
        legacyMode={legacyMode}
        onScan={onScan}
        onError={onError}
      />
      {legacyMode && (
        <FixedButton
          variant="outlined"
          color="primary"
          onClick={() => {
            qrRef.current.openImageDialog()
          }}
        >
          Upload an image of a Unipig wallet
        </FixedButton>
      )}
    </Wrapper>
  )
}
