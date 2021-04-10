import * as bip39 from 'bip39'
import { ethers } from 'ethers'

import useStorage from './useStorage'

export interface Account {
  mnemonic: string
  address: string
  privateKey: string
}

/**
 * Create a bip39 mnemonic
 */
export function createSeed(): string {
  return bip39.generateMnemonic()
}

/**
 * Create an account using a given mnemonic/seed phrase
 */
export async function createAccount(mnemonic: string): Promise<Account> {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const seedHex = seed.toString('hex')
  const account = new ethers.Wallet(seedHex)

  return {
    mnemonic,
    address: account.address,
    privateKey: account.privateKey
  }
}

/**
 * Create a new account and add it to storage
 *
 * Accounts are stored as JSON encrypted
 */
export async function addAccount(account: Account) {
  const storage = useStorage()

  if (!storage || !(await storage.isUnlocked())) {
    throw new Error('Storage locked')
  }

  let accounts: Account[] = await storage.get('accounts')

  if (!accounts) {
    
    accounts = []
  }

  accounts.push(account)

  await storage.set('accounts', accounts)

  return accounts
}
