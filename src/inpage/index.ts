/**
 * This file gets injected into the Web pages to primarily provide the EIP-1193
 * provider.  It communicates with the background scripts to make JSON-RPC calls
 * to the configured JSON-RPC server.
 */
import {
  RpcRequest,
  Pneumatic,
  PneumaticConfig,
  EIP1193Provider,
  ExtendedProvider
} from '../utils/interfaces'
import { Message } from '../utils/enums'

declare global {
  interface Window {
    hasRun: boolean
    wrappedJSObject: any
    ethereum: any
    pneumatic: Pneumatic
    pneumaticConfig: PneumaticConfig
  }
}

class ProviderRpcError extends Error {
  name: string
  message: string
  code: number
  stack: any

  constructor(message: string, code: number) {
    super(message)
    this.name = 'ProviderRpcError'
    this.message = message
    this.code = code
    this.stack = (new Error()).stack
  }
}

/**
 * Patch an EIP-1193 for Metamask compatability.  Mostly for depreciated API
 * methods that some Metamask consumers expect.
 *
 * @param provider {EIP1193Provider} the EIP-1193 provider
 * @returns {object} patched provider
 */
function patchMetamaskCompatProvider(provider: EIP1193Provider): ExtendedProvider {
  /**
   * Metamask's send() function supporting multiple signatures
   */
  function send() {
    console.warn('send() is DEPRECAITED. Use ethereum.request() instead.')
    /** 
     * There's three signatures here, we try and support 2.
     *
     * For detalis: https://docs.metamask.io/guide/ethereum-provider.html#ethereum-send-deprecated
     */
    if (arguments.length === 1 && typeof arguments === 'object') {
      // ethereum.send(payload: JsonRpcRequest)
      return provider.request(...Array.from(arguments))
    } else if (arguments.length === 1 && typeof arguments === 'string') {
      // ethereum.send(method: string)
      return provider.request({ method: arguments[0] })
    } else if (arguments.length === 2) {
      if (typeof arguments[0] === 'string' && arguments[1] instanceof Array) {
        // ethereum.send(method: string, params?: Array<unknown>)
        return provider.request({ method: arguments[0], params: arguments[1] })
      }
    }
    throw new Error('Unsupported send() signature.  ethereum.send() is depreciated, use ethereum.request().')
  }

  return {
    ...provider,
    /**
     * This was depreciated in favor of ethereum.request() but lots of dapps
     * and "connectors" still implement this.
     */
    enable: () => {
      console.warn('enable() is DEPRECAITED. Use ethereum.request({ method: \'eth_requestAccounts\' }) instead.')
      return provider.request({ method: 'eth_requestAccounts' })
    },
    /**
     * This was depreciated in favor of ethereum.request() but lots of dapps
     * and "connectors" still implement this.
     */
    send,
  }
}

/**
 * Create EIP-1193 provider expected by web3 libraries.
 *
 * @returns {EIP1193Provider} provider
 */
function buildEIP1193Provider(): EIP1193Provider {
  return {
    // TODO: implement evnet handling
    on: (evName: string) => console.log(`on(${evName}) NOT IMPLEMENTED`),
    removeListener: (evName: string) => console.log(`removeListener(${evName}) NOT IMPLEMENTED`),
    request: ({ method, params, id = +new Date() }: RpcRequest) => {
      return new Promise((resolve, reject) => {
        const rev = new CustomEvent(
          Message.EVENT_JSONRPC_REQUEST,
          {
            detail: {
              method,
              params,
              id
            }
          }
        )

        const timeout = setTimeout(() => {
          reject(new Error('Request timed out'))
        }, 30000)

        // Prepare for response
        // TODO: Can these be reliably cleaned up without terminating
        // outstanding requests?
        window.addEventListener(
          Message.EVENT_JSONRPC_RESPONSE,
          (ev: CustomEvent) => {
            if (ev.detail.id === id) {
              resolve(ev.detail.result)
              clearTimeout(timeout)
            }
          }
        )

        window.addEventListener(
          Message.EVENT_JSONRPC_ERROR_RESPONSE,
          (ev: CustomEvent) => {
            if (ev.detail.id === id) {
              const { code, message } = ev.detail
              console.log(`Error (${code}): ${message}`)
              reject(new ProviderRpcError(message, code))
              clearTimeout(timeout)
            }
          }
        )

        // Send request to the requests content script
        window.dispatchEvent(rev)
      })
    }
  }
}

/**
 * Load Pneumatic environment into the browser globals
 */
function load() {
  const config: PneumaticConfig = window.pneumaticConfig
  const provider = patchMetamaskCompatProvider(buildEIP1193Provider())
  window.pneumatic = {
    config,
    provider
  }
  window.ethereum = provider
}

;(async function () {
  if (typeof window.ethereum === 'undefined') {
    return load()
  }

  window.addEventListener(
    Message.EVENT_PROVIDER_EVENT,
    (ev: CustomEvent) => {
      console.log('General provider event:', ev.detail)
    }
  )
})()
