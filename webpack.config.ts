import { Configuration } from 'webpack';
import { resolve } from 'path';

const config: Configuration = {
  mode: 'none',
  entry: {
    // paths to lambdas
    nodeHelloLambda: './services/node-lambda/hello.ts',
  },
  target: 'node',
  module: {
    rules: [
      {
        exclude: '/node_modules/',
        use: {
          loader: 'ts-loader',
          options: {
            // pass special tsconfig file
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: resolve(__dirname, 'build'),
    filename: '[name]/[name].js',
  },
};

export default config;
