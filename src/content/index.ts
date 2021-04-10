import { Message } from '../utils/enums'
import { PneumaticConfig, BackgroundMessage } from '../utils/interfaces'
import config from '../config'

const PNEUMATIC_SCRIPT_TAG_ID = 'pneumaticscript'
const ETHERS_SCRIPT_TAG_ID = 'ethersscript'
const MESSAGING_SCRIPT_TAG_ID = 'pneumaticmessagingscript'

declare function cloneInto(obj: object, target: object, options?: object): object

function inject() {
  const heads = document.getElementsByTagName('head')

  if (!heads || heads.length < 1) {
    console.warn('Unable to find <head> tag in HTML')
    return
  }

  const head = heads[0]
  const itag = document.getElementById(MESSAGING_SCRIPT_TAG_ID)

  if (!itag) {
    const pneumaticURL = browser.runtime.getURL('inpage.js')
    const pneumaticEl = document.createElement('script')
    pneumaticEl.id = PNEUMATIC_SCRIPT_TAG_ID
    pneumaticEl.src = pneumaticURL
    head.appendChild(pneumaticEl)
  }
}

// Relay request from browser to bg script
window.addEventListener(
  // Would be cool to get shared config working
  Message.EVENT_JSONRPC_REQUEST,
  async (ev: CustomEvent) => {
    browser.runtime.sendMessage({
      type: Message.EVENT_JSONRPC_REQUEST,
      detail: ev.detail
    })
  }
)

// Relay response from bg script to browser
browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
  if (message.type !== Message.EVENT_JSONRPC_RESPONSE) return

  window.dispatchEvent(new CustomEvent(
    Message.EVENT_JSONRPC_RESPONSE,
    { detail: cloneInto(message.detail, window) }
  ))
})

;(function () {
  window.wrappedJSObject.pneumaticConfig = cloneInto(config, window)
  inject()
})()
