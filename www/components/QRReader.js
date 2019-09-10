import { useRef, useState } from 'react'
import styled from 'styled-components'
import QrReader from 'react-qr-reader'

import Button from '../components/Button'

const Wrapper = styled.div`
  width: 55%;
  align-items: center;
`

const addressRegex = new RegExp(/(?<address>0x[0-9a-fA-F]{40})/)

export default function QRReader() {
  const qrRef = useRef()

  const [error, setError] = useState(false)
  const [scannedAddress, setScannedAddress] = useState()

  const legacyMode = !!(!navigator || !navigator.mediaDevices)

  function onScan(scan) {
    if (scan === null && legacyMode) {
      setError(true)
    }

    if (scan !== null) {
      if (scan.match(addressRegex)) {
        setScannedAddress(scan.match(addressRegex)[0])
      } else {
        setError(true)
      }
    }
  }

  return (
    <Wrapper>
      {error && <p>error</p>}

      {scannedAddress && <p>{scannedAddress}</p>}

      <QrReader
        ref={qrRef}
        delay={500}
        facingMode="environment"
        resolution={1000}
        showViewFinder={true}
        legacyMode={legacyMode}
        onScan={onScan}
        onError={error => {
          console.error(error)
          setError(true)
        }}
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
