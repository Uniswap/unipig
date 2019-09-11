import styled from 'styled-components'

const GradientTextColor = styled.p`
  ${({ theme }): string => theme.gradientBackground}
  -webkit-text-fill-color: transparent;
`

export default function GradientText({ children, ...rest }): JSX.Element {
  return (
    <GradientTextColor style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }} {...rest}>
      {children}
    </GradientTextColor>
  )
}
