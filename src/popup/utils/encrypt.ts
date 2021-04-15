import C from 'crypto-es'
const { AES, enc: cryptoEnc } = C

interface AESModule {
  encrypt: Function
  decrypt: Function
}

export class PasswordEncryption {
  passphrase: string

  constructor() {}

  lock() {
    this.passphrase = null
  }

  unlock(passphrase: string) {
    this.passphrase = passphrase
  }

  encrypt(dec: any): string {
    if (!this.passphrase) throw new Error('Locked')
    const encData = (AES as AESModule).encrypt(JSON.stringify(dec), this.passphrase).toString()
    return JSON.stringify(encData)
  }

  decrypt(enc: string): any {
    if (!this.passphrase) throw new Error('Locked')
    const encDecoded = JSON.parse(enc)
    const dec = (AES as AESModule).decrypt(encDecoded, this.passphrase)
    return JSON.parse(dec.toString(cryptoEnc.Utf8))
  }
}
