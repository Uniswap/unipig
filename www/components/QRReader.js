import { useRef } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'

import Button from '../components/Button'

const Wrapper = styled.div`
  width: 50%;
  align-items: center;
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
        <Button
          variant="contained"
          onClick={() => {
            qrRef.current.openImageDialog()
          }}
        >
          Upload
        </Button>
      )}
    </Wrapper>
  )
}
