import { Message } from './enums'

export function sendResults(id: number, result: any) {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(tabs => {
    tabs.forEach(tab => {
      browser.tabs.sendMessage(
        tab.id,
        {
          type: Message.EVENT_JSONRPC_RESPONSE,
          detail: {
            id,
            result,
          }
        }
      )
    })
  })
}
