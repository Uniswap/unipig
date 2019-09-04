import { Button } from '@material-ui/core'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledGradientButton = styled(BaseButton)`
  ${({ theme }): string => theme.gradientBackground};
  color: ${({ theme }): string => theme.colors.white};
`

export default function BaseButton({ children, ...rest }: any): JSX.Element {
  const { variant, ...restExGradient } = rest

  if (variant === 'gradient') {
    return (
      <StyledGradientButton variant="contained" {...restExGradient}>
        {children}
      </StyledGradientButton>
    )
  } else {
    return <StyledButton {...rest}>{children}</StyledButton>
  }
}
