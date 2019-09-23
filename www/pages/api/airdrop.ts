import { NowRequest, NowResponse } from '@now/node'
import faunadb from 'faunadb'
import MemDown from 'memdown'
import { BaseDB, SimpleClient } from '@pigi/core'
import { UnipigWallet } from '@pigi/wallet'

import { AddressDocument } from '../../constants'
import { validatePermissionString } from '../../utils'

const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})
const q = faunadb.query

const HOST = 'localhost'
const PORT = 3001

const db = new BaseDB(MemDown('ovm'))
const unipigWallet = new UnipigWallet(db)
unipigWallet.rollup.connect(new SimpleClient(`http://${HOST}:${PORT}`))

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  const { body } = req
  const { address, time, signature, scannedAddress } = JSON.parse(body || JSON.stringify({}))

  if (!address || !time || !signature) {
    return res.status(400).send('')
  }

  if (address === scannedAddress) {
    return res.status(400).send('')
  }

  if (!validatePermissionString(address, time, signature)) {
    return res.status(401).send('')
  }

  try {
    const addressRef: any = await client.query(q.Paginate(q.Match(q.Index('by-address_addresses'), address)))

    if (addressRef.data.length === 0) {
      return res.status(401).send('')
    }

    const addressData = await client.query(addressRef.data.map((ref: any): any => q.Get(ref)))
    const addressDocument: AddressDocument = addressData[0].data

    if (addressDocument.boostsLeft === 0) {
      return res.status(401).send('')
    }

    // faucet both here
    await Promise.all([
      unipigWallet.rollup.requestFaucetFunds(address, 1000),
      unipigWallet.rollup.requestFaucetFunds(scannedAddress, 1000)
    ])

    // all has gone well, update db
    await client.query(
      q.Update(q.Ref(q.Collection('addresses'), addressRef.data[0].id), {
        data: {
          boostsLeft: addressDocument.boostsLeft - 1
        }
      })
    )

    return res.status(200).send('')
  } catch (error) {
    console.error(error)
    return res.status(500).send('An unknown error occurred.')
  }
}
