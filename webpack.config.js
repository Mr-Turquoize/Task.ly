const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path');

module.exports = {

    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Webpack Boilerplate',      
            template: path.resolve(__dirname, './src/template.html'),  // Template File
            filename : 'index.html', //Output File
        }), 
    ],

    mode: 'development',

    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    module : {
        rules : [
            {
                test: /\.(scss|css)$/,        
                use: ['style-loader', 'css-loader', 'sass-loader'],      
            },
        ]
    }
}