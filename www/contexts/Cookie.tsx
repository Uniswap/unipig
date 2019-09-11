import { createContext, useContext, useReducer, useMemo, useCallback, Context } from 'react'
import Cookies from 'js-cookie'

import { formatCookie } from '../utils'

export enum Team {
  UNI = 1,
  PIGI = 2
}

export interface Cookie {
  mnemonic?: string
  team?: Team
}

export const COOKIE_NAME = 'UNIPIG'

// action types
enum Actions {
  ADD_MNEMONIC,
  ADD_TEAM,
  RESET
}

const CookieContext: Context<[Cookie, {}]> = createContext([{}, {}])

function useCookieContext(): [Cookie, any] {
  return useContext(CookieContext)
}

function init({ mnemonic, team }: Cookie): Cookie {
  return {
    mnemonic,
    team
  }
}

function reducer(state: any, { type, payload }): Cookie {
  switch (type) {
    case Actions.ADD_MNEMONIC: {
      const { mnemonic } = payload

      return {
        ...state,
        mnemonic
      }
    }
    case Actions.ADD_TEAM: {
      const { team } = payload

      return {
        ...state,
        team
      }
    }
    case Actions.RESET: {
      return init({})
    }
    default: {
      throw Error(`Unexpected action type in CookieContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ mnemonicInitial, teamInitial, children }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, { mnemonic: mnemonicInitial, team: teamInitial }, init)

  const addMnemonic = useCallback((mnemonic: string): void => {
    dispatch({ type: Actions.ADD_MNEMONIC, payload: { mnemonic } })
  }, [])
  const addTeam = useCallback((team: Team): void => {
    dispatch({ type: Actions.ADD_TEAM, payload: { team } })
  }, [])
  const reset = useCallback((): void => {
    dispatch({ type: Actions.RESET, payload: {} })
  }, [])

  return (
    <CookieContext.Provider
      value={useMemo((): any => [state, { addMnemonic, addTeam, reset }], [state, addMnemonic, addTeam, reset])}
    >
      {children}
    </CookieContext.Provider>
  )
}

export function Updater(): null {
  const [state] = useCookieContext()

  Cookies.set(COOKIE_NAME, formatCookie(state), { expires: 365 * 10 }) // 10 year expiration

  return null
}

export function useAddMnemonic(): () => void {
  const [, { addMnemonic }] = useCookieContext()
  return addMnemonic
}

export function useMnemonicExists(): boolean {
  const [state] = useCookieContext()
  return !!state.mnemonic
}

export function useAddTeam(): () => void {
  const [, { addTeam }] = useCookieContext()
  return addTeam
}

export function useTeamExists(): boolean {
  const [state] = useCookieContext()
  return !!state.team
}

// eslint-disable-next-line @typescript-eslint/camelcase
export function useTeam_UNSAFE(): Team | undefined {
  const [state] = useCookieContext()
  return state.team
}

export function useReset(): () => void {
  const [, { reset }] = useCookieContext()
  return reset
}
