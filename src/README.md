# Source Layout

## `manifest.json`

This is the file that tells the browser all of the relevant files and how they're used.  The paths in this file point to the final assembly locations after Webpack transpiles and bundles everything.

## `background/`

Entrypoint `index.js`

Webextension background bundle.

## `content/`

Entrypoint `index.js`

Webextension content scripts.

## `inpage/`

Entrypoint `index.js`

Script that will be injected into a web page to provide the EIP-1193 provider.

## `popup/`

Entrypoint `index.js`

Webextension popup bundle and Web files.  This acts as a Web app and is displayed when the user clicks on the extension's icon to initial the popup.

## `utils/`

Utility modules.
