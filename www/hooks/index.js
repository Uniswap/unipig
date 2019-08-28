import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

export function useStyledTheme() {
  const theme = useContext(ThemeContext)
  return theme || {}
}
