import { waitForGlobal } from '../utils/globals'
import { sendResults, sendValue } from '../utils/messaging'
import {
  PneumaticConfig,
  RpcRequest,
  BackgroundMessage,
  HandlerResult
} from '../utils/interfaces'
import { Message } from '../utils/enums'
import config from '../config'
import accountsHandler from './handlers/accounts'
import requestsHandler from './handlers/requests'
import KeyValue from './keyvalue'

// In order of execution.  First to respond is the taker.
const handlers = [accountsHandler, requestsHandler]
const kvStore = new KeyValue()

// Remove semi-colon at your own peril
;(async function() {
  if (window.hasRun) {
    return
  }
  window.hasRun = true

  // Can't do much until config is available
  await waitForGlobal('pneumaticConfig')

  /**
   * Listen for JSON-RPC request messages
  */
  browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.type === Message.EVENT_JSONRPC_REQUEST) {
      for (const handler of handlers) {
        handler({ ...message.detail, config }).then((response: HandlerResult) => {
          if (response) {
            sendResults(response.id, response.result)
          }
        })
      }
    } else if (message.type === Message.EVENT_GET) {
      const val = kvStore.get(message.detail.key)
      console.log('background SENDING GET RESPONSE:', val)
      sendValue(message.detail.key, val)
    } else if (message.type === Message.EVENT_SET) {
      kvStore.set(message.detail.key, message.detail.value)
    } else {
      console.error(`Unknown message type ${message.type}`)
    }
  })
})()
