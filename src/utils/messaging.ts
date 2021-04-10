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

export function sendValue(key: string, value: any) {
  /*browser.tabs.sendMessage(
    {
      type: Message.EVENT_GET_RESPONSE,
      detail: {
        key,
        value,
      }
    }
  )*/
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(tabs => {
    tabs.forEach(tab => {
      console.log('////tab.id', tab.id)
      browser.tabs.sendMessage(
        tab.id,
        {
          type: Message.EVENT_GET_RESPONSE,
          detail: {
            key,
            value,
          }
        }
      ).catch((err) => {
        console.error(`Unable to send message to tabId ${tab.id}`)
        console.error(err)
      })
    })
  })
}
