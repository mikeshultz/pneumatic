import { sendResults } from '../../utils/messaging'

function ethAccounts() {
  return ['0xdeadbeef00113001003001003001001003000301']
}

function ethSendTransaction(params) {
  const [txObj] = params
  console.log('eth_sendTransaction tx:', txObj)
}

function ethSign(prams) {
  const [address, message] = params
  console.log('sign address:', address)
  console.log('sign message:', message)
}

export const handlers = {
  'eth_requestAccounts': ethAccounts,
  'eth_accounts': ethAccounts,
  'eth_sendTransaction': ethSendTransaction,
  'eth_sign': ethSign,
}
export const handledMethods = Object.keys(handlers)

export default async function handleRequest({ id, method, params }) {
  if (handledMethods.includes(method)) {
    const result = await handlers[method](params)
    sendResults(id, result)
  }
}
