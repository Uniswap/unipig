export const FAUCET_TIMEOUT = 1000 * 60 * 60 * 24 * 2 // 2 days in ms

export const TWITTER_BOOSTS = 3

export const UNIPIG_TWITTER_ID = 1169730193260519400

export const DECIMALS = 2

export const FAUCET_AMOUNT = 30 * 10 ** DECIMALS

export const POLL_DURATION = 6 * 1000

export enum WalletSource {
  PAPER = 'PAPER',
  GENERATED = 'GENERATED',
  TWITTER = 'TWITTER'
}

export interface AddressDocument {
  ethereumAddress: string
  paperWallet: boolean
  boostsLeft: number
  lastTwitterFaucet: number
  twitterId?: number
  twitterHandle?: string
  twitterFaucetError?: boolean
}

export interface AugmentedAddressDocument extends AddressDocument {
  addressSource: WalletSource
  canFaucet: boolean
}
