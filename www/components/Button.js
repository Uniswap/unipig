import styled from 'styled-components'

import { useStyledTheme } from '../hooks'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StrippedStyledButton = ({ fill, noFillColor, ...rest }) => <button {...rest} />
const StyledButton = styled(StrippedStyledButton)`
  min-height: 2rem;
  min-width: 10rem;
  margin: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;

  ${({ fill, theme }) => (fill ? theme.fadeBackground : theme.transparentBackground)};
  border: ${({ fill, theme, noFillColor }) =>
    fill ? `1px solid ${theme.colors.transparent}` : `1px solid ${noFillColor}`};
  color: ${({ fill, theme, noFillColor }) => (fill ? theme.colors.white : noFillColor)};

  :hover {
    cursor: pointer;
  }

  :active:focus {
    outline: none;
  }
`

export default function Button({ children, fill = true, noFillColor, ...rest }) {
  const theme = useStyledTheme()

  return (
    <StyledButton fill={fill} noFillColor={noFillColor || theme.colors.uniswap} {...rest}>
      {children}
    </StyledButton>
  )
}
