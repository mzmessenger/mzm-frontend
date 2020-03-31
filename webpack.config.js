/* eslint-env node */
const path = require('path')
const WorkerPlugin = require('worker-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const workboxPlugin = require('workbox-webpack-plugin')

const SRC_PATH = path.join(__dirname, 'src')
const DEST_PATH = path.join(__dirname, 'dist')

module.exports = {
  entry: {
    index: path.join(SRC_PATH, 'index.tsx')
  },
  output: {
    path: DEST_PATH,
    publicPath: '/'
  },
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    exclude: ['transform-regenerator']
                  }
                ],
                '@babel/preset-react'
              ],
              cacheDirectory: true
            }
          },
          'ts-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new WorkerPlugin({ globalObject: 'self' }),
    new CopyPlugin([
      { from: path.join(SRC_PATH, 'index.html'), to: DEST_PATH },
      { from: path.join(SRC_PATH, 'manifest.json'), to: DEST_PATH },
      {
        from: path.join(SRC_PATH, 'assets', 'icons'),
        to: path.join(DEST_PATH, 'assets', 'icons')
      }
    ]),
    new workboxPlugin.GenerateSW({
      offlineGoogleAnalytics: true,
      exclude: [/^manifest.json$/],
      swDest: 'sw.js',
      cacheId: 'mzm',
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'mzm-default',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24
            }
          }
        }
      ]
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true
  }
}
