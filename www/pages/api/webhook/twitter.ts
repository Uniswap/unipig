import { NowResponse, NowRequest } from '@now/node'
import crypto from 'crypto'
// import faunadb from 'faunadb'
// import { IncomingMessage, request } from 'http'

// import { TWITTER_BOOSTS, AddressDocument } from '../../../constants'
// import { canFaucet } from '../../../utils'

const secret = process.env.TWITTER_CONSUMER_SECRET
// const addressRegex = new RegExp(/(?<address>0x[0-9a-fA-F]{40})/)

// const client = new faunadb.Client({
//   secret: process.env.FAUNADB_SERVER_SECRET
// })
// const q = faunadb.query

// disbale body parsing to get raw req body
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  // GET which handles CRC token auth
  if (req.method === 'GET') {
    const { query } = req

    console.log(typeof query)
    console.log(query)

    const token = query['crc_token']
    console.log(typeof token)
    console.log(token)
    if (!token) {
      return res.status(400).send('')
    }

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(token as string, 'utf8')
      .digest('base64')

    console.log(typeof hmac)
    console.log(hmac)

    // eslint-disable-next-line @typescript-eslint/camelcase
    const resBody = { res_token: `sha256=${hmac}` }
    const resBodyFormatted = JSON.stringify(resBody)
    return res.status(200).json(resBodyFormatted)
  } else if (req.method === 'POST') {
    // POST with incoming twitter activity
    const twitterSignature = req.headers['x-twitter-webhooks-signature']
    console.log(typeof twitterSignature)
    console.log(twitterSignature)

    const body: string = await new Promise((resolve: (body: string) => void): void => {
      let body = ''
      req.on('data', (chunk: Buffer): void => {
        console.log(typeof chunk)
        console.log(chunk)
        body += chunk
      })

      req.on('end', (): void => {
        resolve(body)
      })
    })

    console.log(typeof body)
    console.log(body)

    return res.status(200).send('')
  } else {
    // unsupported method
    return res.status(400).send('')
  }

  // else {
  //   const { body } = req

  //   // ignore non-mentions
  //   if (!body.tweet_create_events) {
  //     console.log('Ignoring unmatched activity.')
  //     return res.status(200).send('')
  //   }

  //   // get the first tweet and parse
  //   const tweetObject = body.tweet_create_events[0]
  //   const userHandle = tweetObject.user.screen_name
  //   const userId = tweetObject.user.id
  //   const matchedAddress =
  //     tweetObject.extended_tweet.full_text.match(addressRegex) &&
  //     tweetObject.extended_tweet.full_text.match(addressRegex).groups.address

  //   console.log(`Begin parsing tweet '${tweetObject.extended_tweet.full_text}' by ${userHandle} (${userId}).`)

  //   // if account is too new return error
  //   const now = Date.now()
  //   const creationWindow = 1000 * 60 * 60 * 24 * 2 // 2 days
  //   const accountCreated = new Date(tweetObject.user.created_at).getTime()
  //   if (accountCreated + creationWindow >= now) {
  //     const errorString = `Account ${userHandle} is too new.`
  //     console.error(errorString)
  //     return res.status(400).json({ message: errorString })
  //   }

  //   // if there wasn't an address in the tweet return error
  //   if (!matchedAddress) {
  //     const errorString = `Tweet does not contain a valid Ethereum address.`
  //     console.error(errorString)
  //     return res.status(400).json({ message: errorString })
  //   }

  //   console.log(`Parsed Ethereum address ${matchedAddress}.`)

  //   try {
  //     // ensure that the address exists in our db
  //     const addressRef: any = await client.query(q.Paginate(q.Match(q.Index('by-address_addresses'), matchedAddress)))
  //     if (addressRef.data.length === 0) {
  //       const errorString = `Address ${matchedAddress} is not recognized.`
  //       console.error(errorString)
  //       return res.status(400).json({ message: errorString })
  //     }

  //     // ensure that the address hasn't used the faucet recently
  //     const addressData: any = await client.query(addressRef.data.map((ref: any): any => q.Get(ref)))
  //     const addressDocument: AddressDocument = addressData[0].data
  //     if (!canFaucet(addressDocument)) {
  //       const errorString = `Address ${matchedAddress} cannot faucet yet.`
  //       console.error(errorString)
  //       return res.status(400).json({ message: errorString })
  //     }

  //     // ensure that if the twitter id exists in our db, it isn't timed out
  //     const idRef: any = await client.query(q.Paginate(q.Match(q.Index('by-id_addresses'), userId)))
  //     if (idRef.data.length > 0) {
  //       const idData: any = await client.query(idRef.data.map((ref: any): any => q.Get(ref)))
  //       const idDocument: AddressDocument = idData[0].data

  //       if (!canFaucet(idDocument)) {
  //         const errorString = `Account ${userHandle} (${userId}) cannot faucet yet.`
  //         console.error(errorString)
  //         return res.status(400).json({ message: errorString })
  //       }
  //       // update the db to ensure uniqueness
  //       else {
  //         await client.query(
  //           q.Update(q.Ref(q.Collection('addresses'), idRef.data[0].id), {
  //             data: {
  //               twitterHandle: null,
  //               twitterId: null
  //             }
  //           })
  //         )
  //       }
  //     }

  //     // faucet here

  //     // all has gone well, update db
  //     await client.query(
  //       q.Update(q.Ref(q.Collection('addresses'), addressRef.data[0].id), {
  //         data: {
  //           twitterHandle: userHandle,
  //           twitterId: userId,
  //           lastTwitterFaucet: now,
  //           ...(addressDocument.lastTwitterFaucet === 0 ? { boostsLeft: TWITTER_BOOSTS } : {})
  //         }
  //       })
  //     )

  //     return res.status(200).send('')
  //   } catch (error) {
  //     console.error(error)
  //     return res.status(500).send('An unknown error occurred.')
  //   }
  // }
}
