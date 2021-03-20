import { PneumaticConfig } from '../utils/interfaces'

const PNEUMATIC_SCRIPT_TAG_ID = 'pneumaticscript'
const ETHERS_SCRIPT_TAG_ID = 'ethersscript'
const MESSAGING_SCRIPT_TAG_ID = 'pneumaticmessagingscript'

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

;(function () {
  const pneumaticConfig: PneumaticConfig = {
    PROVIDER_URL: 'http://archival.mikes.network:8545',
  }
  window.wrappedJSObject.pneumaticConfig = cloneInto(pneumaticConfig, window)
  inject()
})()
