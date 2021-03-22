import { waitForGlobal } from '../utils/globals'
import { sendResults } from '../utils/messaging'
import { PneumaticConfig, RpcRequest, BackgroundMessage } from '../utils/interfaces'
import { Message } from '../utils/enums'
import config from '../config'
import accountsHandler from './handlers/accounts'
import requestsHandler from './handlers/requests'

// In order of execution.  First to respond is the taker.
const handlers = [accountsHandler, requestsHandler]

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
  browser.runtime.onMessage.addListener(async (message: BackgroundMessage) => {
    if (message.type !== Message.EVENT_JSONRPC_REQUEST) return

    for (const handler of handlers) {
      const response = await handler({ ...message.detail, config })
      if (response) {
        sendResults(response.id, response.result)
        break
      }
    }
  })
})()
