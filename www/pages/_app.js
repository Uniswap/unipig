import App from 'next/app'
import Head from 'next/head'
import { ThemeProvider as SCThemeProvider, createGlobalStyle, css } from 'styled-components'
import { darken, rgba } from 'polished'

import { getCookie } from '../utils'
import CookieContext, { Updater as CookieContextUpdater } from '../contexts/Cookie'
import Layout from '../components/Layout'

const BLACK = '#000000'
const WHITE = '#FFFFFF'

const GRADIENT_LEFT = '#FE6DDE'
const GRADIENT_RIGHT = '#FE6D6D'
const GRADIENT_BACKGROUND = css`
  background: linear-gradient(45deg, ${GRADIENT_LEFT}, ${GRADIENT_RIGHT});
`

const TRANSPARENT = rgba(0, 0, 0, 0)
const TRANSPARENT_BACKGROUND = css`
  background: ${TRANSPARENT};
`

const COLOR_BACKGROUND = color => css`
  background: ${color};
`

const UNISWAP = '#DC6BE5'
const PLASMA_GROUP = '#CE2039'

const UNI = '#DC6BE5'
const PIG = '#FAC4B6'

const theme = {
  colors: {
    black: BLACK,
    white: WHITE,
    greys: Array.from(Array(10).keys()).reduce(
      (accumulator, currentValue) => Object.assign({ [currentValue]: darken(currentValue / 10, WHITE) }, accumulator),
      {}
    ),
    textColor: BLACK,
    backgroundColor: WHITE,
    uniswap: UNISWAP,
    plasmaGroup: PLASMA_GROUP,
    UNI,
    PIG,
    gradientLeft: GRADIENT_LEFT,
    gradientRight: GRADIENT_RIGHT,
    transparent: TRANSPARENT
  },
  gradientBackground: GRADIENT_BACKGROUND,
  transparentBackground: TRANSPARENT_BACKGROUND,
  colorBackground: COLOR_BACKGROUND
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
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.greys[8]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-overflow-scrolling: touch;
  }
`

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx: context }) {
    const { res } = context
    const serverSide = !!res

    const cookie = getCookie(serverSide, context)
    const { mnemonic, team } = cookie

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(context) : {}

    return {
      mnemonic,
      team,
      pageProps
    }
  }

  render() {
    const { mnemonic, team, Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>Unipig Exchange</title>
        </Head>
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
