import App from 'next/app'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import { Wallet } from '@ethersproject/wallet'
import { createMuiTheme } from '@material-ui/core/styles'
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles'
import { ThemeProvider as SCThemeProvider, createGlobalStyle, css } from 'styled-components'
import { darken } from 'polished'

import { getCookie, getHost, getPermissionString } from '../utils'
import CookieContext, { Team, Updater as CookieContextUpdater } from '../contexts/Cookie'
import Layout from '../components/Layout'

const BLACK = '#000000'
const WHITE = '#FFFFFF'

const GRADIENT_LEFT = '#FE6DDE'
const GRADIENT_RIGHT = '#FE6D6D'
const GRADIENT_BACKGROUND = css`
  background: linear-gradient(45deg, ${GRADIENT_LEFT}, ${GRADIENT_RIGHT});
`

const UNI = '#DC6BE5'
const PIGI = '#FAC4B6'

const SCTheme = {
  colors: {
    black: BLACK,
    white: WHITE,
    greys: Array.from(Array(10).keys()).reduce(
      (accumulator, currentValue) => Object.assign({ [currentValue]: darken(currentValue / 10, WHITE) }, accumulator),
      {}
    ),

    error: '#FF9494',

    textColor: WHITE,
    backgroundColor: BLACK,

    uniswap: '#DC6BE5',
    plasmaGroup: '#CE2039',

    [Team.UNI]: UNI,
    [Team.PIGI]: PIGI,

    gradientLeft: GRADIENT_LEFT,
    gradientRight: GRADIENT_RIGHT
  },

  gradientBackground: GRADIENT_BACKGROUND
}

const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  @import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');
  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }
  }

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
    outline-color: ${({ theme }) => theme.colors.white};
  }

  html {
    font-family: 'Inter', sans-serif;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.greys[9]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-overflow-scrolling: touch;
  }
`

const MUITheme = createMuiTheme({
  typography: {
    fontFamily: "'Inter', sans-serif"
  },
  palette: {
    primary: {
      main: UNI
    },
    secondary: {
      main: PIGI
    }
  }
})

// https://github.com/MarchWorks/nextjs-with-material-ui-and-styled-components
// https://stackoverflow.com/questions/55109497/how-to-integrate-nextjs-styled-components-with-material-ui
export default class MyApp extends App {
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  static async getInitialProps({ Component, ctx: context }) {
    const { req, res, pathname } = context
    const serverSide = !!req && !!res

    const cookie = getCookie(serverSide, context)
    const { mnemonic, team } = cookie

    // redirect all requests without any cookie data to '/welcome'
    if (!mnemonic && !team && pathname !== '/welcome') {
      res.writeHead(302, { Location: '/welcome' })
      res.end()
      return {}
    }

    // redirect all requests without mnemonic cookie data to '/welcome'
    if (!mnemonic && pathname !== '/welcome') {
      res.writeHead(302, { Location: '/welcome' })
      res.end()
      return {}
    }

    // redirect all requests without team cookie data to '/join-team' or '/welcome'
    if (!team && !(pathname === '/welcome' || pathname === '/join-team')) {
      res.writeHead(302, { Location: mnemonic ? '/join-team' : '/welcome' })
      res.end()
      return {}
    }

    const wallet = mnemonic ? Wallet.fromMnemonic(mnemonic) : null

    // if a wallet exists, fetch server data
    let augmentedAddressDocument = null
    if (wallet) {
      const permission = getPermissionString(wallet.address)
      const signature = await wallet.signMessage(permission.permissionString)
      augmentedAddressDocument = await fetch(`${getHost(req)}/api/get-address-data`, {
        method: 'POST',
        body: JSON.stringify({ address: wallet.address, time: permission.time, signature })
      })
        .then(async response => {
          if (!response.ok) {
            throw Error(`${response.status} Error: ${response.statusText}`)
          }

          return await response.json()
        })
        .catch(error => {
          console.error(error)
          throw error
        })
    }

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(context) : {}

    return {
      mnemonic,
      team,
      augmentedAddressDocument,
      pageProps
    }
  }

  render() {
    const { mnemonic, team, augmentedAddressDocument, Component, pageProps } = this.props

    const wallet = mnemonic ? Wallet.fromMnemonic(mnemonic) : null

    return (
      <>
        <Head>
          <title>Unipig Exchange</title>
        </Head>
        <CookieContext mnemonicInitial={mnemonic} teamInitial={team}>
          <CookieContextUpdater />
          <SCThemeProvider theme={SCTheme}>
            <GlobalStyle />
            <StylesProvider injectFirst>
              <MUIThemeProvider theme={MUITheme}>
                <Layout wallet={wallet} team={team}>
                  <Component {...pageProps} wallet={wallet} team={team} addressData={augmentedAddressDocument} />
                </Layout>
              </MUIThemeProvider>
            </StylesProvider>
          </SCThemeProvider>
        </CookieContext>
      </>
    )
  }
}
