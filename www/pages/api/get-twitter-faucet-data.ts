import { NowRequest, NowResponse } from '@now/node'
import faunadb from 'faunadb'

import { FAUCET_TIMEOUT } from '../../constants'
import { validatePermissionString } from '../../utils'

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  const { body } = req
  const { address, time, signature } = JSON.parse(body || JSON.stringify({}))

  if (!validatePermissionString(address, time, signature)) {
    return res.status(401).send('')
  } else {
    if (address) {
      const addressRef: any = await client.query(q.Paginate(q.Match(q.Index('by-address_twitter'), address)))

      // handle new users
      if (addressRef.data.length === 0) {
        const addressData = {
          ethereumAddress: address,
          lastFaucetTime: 0
        }

        await client.query(
          q.Create(q.Collection('twitter'), {
            data: addressData
          })
        )
        return res.status(200).send({ ...addressData, canFaucet: true })
      }
      // handle existing users
      else {
        const addressData: any = await client.query(addressRef.data.map((ref: any): any => q.Get(ref)))

        const canFaucet = addressData[0].data.lastFaucetTime + FAUCET_TIMEOUT < Date.now()

        return res.status(200).json(
          JSON.stringify({
            ...addressData[0].data,
            canFaucet
          })
        )
      }
    } else {
      return res.status(400).send('')
    }
  }
}
