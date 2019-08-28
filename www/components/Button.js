import styled from 'styled-components'

const StyledButton = styled.button`
  background-color: ${({ theme, active }) => (active ? theme.colors.pink : theme.colors.white)};
`

export default function Button({ children, active, ...rest }) {
  return (
    <StyledButton active={active} {...rest}>
      {children}
    </StyledButton>
  )
}
