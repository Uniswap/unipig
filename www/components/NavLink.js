import Link from 'next/link'

import Button from './Button'

export default function NavLink({ href, children, ...rest }) {
  return (
    <Link href={href} passHref>
      <Button {...rest}>{children}</Button>
    </Link>
  )
}
