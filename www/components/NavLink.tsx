import Router from 'next/router'
import styled, { css } from 'styled-components'

import { GradientButton, TransparentButton, SolidButton } from './Button'

const NavLinkCSS = css``

const StyledGradientButton = styled(GradientButton)`
  ${NavLinkCSS}
  cursor: ${({ disabled }): string => disabled && 'default'};
`

const StyledTransparentButton = styled(TransparentButton)`
  ${NavLinkCSS}
`

const StyledSolidButton = styled(SolidButton)`
  ${NavLinkCSS}
`

function navigate(to: string, disabled: boolean): () => void {
  return (): void => {
    if (!disabled) {
      Router.push(to)
    }
  }
}

export function GradientNavLink({ href, children, ...rest }): JSX.Element {
  return (
    <StyledGradientButton forwardedAs="div" onClick={navigate(href, rest.disabled)} {...rest}>
      {children}
    </StyledGradientButton>
  )
}

export function TransparentNavLink({ href, children, ...rest }): JSX.Element {
  return (
    <StyledTransparentButton forwardedAs="div" onClick={navigate(href, rest.disabled)} {...rest}>
      {children}
    </StyledTransparentButton>
  )
}

export function SolidNavLink({ href, children, ...rest }): JSX.Element {
  return (
    <StyledSolidButton forwardedAs="div" onClick={navigate(href, rest.disabled)} {...rest}>
      {children}
    </StyledSolidButton>
  )
}
