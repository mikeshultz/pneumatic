import { KeyValueStorage } from '../utils/interfaces'

export default class KeyValue {
  storage: KeyValueStorage

  constructor() {
    this.storage = {}
  }

  get(k: string): any {
    return this.storage[k]
  }

  set(k: string, v: any) {
    this.storage[k] = v
  }
}
