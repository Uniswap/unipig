import styled from 'styled-components'

const StyledShim = styled.span`
  width: 100%;
  height: ${({ size }) => size + 'px'};
`
export default function Shim({ size }) {
  return <StyledShim size={size} />
}
