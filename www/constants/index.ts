export const FAUCET_TIMEOUT = 1000 * 60 * 60 * 24 // 1 day in ms

export const SIGNATURE_TIMEOUT = 1000 * 60 * 60 * 24 // 1 day in ms

export const TWITTER_BOOSTS = 3

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
}

export interface AugmentedAddressDocument extends AddressDocument {
  addressSource: WalletSource
  canFaucet: boolean
}
