const path = require('path');

module.exports = {
  devServer: {
    static: './dist',
  },
  entry: [
    './src/main.js',
  ],
  output: {
    filename: 'sme.js',    
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'SME',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      }
    ]
  },
};
