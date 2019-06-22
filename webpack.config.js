/* eslint-env node */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const SRC_PATH = path.join(__dirname, 'src')

module.exports = {
  mode: 'development',
  entry: {
    index: path.join(SRC_PATH, 'index.tsx')
  },
  output: {
    path: path.join(__dirname, 'dist'),
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
              ]
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
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(SRC_PATH, 'index.html')
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
