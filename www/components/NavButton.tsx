/* eslint-disable jsx-a11y/anchor-has-content */
import { forwardRef } from 'react'
import NextLink from 'next/link'

import Button from './Button'

const NextComposed = forwardRef(function NextComposed({ href, as, prefetch, ...rest }: any, ref): JSX.Element {
  return (
    <NextLink href={href} as={as} prefetch={prefetch}>
      <a ref={ref} {...rest} />
    </NextLink>
  )
})

function NavButton({ innerRef, ...rest }): JSX.Element {
  return <Button component={NextComposed} ref={innerRef} {...rest} />
}

export default forwardRef((props: any, ref): JSX.Element => <NavButton innerRef={ref} {...props} />)
