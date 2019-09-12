// eslint-disable-next-line @typescript-eslint/no-var-requires
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  target: 'serverless'
})
