import { useState, useEffect } from 'react';
import get from 'lodash/get'
import { SHA3 } from 'crypto-es/lib/sha3'

import { Message } from '../../utils/enums'
import { BackgroundMessage } from '../../utils/interfaces'

import { PasswordEncryption } from './encrypt'
import { addMessageListener } from './listeners'

const PROOF_KEY = 'fesProof'
const PASSPHRASE_KEY = 'pneumaticPassphrase'
const BACKGROUND_RESPONSE_TIMEOUT = 3000

// singleton
let storeInstance = +new Date()
let store: FirefoxEncryptedStorage = null

interface FESConstructorParams {
  storageType?: string
  onAutoUnlock?: Function
}

// TODO: make this send/response pattern generic
function storePassphrase(pp: string) {
  return new Promise((resolve, reject) => {
    const id = +new Date()
    const timeout = setTimeout(() => {
      reject('Timed out waiting for SET_RESPONSE')
    }, BACKGROUND_RESPONSE_TIMEOUT)

    // Prepare for response
    //browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
    addMessageListener((message: BackgroundMessage) => {
      if (
        message.type !== Message.EVENT_SET_RESPONSE
        || !(message && message.detail && message.detail.id === id)
      ) {
        return
      }
      clearTimeout(timeout)
      resolve(message.detail.success)
    })

    browser.runtime.sendMessage({
      type: Message.EVENT_SET,
      detail: {
        id,
        key: PASSPHRASE_KEY,
        value: pp
      }
    })
  })
}

function getPassphrase(): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = +new Date()
    const timeout = setTimeout(() => {
      reject('Timed out waiting for GET_RESPONSE')
    }, BACKGROUND_RESPONSE_TIMEOUT)

    // Prepare for response
    addMessageListener((message: BackgroundMessage) => {
      if (
        message.type !== Message.EVENT_GET_RESPONSE
        || !(message && message.detail && message.detail.id === id)
      ) {
        return
      }

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

  constructor(params: FESConstructorParams) {
    const {
      storageType = 'local',
      onAutoUnlock = null
    } = params

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
        this.crypt.unlock(passphrase)
        this.unlocked = true
        if (onAutoUnlock) {
          onAutoUnlock(true)
        }
      } else {
        console.debug('No stored session passphrase')
        this.unlocked = false
      }

      this.initialized = true
    }).catch((err: Error) => {
      console.error('Problem initializing encrypted storage:')
      console.error(err)
    })
  }

  isReady(): boolean {
    return !!this.storage && !!this.crypt
  }

  isValidProof(proof: string): boolean {
    return proof === SHA3(this.crypt.passphrase).toString()
  }

  async setProof() {
    await this.set(PROOF_KEY, SHA3(this.crypt.passphrase).toString())
  }

  async storageExists(): Promise<boolean> {
    if (!!this.crypt) {
      const fesUnlocked = await this.storage.get('fesUnlocked')
      return Object.keys(fesUnlocked).length > 0
    }

    return false
  }

  async isUnlocked(): Promise<boolean> {
    if (!!this.crypt && !!this.crypt.passphrase) {
      try {
        const fesUnlocked = await this.get('fesUnlocked')

        if (fesUnlocked && this.isValidProof(fesUnlocked)) {
          return true
        } else if (!fesUnlocked) {
          await this.setProof()
          return true
        }
      } catch (err) {
        if (err.toString().includes('locked')) {
          return false
        } else {
          console.error('FirefoxEncryptedStorage error checking if unlocked')
          throw err
        }
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
    this.unlocked = unlocked
    if (unlocked) {
      storePassphrase(passphrase)
    } else {
      throw new Error('Failed to unlock.  Invalid encryption passphrase')
    }
    return unlocked
  }

  async get(k: string): Promise<any> {
    const data = await this.storage.get(k)
    if (typeof data[k] !== 'undefined') {
      try {
        return this.crypt.decrypt(data[k])
      } catch (err) {
        if (err.toString().includes('Malformed UTF-8 data')) {
          throw new Error('Storage is locked')
        } else {
          throw err
        }
      }
    }

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
  const [autoUnlocked, setAutoUnlocked] = useState(false)
  const unlocked = get(store, 'unlocked', false)
  useEffect(() => {}, [autoUnlocked, store, unlocked])

  if (!store) {
    store = new FirefoxEncryptedStorage({ onAutoUnlock: () => {
      setAutoUnlocked(true)
    }})
  }
  return store && store.isReady() ? store : null
}
