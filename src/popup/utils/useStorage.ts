import { useState, useEffect } from 'react';
import get from 'lodash/get'
import { SHA3 } from 'crypto-es/lib/sha3'

import { Message } from '../../utils/enums'
import { BackgroundMessage } from '../../utils/interfaces'

import { PasswordEncryption } from './encrypt'

const PROOF_KEY = 'fesProof'
const PASSPHRASE_KEY = 'pneumaticPassphrase'

// singleton
let storeInstance = +new Date()
let store: FirefoxEncryptedStorage = null

function storePassphrase(pp: string) {
  browser.runtime.sendMessage({
    type: Message.EVENT_SET,
    detail: {
      key: PASSPHRASE_KEY,
      value: pp
    }
  })
}

function getPassphrase(): Promise<string> {
  const id = +new Date()
  console.log('@@@@@@@@@@@@@@@@@@@@@getPassphrase id', id)
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject('Timed out waiting for GET_RESPONSE')
    }, 3000)

    // Prepare for response
    browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
      console.log('@@@@@@@@@@@@@@@@@@@@@getPassphrase message', message)
      if (
        message.type !== Message.EVENT_GET_RESPONSE
        && (message && message.detail && message.detail.key === PASSPHRASE_KEY)
      ) {
        return
      }
      console.log('@@@@@@@@@@@@@@@@@@@@@resolved')
      clearTimeout(timeout)
      resolve(message.detail.value)
    })

    browser.runtime.sendMessage({
      type: Message.EVENT_GET,
      detail: {
        id,
        key: PASSPHRASE_KEY
      }
    })
  })
}

class FirefoxEncryptedStorage {
  initialized: boolean
  storage: browser.storage.StorageArea
  crypt: PasswordEncryption
  unlocked: boolean

  constructor(storageType: string = 'local') {
    this.initialized = false

    if (storageType === 'local') {
      this.storage = browser.storage.local
    } else if (storageType === 'sync') {
      this.storage = browser.storage.sync
    } else {
      throw new Error(`Unsupported storage type ${storageType}`)
    }

    this.crypt = new PasswordEncryption()

    getPassphrase().then((passphrase: string) => {
      if (passphrase) {
        console.log('FirefoxEncryptedStorage init passphrase:', passphrase)
        this.crypt.unlock(passphrase)
        this.unlocked = true
      } else {
        this.unlocked = false
      }

      this.initialized = true
    }).catch((err: Error) => {
      console.error('Problem initializing encrypted storage:')
      console.error(err)
    })
  }

  isReady(): boolean {
    return !!this.storage && !!this.crypt && this.unlocked
  }

  isValidProof(proof: string): boolean {
    console.log(`isValidProof ? ${proof} === ${SHA3(this.crypt.passphrase).toString()}`)
    return proof === SHA3(this.crypt.passphrase).toString()
  }

  async setProof() {
    await this.set(PROOF_KEY, SHA3(this.crypt.passphrase).toString())
  }

  async storageExists(): Promise<boolean> {
    console.log('storageExists')
    if (!!this.crypt) {
      const fesUnlocked = await this.storage.get('fesUnlocked')
      console.log('fesUnlocked:', Object.keys(fesUnlocked).length, fesUnlocked)
      return Object.keys(fesUnlocked).length > 0
    }

    return false
  }

  async isUnlocked(): Promise<boolean> {
    console.log('isUnlocked')
    console.log('this.crypt:', this.crypt)
    console.log('this.crypt.passphrase:', this.crypt.passphrase)
    if (!!this.crypt && !!this.crypt.passphrase) {
      const fesUnlocked = await this.get('fesUnlocked')
      console.log('dat:', fesUnlocked)

      if (fesUnlocked && this.isValidProof(fesUnlocked)) {
        console.log('valid proof')
        return true
      } else if (!fesUnlocked) {
        await this.setProof()
        return true
      }
    }

    return false
  }

  async setPassphrase(passphrase: string) {
    if (this.crypt.passphrase) {
      // TODO: Allow change?
      throw new Error('passphrase already set')
    }
    await this.unlock(passphrase)
    await this.set('fesUnlocked', SHA3(passphrase).toString())
  }

  async unlock(passphrase: string) {
    this.crypt.unlock(passphrase)
    const unlocked = await this.isUnlocked()
    console.log('********************unlocked', unlocked)
    this.unlocked = unlocked
  }

  async get(k: string): Promise<any> {
    console.log(`FirefoxEncryptedStorage.get(${k})`)
    const data = await this.storage.get(k)
    if (typeof data[k] !== 'undefined') {
      return this.crypt.decrypt(data[k])
    }

    console.log("DEBUG return")
    return
  }

  async set(k: any, v: any) {
    const encdata = this.crypt.encrypt(v)
    this.storage.set({
      [k]: encdata
    })
  }
}

export default function useStorage() {
  const unlocked = get(store, 'unlocked', false)
  useEffect(() => {}, [store, unlocked])

  if (!store) {
    store = new FirefoxEncryptedStorage()
  }
  console.log('store:', store)
  return store && store.isReady() ? store : null
}
