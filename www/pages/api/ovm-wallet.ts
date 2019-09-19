import { NowRequest, NowResponse } from '@now/node'
import MemDown from 'memdown'
import { BaseDB, SimpleClient } from '@pigi/core'
import { UNI_TOKEN_TYPE, PIGI_TOKEN_TYPE, UnipigWallet } from '@pigi/wallet'

import { OVMWalletInteractions } from '../../constants'
import { Team } from '../../contexts/Cookie'

const HOST = 'localhost'
const PORT = 3001

const db = new BaseDB(MemDown('ovm'))
const unipigWallet = new UnipigWallet(db)
unipigWallet.rollup.connect(new SimpleClient(`http://${HOST}:${PORT}`))

export default async function(req: NowRequest, res: NowResponse): Promise<NowResponse> {
  const { body } = req
  const { interactionType, address, inputToken, inputAmount, recipient } = JSON.parse(body || JSON.stringify({}))

  if (!interactionType) {
    return res.status(400).send('')
  }

  try {
    switch (interactionType) {
      case OVMWalletInteractions.RESERVES: {
        const balances = await unipigWallet.rollup.getUniswapBalances()
        return res.status(200).json({ [Team.UNI]: balances.uni, [Team.PIGI]: balances.pigi })
      }
      case OVMWalletInteractions.BALANCES: {
        if (!address) {
          return res.status(400).send('')
        }
        const balances = await unipigWallet.rollup.getBalances(address)
        return res.status(200).json({ [Team.UNI]: balances.uni, [Team.PIGI]: balances.pigi })
      }
      case OVMWalletInteractions.FAUCET: {
        if (!address) {
          return res.status(400).send('')
        }
        await unipigWallet.rollup.requestFaucetFunds(address, 10)
        return res.status(200).send('')
      }
      case OVMWalletInteractions.SWAP: {
        if (!inputToken) {
          return res.status(400).send('')
        }
        await unipigWallet.rollup.sendTransaction(
          {
            tokenType: inputToken === Team.UNI ? UNI_TOKEN_TYPE : PIGI_TOKEN_TYPE,
            inputAmount,
            minOutputAmount: 1,
            timeout: Date.now() + 10000
          },
          address
        )
        return res.status(200).send('')
      }
      case OVMWalletInteractions.SEND: {
        if (!inputToken) {
          return res.status(400).send('')
        }

        await unipigWallet.rollup.sendTransaction(
          {
            tokenType: inputToken === Team.UNI ? UNI_TOKEN_TYPE : PIGI_TOKEN_TYPE,
            recipient,
            amount: inputAmount
          },
          address
        )
        return res.status(200).send('')
      }
      default: {
        return res.status(400).send('')
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send('An unknown error occurred.')
  }
}
