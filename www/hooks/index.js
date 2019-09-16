import { useContext, useRef, useEffect } from 'react'
import { ThemeContext } from 'styled-components'

export function useStyledTheme() {
  return useContext(ThemeContext)
}

// https://usehooks.com/usePrevious/
export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}
