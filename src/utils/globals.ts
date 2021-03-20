export async function waitForGlobal(name: string, timeout: number = 3000) {
  const start = +new Date()
  while (!window[name] && +new Date() < start + timeout) {
    await new Promise(resolve => setTimeout(resolve, timeout / 100))
  }
}
