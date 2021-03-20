export function sendResults(id, result) {
  const ev = new CustomEvent(
    'PNEUMATIC_JSONRPC_RESPONSE',
    {
      detail: cloneInto({
        id,
        result,
      }, window)
    }
  )
  window.dispatchEvent(ev)
}
