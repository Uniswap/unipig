import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import '@reach/dialog/styles.css'

import Button from './Button'
import { Body } from '../components/Type'

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

const ScanHeader = styled.span`
  display: flex;
  position: absolute;
  top: 0;
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
  font-weight: 600;
  z-index: 100;
`
const StyledHeaderText = styled(Body)`
  padding-top: 1rem;
  padding-left: 1rem;
`

const CloseButton = styled(Button)`
  background-color: black;
  color: white;
  font-size: 30px;
  padding: 0px;
  margin: 0;
  min-width: 48px;
  min-height: 48px;
  font-weight: 400;
`

export default function QRScanModal({ open, onClose, onAddress }) {
  const [error, setError] = useState()

  return open ? (
    <StyledDialogOverlay onDismiss={onClose}>
      <StyledDialogContent>
        <ScanHeader>
          <StyledHeaderText textStyle="gradient">Scan QR Code.</StyledHeaderText>
          <CloseButton variant="outline" onClick={onClose}>
            ✗
          </CloseButton>
        </ScanHeader>
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
