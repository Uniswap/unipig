import { forwardRef } from 'react'
import styled from 'styled-components'
import { Button } from '@material-ui/core'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FilteredButton = forwardRef(({ stretch, ...props }: any, ref): JSX.Element => <Button ref={ref} {...props} />)
const StyledButton = styled(FilteredButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  text-transform: initial;
  min-height: 60px;
  width: ${({ stretch }): string => (stretch ? '100%' : 'initial')};
`

const StyledGradientButton = styled(StyledButton)`
  ${({ theme }): string => theme.gradientBackground};
  opacity: ${({ disabled }): string => (disabled ? '0.8' : '1')};
  color: ${({ theme }): string => theme.colors.white};
`

function CustomButton({ innerRef, children, ...rest }: any): JSX.Element {
  const { variant, ...restExVariant } = rest

  if (variant === 'gradient') {
    return (
      <StyledGradientButton variant="contained" ref={innerRef} {...restExVariant}>
        {children}
      </StyledGradientButton>
    )
  } else {
    return (
      <StyledButton ref={innerRef} {...rest}>
        {children}
      </StyledButton>
    )
  }
}

export default forwardRef((props: any, ref): JSX.Element => <CustomButton innerRef={ref} {...props} />)
