import Router from 'next/router'
import Cookies from 'js-cookie'
import nextCookies from 'next-cookies'

import { COOKIE_NAME, Cookie } from '../constants'

function redirectServer(to: string, res: any): void {
  res.writeHead(302, { Location: to })
  res.end()
}

function redirectClient(to: string): void {
  Router.push(to)
}

export function redirect(to: string, res: any): void {
  res ? redirectServer(to, res) : redirectClient(to)
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

export function getCookie(serverSide: boolean, context: any): Cookie | object {
  return parseCookie(serverSide ? getCookieServer(context) : getCookieClient())
}
