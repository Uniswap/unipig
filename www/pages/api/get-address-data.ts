import { NowRequest, NowResponse } from '@now/node'
import faunadb from 'faunadb'

import { AddressDocument } from '../../constants'
import { validatePermissionString, addressSource, canFaucet } from '../../utils'

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  const { body } = req
  const { address, time, signature } = JSON.parse(body || JSON.stringify({}))

  if (!address || !time || !signature) {
    return res.status(400).send('')
  }

  if (!validatePermissionString(address, time, signature)) {
    return res.status(401).send('')
  }

  try {
    const addressRef: any = await client.query(q.Paginate(q.Match(q.Index('by-address_addresses'), address)))

    // handle new users
    if (addressRef.data.length === 0) {
      const addressDocument: AddressDocument = {
        ethereumAddress: address,
        paperWallet: false,
        lastTwitterFaucet: 0,
        boostsLeft: 0
      }

      await client.query(
        q.Create(q.Collection('addresses'), {
          data: addressDocument
        })
      )
      return res.status(200).json({
        ...addressDocument,
        addressSource: addressSource(addressDocument),
        canFaucet: canFaucet(addressDocument)
      })
    }
    // handle existing users
    else {
      const addressData = await client.query(addressRef.data.map((ref: any): any => q.Get(ref)))
      const addressDocument: AddressDocument = addressData[0].data

      return res.status(200).json({
        ...addressDocument,
        addressSource: addressSource(addressDocument),
        canFaucet: canFaucet(addressDocument)
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send('An unknown error occurred.')
  }
}
