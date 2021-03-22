const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const package = require('./package.json')

function modify(buffer) {
   // copy-webpack-plugin passes a buffer
   const manifest = JSON.parse(buffer.toString())

   // make any modifications you like, such as
   manifest.version = package.version

   // pretty print to JSON with two spaces
   const manifestJSON = JSON.stringify(manifest, null, 2)
   return manifestJSON
}


module.exports = {
  mode: 'development',
  target: 'web', // es5
  entry: {
    inpage: `${__dirname}/src/inpage/index.ts`,
    background: `${__dirname}/src/background/index.ts`,
    content: `${__dirname}/src/content/index.ts`,
    //popup: `${__dirname}/src/popup/index.js`,
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist`
  },
  resolve: {
    alias: {
      //'web-encoding': path.resolve(__dirname, 'node_modules/web-encoding/src/lib.-browser.js')
      'web-encoding': path.resolve(__dirname, 'node_modules/web-encoding/src/lib.js')
    },
    extensions: ['.ts', '.js', '.json'],
    aliasFields: ['browser', 'main', 'module'],
    mainFields: ['browser', 'main', 'module'],
    importsFields: ['browser', 'main', 'module'],
  },
  externals: {
    /*'TextEncoder': 'web-encoding',
    'TextDecoder': 'web-encoding',
    'web-encoding': 'TextEncoder',
    'web-encoding': 'TextDecoder',*/
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          //loader: 'babel-loader',
          loader: 'ts-loader',
          /*options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  //"useBuiltIns": "usage",
                  //"corejs": 3, // or 2,
                  "targets": {
                    //"esmodules": true,
                    "firefox": "86", // TODO: Lower this?
                  },
                }
              ],
              '@babel/preset-typescript'
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime'
            ]
          }*/
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./src/manifest.json",
          to:   "manifest.json",
          transform (content, path) {
            return modify(content)
          }
        },
        ...[
          'icons/pneumatic-logo-32x32.png',
          'icons/pneumatic-logo-48x48.png',
          'icons/pneumatic-logo-96x96.png',
        ].map(f => { return { from: `./${f}`, to: f } }),
        ...[
          'ipfs/ipfs.html',
          'popup/index.html',
          'popup/index.js', // TODO
          'popup/popup.css', // TODO
        ].map(f => { return { from: `./src/${f}`, to: f } })
      ]
    })
  ]
}
