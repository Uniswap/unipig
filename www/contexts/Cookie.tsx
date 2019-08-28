import { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Wallet } from '@ethersproject/wallet'

import { Team, COOKIE_NAME } from '../constants'
import { formatCookie } from '../utils'

// action types
enum Actions {
  joinTeam,
  reset
}

interface Context {
  mnemonic: string
  team: Team
}

const CookieContext = createContext([{}, {}])

function useCookieContext(): any {
  return useContext(CookieContext)
}

function reducer(state: object, { type, payload }: any): object {
  switch (type) {
    case Actions.joinTeam: {
      console.log('joining team')
      const { team } = payload

      return {
        ...state,
        team
      }
    }
    case Actions.reset: {
      console.log('resetting')
      return init(payload)
    }
    default: {
      throw Error(`Unexpected action type in CookieContext reducer: '${type}'.`)
    }
  }
}

function init({ mnemonic, team }): Context {
  return {
    mnemonic: mnemonic || 'artwork twice detail cover congress chronic fee empty off parent tired emerge', // Wallet.createRandom().mnemonic,
    team
  }
}

export default function Provider({ mnemonicInitial, teamInitial, children }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, { mnemonic: mnemonicInitial, team: teamInitial }, init)

  const joinTeam = useCallback((team: Team): void => {
    dispatch({ type: Actions.joinTeam, payload: { team } })
  }, [])

  const reset = useCallback((): void => {
    dispatch({ type: Actions.reset, payload: {} })
  }, [])

  return (
    <CookieContext.Provider value={useMemo((): any => [state, { joinTeam, reset }], [state, joinTeam, reset])}>
      {children}
    </CookieContext.Provider>
  )
}

export function Updater(): void {
  const [state] = useCookieContext()

  useEffect((): void => {
    console.log('updating cookie', state)
    Cookies.set(COOKIE_NAME, formatCookie(state))
  })

  return null
}

export function useWallet(): Wallet {
  const [{ mnemonic }] = useCookieContext()
  return Wallet.fromMnemonic(mnemonic)
}

export function useTeam(): [Team, (team: Team) => void] {
  const [{ team }, { joinTeam }] = useCookieContext()
  return [team, joinTeam]
}

export function useResetWallet(): () => void {
  const [, { reset }] = useCookieContext()
  return reset
}
