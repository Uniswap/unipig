import { NowResponse, NowRequest } from '@now/node'
import crypto from 'crypto'
import faunadb from 'faunadb'
import { Wallet } from '@ethersproject/wallet'
import { getAddress } from '@ethersproject/address'

import { UNIPIG_TWITTER_ID, TWITTER_BOOSTS, AddressDocument } from '../../../constants'
import { canFaucet, getFaucetData, faucet, timeoutPromise } from '../../../utils'

const secret = process.env.TWITTER_CONSUMER_SECRET
const addressRegex = new RegExp(/(0x[0-9a-fA-F]{40})/g)

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

const creationWindow = 1000 * 60 * 60 * 24 * 4 // 4 days

// define helper to update twitter errors
async function addTwitterError(errorString: string, refID: any): Promise<void> {
  try {
    await client.query(
      q.Update(q.Ref(q.Collection('addresses'), refID), {
        data: {
          twitterFaucetError: errorString
        }
      })
    )
  } catch (error) {
    console.error(error)
  }
}

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
    const userId = tweetObject.user.id
    const userHandle = tweetObject.user.screen_name
    const accountCreated = new Date(tweetObject.user.created_at).getTime()
    const tweetText = tweetObject.extended_tweet ? tweetObject.extended_tweet.full_text : tweetObject.text
    const matchedAddress = tweetText.match(addressRegex) ? getAddress(tweetText.match(addressRegex)[0]) : null

    console.log(`Begin processing tweet '${tweetText}' from @${userHandle} (${userId}) with address ${matchedAddress}.`)

    // ignore non-supported/invalid tweet types
    if (
      tweetObject.retweeted_status ||
      tweetObject.in_reply_to_status_id ||
      tweetObject.quoted_status_id ||
      userId === UNIPIG_TWITTER_ID ||
      !matchedAddress
    ) {
      return res.status(200).send('')
    }

    // begin DB logic
    try {
      // get the db document by address
      const addressData: any = await client.query(
        q.Map(q.Paginate(q.Match(q.Index('by-address_addresses'), matchedAddress)), (ref): any => q.Get(ref))
      )

      // if the address doesn't exist, yell
      if (addressData.data.length === 0) {
        console.error(`Address does not exist in our database.`)
        return res.status(200).send('')
      }

      // wrap our logger
      const logErrorToDB = async (errorString: string): Promise<void> => {
        await addTwitterError(errorString, addressData.data[0].ref.id)
      }

      // if account is too new return error
      const now = Date.now()
      if (accountCreated + creationWindow >= now) {
        console.error(`Twitter account is too new.`)
        logErrorToDB('Your Twitter account is too new.')
        return res.status(200).send('')
      }

      // ensure that the address hasn't used the faucet recently
      const addressDocument: AddressDocument = addressData.data[0].data
      if (!canFaucet(addressDocument)) {
        console.error(`Address cannot faucet yet.`)
        logErrorToDB('You used the faucet with this address recently.')
        return res.status(200).send('')
      }

      // ensure that if the twitter id exists in our db, it hasn't used the faucet recently
      const idData: any = await client.query(
        q.Map(q.Paginate(q.Match(q.Index('by-id_addresses'), userId)), (ref): any => q.Get(ref))
      )
      if (idData.data.length > 0) {
        const idDocument: AddressDocument = idData.data[0].data

        if (!canFaucet(idDocument)) {
          console.error(`Twitter account cannot faucet yet.`)
          logErrorToDB('You used the faucet with this Twitter account recently.')
          return res.status(200).send('')
        }
      }

      // faucet
      let faucetError = false
      try {
        const faucetWallet = new Wallet(process.env.FAUCET_PRIVATE_KEY)
        const signature = await faucetWallet.signMessage(getFaucetData(matchedAddress))
        await timeoutPromise(faucet(matchedAddress, signature))
      } catch (error) {
        console.error(error)
        faucetError = true
      }

      if (faucetError) {
        logErrorToDB('The faucet is temporarily offline. Try again soon!')
        return res.status(500).send('An unknown error occurred.')
      } else {
        // ensure if the twitter id was previously associated with an account, it gets removed to ensure uniqueness
        if (idData.data.length > 0) {
          await client.query(
            q.Update(q.Ref(q.Collection('addresses'), idData.data[0].ref.id), {
              data: {
                twitterHandle: null,
                twitterId: null,
                twitterFaucetError: null
              }
            })
          )
        }

        // update the address account with this faucet
        await client.query(
          q.Update(q.Ref(q.Collection('addresses'), addressData.data[0].ref.id), {
            data: {
              twitterHandle: userHandle,
              twitterId: userId,
              lastTwitterFaucet: now,
              twitterFaucetError: null,
              ...(addressDocument.lastTwitterFaucet === 0 ? { boostsLeft: TWITTER_BOOSTS } : {})
            }
          })
        )

        return res.status(200).send('')
      }
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
