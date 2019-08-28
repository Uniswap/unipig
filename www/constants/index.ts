export const COOKIE_NAME = 'UNIPIG'

export enum Team {
  UNI = 1,
  PIG = 2
}

export interface Cookie {
  mnemonic: string
  team: Team
}
