import { forwardRef } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Button from './Button'

const FilteredButton = ({ stretch, ...rest }): JSX.Element => <Button {...rest} />
const StyledNavButton = styled(FilteredButton)`
  width: ${({ stretch }): string => (stretch ? '100%' : 'initial')};
`

const LinkButton = forwardRef(
  ({ href, children, ...rest }: any, ref: any): JSX.Element => (
    <Link href={href} ref={ref}>
      <a {...rest}>{children}</a>
    </Link>
  )
)

export default function NavButton({ children, ...rest }: any): JSX.Element {
  return (
    <StyledNavButton component={LinkButton} {...rest}>
      {children}
    </StyledNavButton>
  )
}
