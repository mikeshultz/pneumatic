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

export function sendValue(
  id: number,
  key: string,
  value: any,
  messageType: Message = Message.EVENT_GET_RESPONSE
) {
  browser.runtime.sendMessage({
    type: messageType,
    detail: {
      id,
      key,
      value,
    }
  }).catch((err) => {
    console.error(`Unable to send message.`)
    console.error(err)
  })
}
