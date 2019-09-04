import { forwardRef } from 'react'
import Link from 'next/link'

import Button from './Button'

const LinkButton = forwardRef(
  ({ href, children, ...rest }: any, ref: any): JSX.Element => (
    <Link href={href} ref={ref}>
      <a {...rest}>{children}</a>
    </Link>
  )
)

export default function NavButton({ children, ...rest }: any): JSX.Element {
  return (
    <Button component={LinkButton} {...rest}>
      {children}
    </Button>
  )
}
