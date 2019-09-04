import { Chip } from '@material-ui/core'
import styled from 'styled-components'

const StyledChip = styled(Chip)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledGradientChip = styled(StyledChip)`
  ${({ theme }): string => theme.gradientBackground};
  color: ${({ theme }): string => theme.colors.white};
`

export default function BaseChip({ children, ...rest }: any): JSX.Element {
  const { variant, ...restExGradient } = rest

  if (variant === 'gradient') {
    return (
      <StyledGradientChip variant="default" {...restExGradient}>
        {children}
      </StyledGradientChip>
    )
  } else {
    return <StyledChip {...rest}>{children}</StyledChip>
  }
}
