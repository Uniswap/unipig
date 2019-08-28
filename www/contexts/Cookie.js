import { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import Cookies from 'js-cookie'
import { Wallet } from '@ethersproject/wallet'

import { COOKIE_NAME } from '../constants'
import { formatCookie } from '../utils'

// action types
const ADD_MNEMONIC = 'ADD_MNEMONIC'
const JOIN_TEAM = 'JOIN_TEAM'
const RESET = 'RESET'
const ACTIONS = {
  ADD_MNEMONIC,
  JOIN_TEAM,
  RESET
}

const CookieContext = createContext()

function useCookieContext() {
  return useContext(CookieContext)
}

function init({ mnemonic, team }) {
  return {
    mnemonic,
    team
  }
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_MNEMONIC: {
      const { mnemonic } = payload

      return {
        ...state,
        mnemonic
      }
    }
    case ACTIONS.JOIN_TEAM: {
      const { team } = payload

      return {
        ...state,
        team
      }
    }
    case ACTIONS.RESET: {
      return init({})
    }
    default: {
      throw Error(`Unexpected action type in CookieContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ mnemonicInitial, teamInitial, children }) {
  const [state, dispatch] = useReducer(reducer, { mnemonic: mnemonicInitial, team: teamInitial }, init)

  const addMnemonic = useCallback(mnemonic => {
    dispatch({ type: ACTIONS.ADD_MNEMONIC, payload: { mnemonic } })
  }, [])

  const joinTeam = useCallback(team => {
    dispatch({ type: ACTIONS.JOIN_TEAM, payload: { team } })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET, payload: {} })
  }, [])

  return (
    <CookieContext.Provider
      value={useMemo(() => [state, { addMnemonic, joinTeam, reset }], [state, addMnemonic, joinTeam, reset])}
    >
      {children}
    </CookieContext.Provider>
  )
}

export function Updater() {
  const [state] = useCookieContext()

  Cookies.set(COOKIE_NAME, formatCookie(state))

  return null
}

export function useAddMnemonic() {
  const [, { addMnemonic }] = useCookieContext()
  return addMnemonic
}

export function useJoinTeam() {
  const [, { joinTeam }] = useCookieContext()
  return joinTeam
}

export function useWallet() {
  const [{ mnemonic }] = useCookieContext()
  return useMemo(() => mnemonic && Wallet.fromMnemonic(mnemonic), [mnemonic])
}

export function useTeam() {
  const [{ team }] = useCookieContext()
  return team
}

export function useReset() {
  const [, { reset }] = useCookieContext()
  return reset
}
