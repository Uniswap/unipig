import styled, { css } from 'styled-components'

import { GradientButton, TransparentButton, SolidButton } from './Button'

const ChipCSS = css`
  min-width: 0rem;
  min-height: 0rem;
  padding: 0rem 0.5rem 0rem 0.5rem;
`

const StyledGradientButton = styled(GradientButton)`
  ${ChipCSS}
`

const StyledTransparentButton = styled(TransparentButton)`
  ${ChipCSS}
`

const StyledSolidButton = styled(SolidButton)`
  ${ChipCSS}
`

export function GradientChip(props: any): JSX.Element {
  return <StyledGradientButton forwardedAs="div" {...props} />
}

export function TransparentChip(props: any): JSX.Element {
  return <StyledTransparentButton forwardedAs="div" {...props} />
}

export function SolidChip(props: any): JSX.Element {
  return <StyledSolidButton forwardedAs="div" {...props} />
}
