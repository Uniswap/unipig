import { useRouter } from 'next/router'

import Button from './Button'

export default function NavLink({ href, children, ...rest }) {
  const router = useRouter()

  function navigate() {
    router.push(href)
  }

  return (
    <Button onClick={navigate} {...rest}>
      {children}
    </Button>
  )
}
