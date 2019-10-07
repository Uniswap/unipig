import { Context, createContext, useContext, useReducer, useState, useMemo, useCallback, useEffect } from 'react'
import Cookies from 'js-cookie'
import { Wallet } from '@ethersproject/wallet'
import { newInMemoryDB, SignedByDB, SignedByDecider, DefaultSignatureProvider, SimpleClient } from '@pigi/core'
import {
  UNI_TOKEN_TYPE,
  PIGI_TOKEN_TYPE,
  DefaultRollupStateSolver,
  RollupClient,
  UnipigTransitioner
} from '@pigi/wallet'
import { Wallet as OldWallet } from 'ethers'

import { formatCookie, getPermissionString } from '../utils'

const LOCAL_STORAGE_NAME = 'UNIPIG'
export const COOKIE_NAME = 'UNIPIG'

export enum Team {
  UNI = 1,
  PIGI = 2
}

interface LocalStorage {
  account: undefined | string | null
}

export interface Cookie {
  address: string | null
  permission: string | null
  team: Team | null
}

type ClientContextShape = LocalStorage & Cookie

// action types
enum Actions {
  INITIALIZE,
  ADD_ACCOUNT,
  ADD_PERMISSION,
  ADD_TEAM,
  RESET
}

export function getWallet(account: string): Wallet {
  return account.length === 66 ? new Wallet(account) : Wallet.fromMnemonic(account.replace(/-/g, ' '))
}

function getAddress(account: string): string {
  return getWallet(account).address
}

function getLocalStorage(): LocalStorage {
  const localStorage = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_NAME) || JSON.stringify({}))
  const account: string | null = localStorage.account || null

  return { account }
}

const defaultClientContext = {
  account: null,
  address: null,
  permission: null,
  team: null
}

const ClientContext: Context<[ClientContextShape, any]> = createContext([defaultClientContext, {}])

function useClientContext(): [ClientContextShape, any] {
  return useContext(ClientContext)
}

function init({ address, permission, team }: Cookie): ClientContextShape {
  return {
    account: undefined,
    address: address || null,
    permission: permission || null,
    team: team || null
  }
}

