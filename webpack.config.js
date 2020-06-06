const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = ( env, options ) => {
  const PROD = 'production' === options.mode;

  return {
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
    entry: {
      './assets/js/editor.blocks' : './blocks/index.js'
    },
    devtool: PROD ? '' : 'source-map',
    output: {
      path: path.resolve( __dirname ),
      filename: PROD ? '[name].min.js' : '[name].js',
    },
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
    },
    resolve: {
      extensions: [ '.js' ]
    },
    module:  {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use:     {
            loader: 'babel-loader',
            query:  {
              presets: [ 'react' ],
              plugins: [ 'transform-object-rest-spread' ]
            }
          }
        },
        {
          test: /.*\/editor\.s?css$/,
          use:  [
            MiniCssExtractPlugin.loader,
            {
              loader:  'css-loader',
              options: {
                sourceMap: ! PROD,
              }
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [
                  autoprefixer
                ]
              },
            },
            {
              loader: "sass-loader",
              options: {}
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin( {
        filename: './assets/css/blocks.editor.css',
      } )
    ]
  }
};
