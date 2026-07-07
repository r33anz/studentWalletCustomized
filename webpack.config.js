const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (env, argv) => {
  process.env.WEBPACK_MODE = argv.mode || 'development';

  return {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        ethers: {
          test: /[\\/]node_modules[\\/](ethers|@noble|@adraffy|aes-js)[\\/]/,
          name: 'ethers',
          chunks: 'all',
          priority: 20,
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT': JSON.stringify(process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT),
      'process.env.REACT_APP_CONTRACT_ADDRESS_KARDEX_NFT': JSON.stringify(process.env.REACT_APP_CONTRACT_ADDRESS_KARDEX_NFT),
      'process.env.REACT_APP_IPFS_GATEWAY': JSON.stringify(process.env.REACT_APP_IPFS_GATEWAY),
      'process.env.REACT_APP_TX_FEE_ETH': JSON.stringify(process.env.REACT_APP_TX_FEE_ETH),
      'process.env.REACT_APP_RPC_URL': JSON.stringify(process.env.REACT_APP_RPC_URL),
      'process.env.REACT_APP_RPC_FALLBACK_URL': JSON.stringify(process.env.REACT_APP_RPC_FALLBACK_URL),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    open: true,
  }
}; };