function reducer(state: any, { type, payload }): ClientContextShape {
  switch (type) {
    case Actions.INITIALIZE: {
      const { account, address } = payload

      return {
        ...state,
        account,
        address
      }
    }
    case Actions.ADD_ACCOUNT: {
      const { account } = payload
      const address = getAddress(account)

      return {
        ...state,
        account,
        address
      }
    }
    case Actions.ADD_PERMISSION: {
      const { permission } = payload

      return {
        ...state,
        permission
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
      return defaultClientContext
    }
    default: {
      throw Error(`Unexpected action type in ClientContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ addressInitial, permissionInitial, teamInitial, children }): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    { address: addressInitial, permission: permissionInitial, team: teamInitial },
    init
  )

  const initialize = useCallback((account: string | null, address: string | null): void => {
    dispatch({ type: Actions.INITIALIZE, payload: { account, address } })
  }, [])
  const addAccount = useCallback((account: string): void => {
    dispatch({ type: Actions.ADD_ACCOUNT, payload: { account } })
  }, [])
  const addPermission = useCallback((permission: string): void => {
    dispatch({ type: Actions.ADD_PERMISSION, payload: { permission } })
  }, [])
  const addTeam = useCallback((team: string): void => {
    dispatch({ type: Actions.ADD_TEAM, payload: { team } })
  }, [])
  const reset = useCallback((): void => {
    dispatch({ type: Actions.RESET, payload: {} })
  }, [])

  return (
    <ClientContext.Provider
      value={useMemo((): any => [state, { initialize, addAccount, addPermission, addTeam, reset }], [
        state,
        initialize,
        addAccount,
        addPermission,
        addTeam,
        reset
      ])}
    >
      {children}
    </ClientContext.Provider>
  )
}

// this only guarantees localstorage correctness b/c of useMemo
export function useAccountExists(): boolean {
  const [{ account }] = useClientContext()
  return account === undefined ? undefined : !!account
}

export function useAddAccount(): () => void {
  const [, { addAccount }] = useClientContext()
  return addAccount
}

// this only guarantees cookie correctness b/c of useMemo
export function useTeamExists(): boolean {
  const [{ team }] = useClientContext()
  return team === undefined ? undefined : !!team
}

export function useAddTeam(): () => void {
  const [, { addTeam }] = useClientContext()
  return addTeam
}

// eslint-disable-next-line @typescript-eslint/camelcase
export function useTeam_UNWISE(): undefined | Team | null {
  const [{ team }] = useClientContext()
  return team
}

export function useReset(): () => void {
  const [, { reset }] = useClientContext()
  return reset
}

export function useWallet(): undefined | Wallet | null {
  const [{ account }] = useClientContext()
  const wallet = useMemo((): Wallet | null => (account ? getWallet(account) : null), [account])
  return account === undefined ? undefined : wallet
}

export function useOVMWallet(wallet: undefined | Wallet | null): undefined | any | null {
  const unipigWallet = useMemo((): any | null => {
    if (wallet) {
      const oldWallet: OldWallet = new OldWallet(wallet.privateKey)

      const signatureDB = newInMemoryDB()
      const signedByDB = new SignedByDB(signatureDB)
      const signedByDecider = new SignedByDecider(signedByDB, Buffer.from(oldWallet.address))
      const rollupStateSolver = new DefaultRollupStateSolver(signedByDB, signedByDecider)
      const rollupClient = new RollupClient(newInMemoryDB(), '0x970DfC92096BC15ccA54097946d6509dCdc7A858')
      const unipigWallet = new UnipigTransitioner(
        newInMemoryDB(),
        rollupStateSolver,
        rollupClient,
        new DefaultSignatureProvider(oldWallet),
        '0x970DfC92096BC15ccA54097946d6509dCdc7A858'
      )

      // Connect to the mock aggregator
      rollupClient.connect(new SimpleClient(process.env.AGGREGATOR_URL))

      return unipigWallet
    } else {
      return null
    }
  }, [wallet])

  return wallet ? unipigWallet : wallet
}

const initialOVMBalances = {
  [Team.UNI]: undefined,
  [Team.PIGI]: undefined
}

async function getOVMBalances(OVMWallet: undefined | any | null, address: string): Promise<any> {
  return await OVMWallet.getBalances(address).then((balances: any): any => {
    return {
      [Team.UNI]: balances ? balances[UNI_TOKEN_TYPE] : 0,
      [Team.PIGI]: balances ? balances[PIGI_TOKEN_TYPE] : 0
    }
  })
}

export function useOVMBalances(OVMWallet: undefined | any | null, address: string, refetchEvery?: number): any {
  const [OVMBalances, setOVMBalances] = useState(initialOVMBalances)

  const [updater, setUpdater] = useState(0)

  const updateOVMBalances = useCallback((): void => {
    setUpdater((updater): number => updater + 1)
  }, [])

  useEffect((): void | (() => void) => {
    if (refetchEvery) {
      const interval = setInterval((): void => {
        updateOVMBalances()
      }, refetchEvery)

      return (): void => {
        clearInterval(interval)
      }
    }
  }, [refetchEvery, updateOVMBalances])

  useEffect((): void | (() => void) => {
    if (OVMWallet && address) {
      let stale: boolean

      getOVMBalances(OVMWallet, address).then((balances): void => {
        if (!stale) {
          setOVMBalances(balances)
        }
      })

      return (): void => {
        stale = true
      }
    }
  }, [OVMWallet, address, updater])

  return [OVMBalances, updateOVMBalances, updater]
}

export function Updater(): null {
  const [state, { initialize, addPermission }] = useClientContext()
  const [isMounted, setIsMounted] = useState(false)

  // run localstorage fetching on client-side mount
  useEffect((): void => {
    setIsMounted(true)

    const { account } = getLocalStorage()
    const address = account ? getAddress(account) : null

    // throw an error if the INITIAL cookie state (from the init) differs from the localstorage state
    if (!!state.address && state.address !== address) {
      throw Error(
        "Your browser's cookies are out of sync with your localstorage. Please clear your cookies and try again."
      )
    }

    initialize(account, address)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // create permission string if it doesn't exist
  const wallet = useWallet()
  useEffect((): void | (() => void) => {
    if (wallet) {
      let stale: boolean

      const permissionString = getPermissionString(wallet.address)
      wallet.signMessage(permissionString).then((permission): void => {
        if (!stale) {
          addPermission(permission)
        }
      })

      return (): void => {
        stale = true
      }
    }
  }, [wallet, addPermission])

  // pin account to localstorage
  useMemo((): void => {
    if (isMounted) {
      window.localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify({ account: state.account }))
    }
  }, [isMounted, state.account])

  // pin data to cookie
  useMemo((): void => {
    if (isMounted) {
      Cookies.set(
        COOKIE_NAME,
        formatCookie({
          address: state.address,
          permission: state.permission,
          team: state.team
        }),
        {
          expires: 365 * 10,
          secure: process.env.ENVIRONMENT === 'development' ? false : true
        }
      )
    }
  }, [isMounted, state.address, state.permission, state.team])

  return null
}
