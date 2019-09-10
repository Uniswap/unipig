import { NowRequest, NowResponse } from '@now/node'
import faunadb from 'faunadb'

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  const { body } = req
  const { address } = JSON.parse(body || JSON.stringify({}))

  if (address) {
    const addressRef: any = await client.query(q.Paginate(q.Match(q.Index('by-address_paper-wallets'), address)))
    if (addressRef.data.length === 0) {
      return res.status(401).send('')
    } else {
      return res.status(200).send('')
    }
  } else {
    return res.status(400).send('')
  }
}
