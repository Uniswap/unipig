import { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import Cookies from 'js-cookie'
import { Wallet } from '@ethersproject/wallet'

import { formatCookie } from '../utils'

export enum WalletSource {
  PAPER = 'PAPER',
  GENERATED = 'GENERATED',
  TWITTER = 'TWITTER'
}

export enum Team {
  UNI = 1,
  PIG = 2
}

export interface Cookie {
  source: WalletSource
  mnemonic: string
  team: Team
}

export const COOKIE_NAME = 'UNIPIG'

// action types
enum Actions {
  ADD_SOURCE,
  ADD_MNEMONIC,
  ADD_TEAM,
  RESET
}

const CookieContext = createContext({})

function useCookieContext(): any {
  return useContext(CookieContext)
}

function init({ source, mnemonic, team }: any): any {
  return {
    source,
    mnemonic,
    team
  }
}

function reducer(state, { type, payload }): any {
  switch (type) {
    case Actions.ADD_SOURCE: {
      const { source } = payload

      return {
        ...state,
        source
      }
    }
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

export default function Provider({ sourceInitial, mnemonicInitial, teamInitial, children }): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    { source: sourceInitial, mnemonic: mnemonicInitial, team: teamInitial },
    init
  )

  const addSource = useCallback((source): void => {
    dispatch({ type: Actions.ADD_SOURCE, payload: { source } })
  }, [])
  const addMnemonic = useCallback((mnemonic): void => {
    dispatch({ type: Actions.ADD_MNEMONIC, payload: { mnemonic } })
  }, [])
  const addTeam = useCallback((team): void => {
    dispatch({ type: Actions.ADD_TEAM, payload: { team } })
  }, [])
  const reset = useCallback((): void => {
    dispatch({ type: Actions.RESET, payload: {} })
  }, [])

  return (
    <CookieContext.Provider
      value={useMemo((): any => [state, { addSource, addMnemonic, addTeam, reset }], [
        state,
        addSource,
        addMnemonic,
        addTeam,
        reset
      ])}
    >
      {children}
    </CookieContext.Provider>
  )
}

export function Updater(): null {
  const [state] = useCookieContext()

  Cookies.set(COOKIE_NAME, formatCookie(state))

  return null
}

export function useAddSource(): () => void {
  const [, { addSource }] = useCookieContext()
  return addSource
}

export function useAddMnemonic(): () => void {
  const [, { addMnemonic }] = useCookieContext()
  return addMnemonic
}

export function useAddTeam(): () => void {
  const [, { addTeam }] = useCookieContext()
  return addTeam
}

export function useReset(): () => void {
  const [, { reset }] = useCookieContext()
  return reset
}

export function useSource(): WalletSource {
  const [{ source }] = useCookieContext()
  return source
}

export function useWallet(): Wallet | null {
  const [{ mnemonic }] = useCookieContext()
  return useMemo((): Wallet | null => (mnemonic ? Wallet.fromMnemonic(mnemonic) : null), [mnemonic])
}

export function useTeam(): Team {
  const [{ team }] = useCookieContext()
  return team
}
