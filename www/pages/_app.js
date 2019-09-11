import App from 'next/app'
import Head from 'next/head'
import { StylesProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MUIThemeProvider } from '@material-ui/styles'
import { ThemeProvider as SCThemeProvider, createGlobalStyle, css } from 'styled-components'
import { darken } from 'polished'

import { getCookie } from '../utils'
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
const PIG = '#FAC4B6'

const theme = {
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
    [Team.PIG]: PIG,

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

const defaultMUITheme = createMuiTheme({
  typography: {
    fontFamily: "'Inter', sans-serif"
  },
  palette: {
    primary: {
      main: UNI
    },
    secondary: {
      main: PIG
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
    const { res, pathname } = context
    const serverSide = !!res

    const cookie = getCookie(serverSide, context)
    const { source, mnemonic, team } = cookie

    // on the server...
    if (serverSide) {
      // redirect all requests without source/mnemonic cookies that aren't on '/welcome' to '/welcome'
      if ((!source || !mnemonic) && pathname !== '/welcome') {
        res.writeHead(302, { Location: '/welcome' })
        res.end()
        return {}
      }

      // redirect all requests without team cookies that aren't on '/welcome' or '/join-team' to '/welcome'
      if (!team && !(pathname === '/welcome' || pathname === '/join-team')) {
        res.writeHead(302, { Location: source && mnemonic ? '/join-team' : '/welcome' })
        res.end()
        return {}
      }
    }

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(context) : {}

    return {
      source,
      mnemonic,
      team,
      pageProps
    }
  }

  render() {
    const { source, mnemonic, team, Component, pageProps } = this.props

    return (
      <>
        <StylesProvider injectFirst>
          <Head>
            <title>Unipig Exchange</title>
          </Head>
          <CookieContext sourceInitial={source} mnemonicInitial={mnemonic} teamInitial={team}>
            <CookieContextUpdater />
            <MUIThemeProvider theme={defaultMUITheme}>
              <SCThemeProvider theme={theme}>
                <GlobalStyle />
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SCThemeProvider>
            </MUIThemeProvider>
          </CookieContext>
        </StylesProvider>
      </>
    )
  }
}
