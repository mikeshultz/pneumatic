
declare global {
  interface Window {
    // To allow us to use computed props below
    [key: string]: any
  }
}

export async function waitForGlobal(name: string, timeout: number = 3000) {
  const start: number = +new Date()
  while (typeof window[name] !== 'undefined' && +new Date() < start + timeout) {
    await new Promise(resolve => setTimeout(resolve, timeout / 100))
  }
}
