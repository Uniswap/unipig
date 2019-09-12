import { NowRequest, NowResponse } from '@now/node'
import faunadb from 'faunadb'

import { AddressDocument } from '../../constants'

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  const { body } = req
  const { address } = JSON.parse(body || JSON.stringify({}))

  if (!address) {
    return res.status(400).send('')
  }

  try {
    const addressRef: any = await client.query(q.Paginate(q.Match(q.Index('by-address_addresses'), address)))
    if (addressRef.data.length === 0) {
      return res.status(401).send('')
    } else {
      const addressData = await client.query(addressRef.data.map((ref: any): any => q.Get(ref)))
      const addressDocument: AddressDocument = addressData[0].data
      return res.status(addressDocument.paperWallet ? 200 : 401).send('')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send('An unknown error occurred.')
  }
}
