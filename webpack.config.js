const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/source.js',
    output: {
        filename: 'source.js',
        path: path.resolve(__dirname, './dist'),
        clean: true,
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        watchFiles: ['./'],
        
        compress: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};