export const COOKIE_NAME = 'UNIPIG'

export enum Team {
  Unicorn = 1,
  Pig = 2
}

export interface Cookie {
  mnemonic: string
  team: Team
}
