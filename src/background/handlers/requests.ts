import { PneumaticConfig } from '../../utils/interfaces'
import { handledMethods as accountsHandledMethods } from './accounts'

const BLACKLISTED_METHODS = accountsHandledMethods

/**
 * Create the JSON-RPC request body for method with params
 *
 * @param method {string} method name (e.g. net_version)
 * @param params {Array} of method parameters
 * @returns {string} JSON to use as request body
 */
function makeJSONRequest(method, params, id=+new Date()) {
  return JSON.stringify({
    id,
    method,
    params: params || []
  })
}

/**
 * Handle a JSON-RPC request
 *
 * @param method {string} method name (e.g. net_version)
 * @param params {Array} of method parameters
 * @param id {Number} the unique-ish ID of the requests
 * @param config {PneumaticConfig} configuration
 * @returns {string} JSON to use as request body
 */
async function request(method, params, id, config) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  if (!config.PROVIDER_URL) {
    throw new Error('PROVIDER_URL not configured')
  }

  const body = makeJSONRequest(method, params, id)

  const r = new Request(config.PROVIDER_URL, {
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
 * @param args.id {Number} unique-ish ID of the request.  Used to match response
 * @param args.method {string} JSON-RPC method name
 * @param args.praams {Array} JSON-RPC method parameters
 * @param args.config {PneumaticConfig} Pneumatic configuration
 * @returns {string} JSON to use as request body
 */
export default async function handleRequest({
  id: Number,
  method: string,
  params: Array,
  config: PneumaticConfig
}) {
  if (!BLACKLISTED_METHODS.includes(method)) {
    const result = await request(method, params, id, config)
    return { id, result }
  }
}
