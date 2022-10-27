const {defineConfig} = require('@vue/cli-service')
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = defineConfig({
    transpileDependencies: true,
    assetsDir: '',
    publicPath: "",
    devServer: {
        port: 8088,
        host: 'localhost',
        open: true
    },
    configureWebpack: {
        plugins: [new NodePolyfillPlugin(), new CopyWebpackPlugin({
            patterns: [
                {from: './src/static', to: "./public/static"}
            ]
        })]
    },
    // chainWebpack(config) {
    //     // set preserveWhitespace
    //
    //     config.resolve.alias
    //         .set('@', resolve('src'))
    //         .set('assets', resolve('src/assets'))
    //         .set('utils', resolve('src/utils'));
    //
    //     config.plugin("copy").use(require("copy-webpack-plugin"), [{
    //         patterns: [
    //             {from: './static', to: "static"}
    //         ]
    //     }]);
    //
    // },
})

