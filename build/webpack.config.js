var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name]_css.[hash:8].css');
const extractLESS = new ExtractTextPlugin('[name]_less.[hash:8].css');

var ROOT_PATH = path.resolve(__dirname, '../');
var SRC_PATH = path.resolve(ROOT_PATH, './src');
var DIST_PATH = path.resolve(ROOT_PATH, './md');
var ASSETS_PATH = path.resolve(SRC_PATH, './assets');
var VIEWS_PATH = path.resolve(SRC_PATH, './views');
var COMPONENTS_PATH = path.resolve(SRC_PATH, './components');

module.exports = {
    //页面入口文件配置
    entry: {
        responsive: path.resolve(ASSETS_PATH, 'scripts/responsive.js'),
        index: path.resolve(SRC_PATH, 'index.js'),
    },
    //入口文件输出配置
    output: {
        publicPath: '/dist/',
        path: path.resolve(DIST_PATH, 'js'),
        filename: '[name].[hash:8].js'
    },
    devServer: {
        hot: true,
        inline: true,
        historyApiFallback: false,
        disableHostCheck: true,
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            'axios': 'axios/dist/axios.min.js',

            '@SRC': SRC_PATH,
            '@ASSETS': ASSETS_PATH,
            '@VIEWS': VIEWS_PATH,
            '@COMPONENTS': COMPONENTS_PATH,
        }
    },
    module: {
        //加载器配置
        loaders: [{
                test: /\.css$/,
                use: extractCSS.extract(['css-loader']),
            },
            {
                test: /\.less$/,
                use: extractLESS.extract(['css-loader', 'less-loader?sourceMap']),
            },
            {
                test: /\.styl$/,
                use: extractLESS.extract(['css-loader', 'stylus-loader?sourceMap']),
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: SRC_PATH,
            },
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            'css': ['style-loader', 'css-loader'],
                            'less': ['style-loader', 'css-loader', 'less-loader?sourceMap'],
                            'stylus': ['style-loader', 'css-loader', 'stylus-loader?sourceMap'],
                        }
                    }
                }]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    plugins: [
        // 生成页面插件
        new HtmlWebpackPlugin({
            filename: 'index.html', //默认目录路径为output.publicPath
            template: './src/index.html', //默认目录路径为根目录
            inject: true,
        }),
        extractCSS,
        extractLESS,
        new CopyWebpackPlugin([{
                context: path.resolve(ASSETS_PATH, 'style/pageThemes'),
                from: '*',
                to: './pageThemes', // to的默认路径为output.publicPath
                force: true
            },
            {
                context: path.resolve(ASSETS_PATH, 'imgs'),
                from: '*',
                to: './imgs',
                force: true
            },
            {
                context: path.resolve(ASSETS_PATH, 'style/themes'),
                from: '*',
                to: './themes',
                force: true
            },
            {
                context: SRC_PATH,
                from: "demo.md",
                to: './demo.md',
                force: true
            },
            {
                context: SRC_PATH,
                from: "favicon.ico",
                to: './favicon.ico',
                force: true
            },
            {
                context: SRC_PATH,
                from: "CNAME",
                to: './CNAME',
                toType: 'file',
                force: true
            }
        ])
    ]
};