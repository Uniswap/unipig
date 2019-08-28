import App from 'next/app'
import { ThemeProvider as SCThemeProvider, createGlobalStyle } from 'styled-components'

import { getCookie, redirect } from '../utils'
import CookieContext, { Updater as CookieContextUpdater } from '../contexts/Cookie'
import Layout from '../components/Layout'

const BLACK = '#000000'
const WHITE = '#FFFFFF'
const PINK = '#DC6BE5'

const theme = {
  colors: {
    black: BLACK,
    white: WHITE,
    textColor: BLACK,
    backgroundColor: WHITE,
    pink: PINK
  }
}

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    outline-width: thin;
  }

  html {
    font-family: 'Roboto', sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-overflow-scrolling: touch;
  }
`

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx: context }) {
    const { req, res, pathname } = context
    const serverSide = !!req && !!res
    const cookie = getCookie(serverSide, context)

    // on the server, if a mnemonic or team doesn't exist, and we're not rendering /splash, we _have_ to redirect
    // note: we don't protect against non-existence in client-side nav because our implementation guarantees it
    if (serverSide && (!cookie.mnemonic || !cookie.team) && pathname !== '/splash') {
      redirect('/splash', res)
      return
    }

    const mnemonic = cookie.mnemonic
    const team = cookie.team

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(context) : {}

    return {
      mnemonic,
      team,
      ...pageProps
    }
  }

  render() {
    const { mnemonic, team, Component, pageProps } = this.props

    return (
      <>
        <title>Unipig Exchange</title>
        <CookieContext mnemonicInitial={mnemonic} teamInitial={team}>
          <CookieContextUpdater />
          <SCThemeProvider theme={theme}>
            <GlobalStyle />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SCThemeProvider>
        </CookieContext>
      </>
    )
  }
}
