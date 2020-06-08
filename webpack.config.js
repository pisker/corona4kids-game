const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Corona4Kids game',
        }),
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
        }),
        new webpack.ProvidePlugin({
            'PIXI.extras.Bump': 'pixi-plugin-bump'
        })
    ],
    devServer: {
        contentBase: './dist',
    },
    output: {
        filename: 'game.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'coronaGame',
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif|shapes)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'media'
                }
            },
        ]
    }
};