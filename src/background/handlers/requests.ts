import {
  PneumaticConfig,
  RpcRequest,
  RpcRequestConfigured,
  HandlerResult
} from '../../utils/interfaces'
import { handledMethods as accountsHandledMethods } from './accounts'

const BLACKLISTED_METHODS = accountsHandledMethods



/**
 * Create the JSON-RPC request body for method with params
 *
 * @param method {string} method name (e.g. net_version)
 * @param params {Array} of method parameters
 * @returns {string} JSON to use as request body
 */
function makeJSONRequest(
  method: string,
  params: Array<any>,
  id: number = +new Date()
) {
  return JSON.stringify({
    id,
    method,
    params: params || []
  })
}

/**
 * Handle a JSON-RPC request
 *
 * @param req {RpcRequestConfigured}
 * @param req.method {string} method name (e.g. net_version)
 * @param req.params {Array} of method parameters
 * @param req.id {number} the unique-ish ID of the requests
 * @param req.config {PneumaticConfig} configuration
 * @returns {string} JSON to use as request body
 */
async function request(req: RpcRequestConfigured) {
  const { id, method, params, config } = req
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (!config.JSONRPC_PROVIDER) {
    throw new Error('JSONRPC_PROVIDER not configured')
  }

  const body = makeJSONRequest(method, params, id)

  const r = new Request(config.JSONRPC_PROVIDER, {
    method: 'POST',
    body,
    headers
  })

  try {
    const res = await fetch(r)

    if (!res.ok) {
      throw new Error(
        `JSON-RPC request failed (${res.status}): ${res.statusText}`
      )
    }
    const json = await res.json()

    if (json && json.result) {
      return json.result
    }

    console.warn('null response from JSON-RPC request')
  } catch (err) {
    console.error('Error occurred when making JSON-RPC request:', err)
    throw err
  }
  return null
}

/**
 * Create the JSON-RPC request body for method with params
 *
 * @param args {object}
 * @param args.id {number} unique-ish ID of the request.  Used to match response
 * @param args.method {string} JSON-RPC method name
 * @param args.praams {Array} JSON-RPC method parameters
 * @param args.config {PneumaticConfig} Pneumatic configuration
 * @returns {string} JSON to use as request body
 */
export default async function handleRequest(
  req: RpcRequestConfigured
): Promise<HandlerResult | null> {
  const { id, method } = req
  if (!BLACKLISTED_METHODS.includes(method)) {
    const result = await request(req)
    return { id, result }
  }

  return null
}
