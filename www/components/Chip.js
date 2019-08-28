import styled from 'styled-components'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StrippedStyledChip = ({ fade, backgroundColor, ...rest }) => <div {...rest} />
const StyledChip = styled(StrippedStyledChip)`
  border-radius: 1rem;
  ${({ fade, theme }) => fade && theme.fadeBackground};
  background-color: ${({ backgroundColor }) => backgroundColor && backgroundColor};
`

export default function Chip({ children, fade = true, backgroundColor, ...rest }) {
  return (
    <StyledChip fade={fade} backgroundColor={backgroundColor} {...rest}>
      {children}
    </StyledChip>
  )
}
