import { NowResponse, NowRequest } from '@now/node'
import crypto from 'crypto'
import faunadb from 'faunadb'

import { UNIPIG_TWITTER_ID, TWITTER_BOOSTS, AddressDocument } from '../../../constants'
import { canFaucet } from '../../../utils'

const secret = process.env.TWITTER_CONSUMER_SECRET
const addressRegex = new RegExp(/(?<address>0x[0-9a-fA-F]{40})/)

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

// disable body parsing to get raw req body
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  // GET which handles CRC token auth
  if (req.method === 'GET') {
    const { query } = req

    const token = query['crc_token']
    if (!token) {
      return res.status(400).send('')
    }

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(token as string, 'utf8')
      .digest('base64')

    // eslint-disable-next-line @typescript-eslint/camelcase
    return res.status(200).json(JSON.stringify({ response_token: `sha256=${hmac}` }))
  }
  // POST with incoming twitter activity
  else if (req.method === 'POST') {
    const twitterSignature = req.headers['x-twitter-webhooks-signature']

    const rawBody: Buffer = await new Promise((resolve: (rawBody: Buffer) => void): void => {
      let rawBodyArray: Buffer[] = []

      req.on('data', (chunk: Buffer): void => {
        rawBodyArray.push(chunk)
      })

      req.on('end', (): void => {
        resolve(Buffer.concat(rawBodyArray))
      })
    })

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64')

    if (`sha256=${hmac}` !== twitterSignature) {
      const errorString = 'Unauthorized request.'
      console.error(errorString)
      return res.status(401).send(errorString)
    }

    const body = JSON.parse(rawBody.toString())

    // ignore non-tweets
    if (!body.tweet_create_events) {
      return res.status(200).send('')
    }

    // get the first tweet and parse
    const tweetObject = body.tweet_create_events[0]
    const userHandle = tweetObject.user.screen_name
    const userId = tweetObject.user.id
    console.log(`Begin parsing tweet '${tweetObject.extended_tweet.full_text}' by ${userHandle} (${userId}).`)
    const matchedAddress =
      tweetObject.extended_tweet.full_text.match(addressRegex) &&
      tweetObject.extended_tweet.full_text.match(addressRegex).groups.address

    // ignore non-supported tweet types
    if (
      userId === UNIPIG_TWITTER_ID ||
      tweetObject.retweeted_status ||
      tweetObject.in_reply_to_status_id ||
      tweetObject.quoted_status_id
    ) {
      return res.status(200).send('')
    }

    // if account is too new return error
    const now = Date.now()
    const creationWindow = 1000 * 60 * 60 * 24 * 2 // 2 days
    const accountCreated = new Date(tweetObject.user.created_at).getTime()
    if (accountCreated + creationWindow >= now) {
      console.error('Account is too new.')
      return res.status(200).send('')
    }

    // if there wasn't an address in the tweet return error
    if (!matchedAddress) {
      console.error('Tweet does not contain a valid Ethereum address.')
      return res.status(200).send('')
    }

    // begin DB logic
    try {
      // ensure that the address exists in our db
      const addressData: any = await client.query(
        q.Map(q.Paginate(q.Match(q.Index('by-address_addresses'), matchedAddress)), (ref): any => q.Get(ref))
      )
      if (addressData.data.length === 0) {
        console.error(`Address ${matchedAddress} is not recognized.`)
        return res.status(200).send('')
      }

      // ensure that the address hasn't used the faucet recently
      const addressDocument: AddressDocument = addressData.data[0].data
      if (!canFaucet(addressDocument)) {
        console.error(`Address ${matchedAddress} cannot faucet yet.`)
        return res.status(200).send('')
      }

      // ensure that if the twitter id exists in our db, it hasn't used the faucet recently
      const idData: any = await client.query(
        q.Map(q.Paginate(q.Match(q.Index('by-id_addresses'), userId)), (ref): any => q.Get(ref))
      )
      if (idData.data.length > 0) {
        const idDocument: AddressDocument = idData.data[0].data

        if (!canFaucet(idDocument)) {
          console.error(`Account ${userHandle} (${userId}) cannot faucet yet.`)
          return res.status(200).send('')
        }
        // update the db to ensure uniqueness
        else {
          await client.query(
            q.Update(q.Ref(q.Collection('addresses'), idData.data[0].id), {
              data: {
                twitterHandle: null,
                twitterId: null
              }
            })
          )
        }
      }

      // faucet
      // await unipigWallet.rollup.requestFaucetFunds(matchedAddress, 10)

      // all has gone well, update db
      await client.query(
        q.Update(q.Ref(q.Collection('addresses'), addressData.data[0].id), {
          data: {
            twitterHandle: userHandle,
            twitterId: userId,
            lastTwitterFaucet: now,
            ...(addressDocument.lastTwitterFaucet === 0 ? { boostsLeft: TWITTER_BOOSTS } : {})
          }
        })
      )

      return res.status(200).send('')
    } catch (error) {
      console.error(error)
      return res.status(500).send('An unknown error occurred.')
    }
  }
  // unsupported method
  else {
    return res.status(400).send('')
  }
}
