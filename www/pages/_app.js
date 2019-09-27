import { useState, useEffect, useCallback } from 'react'
import App from 'next/app'
import Head from 'next/head'
import { UNISWAP_ADDRESS } from '@pigi/wallet'
import fetch from 'isomorphic-unfetch'
import { createMuiTheme } from '@material-ui/core/styles'
import { StylesProvider, ThemeProvider as MUIThemeProvider } from '@material-ui/styles'
import { ThemeProvider as SCThemeProvider, createGlobalStyle, css } from 'styled-components'
import { darken } from 'polished'

import { getCookie, getHost, swap, send } from '../utils'
import ClientContext, {
  Team,
  Updater as ClientContextUpdater,
  useWallet,
  useOVMWallet,
  useOVMBalances
} from '../contexts/Client'
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
    success: '#27AE60',
    link: '#2F80ED',

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

async function getAddressData(address, permission, req) {
  return await fetch(`${getHost(req)}/api/get-address-data`, {
    method: 'POST',
    body: JSON.stringify({ address, signature: permission })
  }).then(async response => {
    if (!response.ok) {
      throw Error(`${response.status} Error: ${response.statusText}`)
    }

    return await response.json()
  })
}

function AppStateWrapper({ address, permission, team, addressData, Component, pageProps }) {
  const [walletModalIsOpen, setWalletModalIsOpen] = useState(false)

  // slight hack to reset wallet modal openness across pages
  useEffect(() => {
    return () => {
      setWalletModalIsOpen(false)
    }
  }, [Component])

  // set up ability to update address data
  const [updatedAddressData, setUpdatedAddressData] = useState()
  const [updater, setUpdater] = useState(0)
  useEffect(() => {
    if (address && permission) {
      let stale

      getAddressData(address, permission).then(data => {
        if (!stale) {
          setUpdatedAddressData(data)
        }
      })

      return () => {
        stale = true
      }
    }
  }, [updater, address, permission])
  const updateAddressData = useCallback(() => {
    setUpdater(updater => updater + 1)
  }, [])

  const wallet = useWallet()
  const OVMWallet = useOVMWallet(wallet)
  const [OVMReserves, updateOVMReserves] = useOVMBalances(OVMWallet, UNISWAP_ADDRESS, 4 * 1000)
  const [OVMBalances, updateOVMBalances] = useOVMBalances(OVMWallet, wallet && wallet.address, 4 * 1000)

  async function OVMSwap(inputToken, inputAmount) {
    await swap(OVMWallet, wallet.address, inputToken, inputAmount)
  }

  async function OVMSend(to, token, amount) {
    await send(OVMWallet, wallet.address, to, token, amount)
  }

  return (
    <Layout
      wallet={wallet}
      team={team}
      addressData={updatedAddressData || addressData}
      updateAddressData={updateAddressData}
      OVMBalances={OVMBalances}
      updateOVMBalances={updateOVMBalances}
      walletModalIsOpen={walletModalIsOpen}
      setWalletModalIsOpen={setWalletModalIsOpen}
    >
      <Component
        wallet={wallet}
        team={team}
        addressData={updatedAddressData || addressData}
        updateAddressData={updateAddressData}
        OVMReserves={OVMReserves}
        updateOVMReserves={updateOVMReserves}
        OVMBalances={OVMBalances}
        updateOVMBalances={updateOVMBalances}
        OVMSwap={OVMSwap}
        OVMSend={OVMSend}
        setWalletModalIsOpen={setWalletModalIsOpen}
        {...pageProps}
      />
    </Layout>
  )
}

// https://github.com/MarchWorks/nextjs-with-material-ui-and-styled-components
// https://stackoverflow.com/questions/55109497/how-to-integrate-nextjs-styled-components-with-material-ui
export default class MyApp extends App {
  static async getInitialProps({ Component, ctx: context }) {
    const { req, res, pathname } = context
    const serverSide = !!req && !!res

    const cookie = getCookie(serverSide, context)
    const { address, permission, team } = cookie

    // redirect all requests without any cookie data to '/welcome'
    if (!address && !team && pathname !== '/welcome') {
      res.writeHead(302, { Location: '/welcome' })
      res.end()
      return {}
    }

    // redirect all requests without address cookie data to '/welcome'
    if (!address && pathname !== '/welcome') {
      res.writeHead(302, { Location: '/welcome' })
      res.end()
      return {}
    }

    // redirect all requests without team cookie data conditionally to either '/join-team' or '/welcome'
    if (!team && !(pathname === '/welcome' || pathname === '/join-team')) {
      res.writeHead(302, { Location: address ? '/join-team' : '/welcome' })
      res.end()
      return {}
    }

    const { addressData: fetchAddressData, ...pageProps } = Component.getInitialProps
      ? await Component.getInitialProps(context)
      : {}

    // fetch address data if it was requested
    const addressData = fetchAddressData && address && permission ? await getAddressData(address, permission, req) : {}

    return {
      address,
      permission,
      team,
      addressData,
      pageProps
    }
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { address, permission, team, addressData, Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>Unipig Exchange</title>
        </Head>
        <SCThemeProvider theme={SCTheme}>
          <GlobalStyle />
          <StylesProvider injectFirst>
            <MUIThemeProvider theme={MUITheme}>
              <ClientContext addressInitial={address} permissionInitial={permission} teamInitial={team}>
                <ClientContextUpdater />
                <AppStateWrapper
                  address={address}
                  permission={permission}
                  team={team}
                  addressData={addressData}
                  Component={Component}
                  pageProps={pageProps}
                />
              </ClientContext>
            </MUIThemeProvider>
          </StylesProvider>
        </SCThemeProvider>
      </>
    )
  }
}
