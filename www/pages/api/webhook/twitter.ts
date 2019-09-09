import { NowRequest, NowResponse } from '@now/node'
import console = require('console')
const crypto = require('crypto')

export default function(request: NowRequest, response: NowResponse): NowResponse {
  // CRC token auth handling
  if (request.method === 'GET') {
    if (request.query['crc_token']) {
      let secret = process.env.customsecretkey
      let token = request.query['crc_token']
      var hmac = crypto
        .createHmac('sha256', secret)
        .update(token)
        .digest('base64')
      const resBody = {
        response_token: 'sha256=' + hmac
      }
      const resFormatted = JSON.stringify(resBody)
      return response.status(200).json(resFormatted)
    }
    return response.status(400)
  }

  // POST with incoming twitter activity
  else {
    console.log('RECIEVED UPDATE @UNIPIGEXCHANGE')

    // not not a valid tweet event, ignore
    if (!request.body.tweet_create_events) {
      console.log('Error - invalid info on request ')
      return response.status(400).json({ message: 'Invalid tweet event' })
    }

    // Parse for user address and set username
    const tweetObject = request.body.tweet_create_events[0] // first tweet included

    // if account is too new return error
    let now = new Date()

    let creationWindow = 86400000 * 2 // two days

    let accountCreated = new Date(tweetObject.user.created_at)

    if (now.getTime() - accountCreated.getTime() < creationWindow) {
      console.log('Error - account is too new to get tokens')
      return response.status(400).json({ message: 'Account is too new' })
    }

    // parse tweet for info and check db
    const pattern = 'address:(.*)'

    let address = null

    if (tweetObject.text.match(pattern)) {
      address = tweetObject.text.match(pattern)[1]
    }

    console.log('Address: ' + address)

    const userHandle = tweetObject.user.screen_name

    console.log('Hanlde: ' + userHandle)

    // check db for existing address

    // if exists - check timestamp and handle (update if needed) - send faucet if valid

    console.log('Success')
    return response.status(200).json({ message: JSON.stringify(request.body.text) })
  }
}
