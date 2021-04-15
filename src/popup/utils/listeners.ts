import { BackgroundMessage } from '../../utils/interfaces'

type BackgroundMessageHandler = (message: BackgroundMessage) => void;

const messageListeners: BackgroundMessageHandler[] = []

export function addMessageListener(listener: BackgroundMessageHandler) {
  messageListeners.push(listener)
  return +new Date()
}

export function removeMessageListener(id: number) {}

// Listen for messages and send them to all known handlers at the time
browser.runtime.onMessage.addListener((message: BackgroundMessage) => {
  for (const handler of messageListeners) {
    handler(message)
  }
})
