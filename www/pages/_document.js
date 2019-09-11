import { Fragment } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets } from '@material-ui/styles'

// https://github.com/MarchWorks/nextjs-with-material-ui-and-styled-components
// https://stackoverflow.com/questions/55109497/how-to-integrate-nextjs-styled-components-with-material-ui
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const MUISheets = new ServerStyleSheets()
    const SCSheet = new ServerStyleSheet()

    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => SCSheet.collectStyles(MUISheets.collect(<App {...props} />))
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [
          <Fragment key="styles">
            {initialProps.styles}
            {MUISheets.getStyleElement()}
            {SCSheet.getStyleElement()}
          </Fragment>
        ]
      }
    } finally {
      SCSheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
          <meta name="theme-color" content="#FFFFFF" />
          <meta name="Description" content="Unipig Exchange" />
          <link rel="shortcut icon" href="static/favicon.ico" />
          <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
