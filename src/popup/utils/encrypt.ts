import C from 'crypto-es'
const { AES, enc: cryptoEnc } = C
//import { AES } from 'crypto-es/lib/aes'
//import CryptoES from 'crypto-es'

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
    console.log('PasswordEncryption.unlock()', passphrase)
    this.passphrase = passphrase
  }

  encrypt(dec: any): string {
    if (!this.passphrase) throw new Error('Locked')
    console.log('encrypt dec:', dec)
    //return JSON.stringify(CryptoES.AES.encrypt(dec, this.passphrase))
    const encData = (AES as AESModule).encrypt(JSON.stringify(dec), this.passphrase).toString()
    console.log('encData:', encData)
    return JSON.stringify(encData)
  }

  decrypt(enc: string): any {
    if (!this.passphrase) throw new Error('Locked')
    //return CryptoES.AES.encrypt(JSON.parse(enc), this.passphrase)
    //return JSON.parse((AES as AESModule).encrypt(JSON.parse(enc), this.passphrase))
    console.log('decrypt enc:', typeof enc, enc)
    const encDecoded = JSON.parse(enc)
    console.log('encDecoded:', encDecoded)
    console.log('this.passphrase:', this.passphrase)
    const dec = (AES as AESModule).decrypt(encDecoded, this.passphrase)
    console.log('decrypt dec:', dec)
    console.log('decrypt dec string:', dec.toString(cryptoEnc.Utf8))
    //return JSON.parse(dec.toString())
    return JSON.parse(dec.toString(cryptoEnc.Utf8))
  }
}
