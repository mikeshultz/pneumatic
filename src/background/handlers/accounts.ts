import { RpcRequestConfigured, KeyValueFuncs, HandlerResult } from '../../utils/interfaces'

function ethAccounts() {
  return ['0xdeadbeef00113001003001003001001003000301']
}

function ethSendTransaction(params: Array<any>) {
  const [txObj] = params
  console.log('eth_sendTransaction tx:', txObj)
}

function ethSign(params: Array<any>) {
  const [address, message] = params
  console.log('sign address:', address)
  console.log('sign message:', message)
}

export const handlers: KeyValueFuncs = {
  'eth_requestAccounts': ethAccounts,
  'eth_accounts': ethAccounts,
  'eth_sendTransaction': ethSendTransaction,
  'eth_sign': ethSign,
}
export const handledMethods = Object.keys(handlers)

export default async function handleRequest(req: RpcRequestConfigured): Promise<HandlerResult | null> {
  const { id, method, params } = req
  if (handledMethods.includes(method)) {
    const result = await handlers[method](params)
    return { id, result }
  }

  return null
}
