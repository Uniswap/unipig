import { NowRequest, NowResponse } from '@now/node'
import crypto from 'crypto'

const secret = process.env.TWITTER_CONSUMER_SECRET
const addressRegex = new RegExp(/(?<address>0x[0-9a-fA-f]{40})/)

export default function(request: NowRequest, response: NowResponse): NowResponse {
  // CRC token auth handling
  if (request.method === 'GET') {
    const { query } = request
    if (query['crc_token']) {
      const token = query['crc_token']
      const hmac = crypto
        .createHmac('sha256', secret)
        .update(token as any)
        .digest('base64')

      // eslint-disable-next-line @typescript-eslint/camelcase
      const resBody = { response_token: `sha256=${hmac}` }
      const resFormatted = JSON.stringify(resBody)
      return response.status(200).json(resFormatted)
    } else {
      return response.status(400).send('')
    }
  }
  // POST with incoming twitter activity
  else {
    const { body } = request

    // ignore non-mentions
    if (!body.tweet_create_events) {
      const errorString = 'Invalid tweet event.'
      console.error(errorString)
      return response.status(400).json({ message: errorString })
    }

    // get the first tweet and parse
    const tweetObject = body.tweet_create_events[0]
    const userHandle = tweetObject.user.screen_name
    const matchedAddress = tweetObject.text.match(addressRegex) && tweetObject.text.match(addressRegex).groups.address

    // if account is too new return error
    const now = Date.now()
    const creationWindow = 1000 * 60 * 60 * 24 * 2 // 2 days
    const accountCreated = new Date(tweetObject.user.created_at).getTime()
    if (accountCreated + creationWindow >= now) {
      const errorString = `Account ${userHandle} is too new.`
      console.error(errorString)
      return response.status(400).json({ message: errorString })
    }

    // if there wasn't an address in the tweet return error
    if (!matchedAddress) {
      const errorString = `Tweet by ${userHandle} does not contain a valid Ethereum address.`
      console.error(errorString)
      return response.status(400).json({ message: errorString })
    }

    console.log(`Parsing tweet by ${userHandle} with Ethereum address ${matchedAddress}.`)
    // check db for existing address
    // if exists - check timestamp and handle (update if needed) - send faucet if valid

    return response.status(200).send('')
  }
}
