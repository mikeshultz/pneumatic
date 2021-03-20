import { waitForGlobal } from '../utils/globals'
import { sendResults } from '../utils/messaging'
import { PneumaticConfig } from '../utils/interfaces'
import { Message } from '../utils/enums'
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

  const config: PneumaticConfig = window.wrappedJSObject.pneumaticConfig

  /**
   * Listen for JSON-RPC request messages
  */
  window.addEventListener(
    // Would be cool to get shared config working
    Message.EVENT_JSONRPC_REQUEST,
    async (ev) => {
      for (const handler of handlers) {
        const response = await handler({ ...ev.detail, config })
        if (response) {
          sendResults(response.id, response.result)
          break
        }
      }
      // TODO: Send error?
    }
  )
})()
