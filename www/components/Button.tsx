import { Button } from '@material-ui/core'
import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilteredButton = ({ stretch, ...rest }): JSX.Element => <Button {...rest} />
const StyledButton = styled(FilteredButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  text-transform: initial;
  min-height: 60px;
  opacity: ${({ disabled }): string => (disabled ? '0.4' : '1')};
  width: ${({ stretch }): string => (stretch ? '100%' : 'initial')};
`

const StyledGradientButton = styled(StyledButton)`
  ${({ theme }): string => theme.gradientBackground};
  color: ${({ theme }): string => theme.colors.white};
`

export default function CustomButton({ children, ...rest }: any): JSX.Element {
  const { variant, ...restExVariant } = rest

  if (variant === 'gradient') {
    return (
      <StyledGradientButton variant="contained" {...restExVariant}>
        {children}
      </StyledGradientButton>
    )
  } else {
    return <StyledButton {...rest}>{children}</StyledButton>
  }
}
