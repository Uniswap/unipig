import { Button } from '@material-ui/core'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  text-transform: initial;
  min-height: 60px;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
  width: 100%;
`

const StyledTwitterButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  text-transform: initial;
  min-height: 60px;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
  width: 100%;
`

const StyledGradientButton = styled(BaseButton)`
  ${({ theme }): string => theme.gradientBackground};
  color: ${({ theme }): string => theme.colors.white};
  width: ${({ stretch }) => (stretch ? '100%' : 'initial')};
`

export default function BaseButton({ children, ...rest }: any): JSX.Element {
  const { variant, ...restExGradient } = rest

  if (variant === 'gradient') {
    return (
      <StyledGradientButton variant="contained" {...restExGradient}>
        {children}
      </StyledGradientButton>
    )
  } else if (variant === 'twitter') {
    return <StyledTwitterButton {...rest}>{children}</StyledTwitterButton>
  } else {
    return <StyledButton {...rest}>{children}</StyledButton>
  }
}
