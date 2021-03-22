declare global {
  interface Window {
    hasRun: boolean
    wrappedJSObject: any
    ethereum: any
    pneumatic: Pneumatic
    pneumaticConfig: PneumaticConfig
  }
  interface Navigator {
    registerProtocolHandler: Function
  }
  /*interface BrowserRuntime {
    getURL: Function
  }
  interface Browser {
    webRequest: any
    runtime: BrowserRuntime
  }*/
  interface Global {
     document: Document
     window: Window
     navigator: Navigator
     //browser: Browser
  } 
}
