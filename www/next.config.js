/* eslint-disable @typescript-eslint/no-var-requires */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => ({
  env: {
    ENVIRONMENT: phase === PHASE_DEVELOPMENT_SERVER ? 'development' : 'production',
    AGGREGATOR_URL: process.env.AGGREGATOR_URL
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = { ...(config.node || {}), fs: 'empty', net: 'empty' }
    }

    config.externals = [...(config.externals || []), ...['express']]

    return config
  },
  target: 'serverless'
})
