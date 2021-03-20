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
  target: 'es5',
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
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  "useBuiltIns": "usage",
                  "corejs": 3, // or 2,
                  "targets": {
                    //"esmodules": true,
                    "firefox": "86", // TODO: Lower this?
                  },
                }
              ],
              '@babel/preset-typescript'
            ],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
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
          'popup/index.html',
          'popup/index.js', // TODO
          'popup/popup.css', // TODO
        ].map(f => { return { from: `./src/${f}`, to: f } })
      ]
    })
  ]
}
