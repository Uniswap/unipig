import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import '@reach/dialog/styles.css'

import Button from './Button'

const QRReader = dynamic({
  loader: () => import('./QRReader'),
  ssr: false
})

const StyledDialogOverlay = styled(DialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.modalBackground};
  }
`

const StyledDialogContent = styled(DialogContent)`
  &[data-reach-dialog-content] {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.black};
  }
`

export default function QRScanModal({ open, onClose, onAddress }) {
  const [error, setError] = useState()

  return open ? (
    <StyledDialogOverlay onClose={onClose}>
      <StyledDialogContent>
        <Button variant="contained" onClick={onClose}>
          x
        </Button>
        <QRReader
          onAddress={onAddress}
          onError={error => {
            console.error(error)
            setError(error)
          }}
        />
        {error && <p>error</p>}
      </StyledDialogContent>
    </StyledDialogOverlay>
  ) : null
}
