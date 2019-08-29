import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

export function useStyledTheme() {
  return useContext(ThemeContext)
}
