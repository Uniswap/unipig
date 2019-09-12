/* eslint-disable jsx-a11y/anchor-has-content */
import { forwardRef } from 'react'
import NextLink from 'next/link'
import { Link as MUILink } from '@material-ui/core'

const NextComposed = forwardRef(function NextComposed({ href, as, prefetch, ...rest }: any, ref): JSX.Element {
  return (
    <NextLink href={href} as={as} prefetch={prefetch}>
      <a ref={ref} {...rest} />
    </NextLink>
  )
})

function NavLink({ innerRef, ...rest }): JSX.Element {
  return <MUILink component={NextComposed} ref={innerRef} {...rest} />
}

export default forwardRef((props, ref): JSX.Element => <NavLink innerRef={ref} {...props} />)
