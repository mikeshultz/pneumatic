export interface Event {
  detail: RpcRequest
}

export interface RpcRequest {
  id: number
  method: string
  params: Array<any>
}

export interface RpcRequestConfigured {
  id: number
  method: string
  params: Array<any>
  config: PneumaticConfig
}

export interface RpcResult {
  id: number
  method: string
  params: Array<any>
  config: PneumaticConfig
}

export interface EIP1193Provider {
  on: Function
  removeListener: Function
  request: Function
}

export interface ExtendedProvider extends EIP1193Provider {
  send: Function
  enable: Function
}

export interface PneumaticConfig {
  JSONRPC_PROVIDER: string
  IPFS_GATEWAY: string
}

export interface Pneumatic {
  config: PneumaticConfig
  provider: ExtendedProvider
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#details
export interface OnBeforeRequestDetails {
  url: string
}

export interface HandlerResult {
  id: number
  result: any
}

export interface KeyValueStorage {
   [key: string]: any
}

export interface KeyValueFuncs {
   [key: string]: Function
}

export interface BackgroundMessage {
  type: string
  detail: any
}
