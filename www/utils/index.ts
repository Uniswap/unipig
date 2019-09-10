import Cookies from 'js-cookie'
import nextCookies from 'next-cookies'

import { COOKIE_NAME } from '../constants'

export function formatCookie(o: object): string {
  const stringified = JSON.stringify(o || {})
  const base64 = Buffer.from(stringified).toString('base64')
  return base64
}

function parseCookie(s: string): object {
  const stringified = Buffer.from(s || '', 'base64').toString()
  const asObject = JSON.parse(stringified || JSON.stringify({}))
  return asObject
}

function getCookieServer(context: any): string {
  return nextCookies(context)[COOKIE_NAME]
}

function getCookieClient(): string {
  return Cookies.get(COOKIE_NAME)
}

export function getCookie(serverSide: boolean, context: any): object {
  return parseCookie(serverSide ? getCookieServer(context) : getCookieClient())
}

export function truncateAddress(address: string, length: number): string {
  return `${address.substring(0, length + 2)}...${address.substring(address.length - length, address.length)}`
}
