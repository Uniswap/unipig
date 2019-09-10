import Cookies from 'js-cookie'
import nextCookies from 'next-cookies'
import { verifyMessage } from '@ethersproject/wallet'

import { COOKIE_NAME } from '../contexts/Cookie'
import { SIGNATURE_TIMEOUT } from '../constants'

interface PermissionString {
  time: number
  permissionString: string
}

export function getPermissionString(address: string, time?: number): PermissionString {
  const now = Date.now()
  const permissionString = `Proof of ownership over ${address} for unipig.exchange at ${time || now}.`

  return {
    time: now,
    permissionString
  }
}

export function validatePermissionString(address: string, time: number, signature: string): boolean {
  const now = Date.now()
  const permissionString = getPermissionString(address, time).permissionString

  const signingAddress = verifyMessage(permissionString, signature)

  return signingAddress === address && time + SIGNATURE_TIMEOUT > now
}

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

// from https://github.com/zeit/next.js/blob/canary/examples/with-cookie-auth/utils/get-host.js
// This is not production ready, (except with providers that ensure a secure host, like Now)
// For production consider the usage of environment variables and NODE_ENV
export function getHost(req: any): string {
  if (!req) {
    return ''
  }

  const { host } = req.headers

  if (host.startsWith('localhost')) {
    return `http://${host}`
  }

  return `https://${host}`
}
