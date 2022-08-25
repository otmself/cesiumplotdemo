const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    assetsDir: '',
    publicPath: "",
    devServer: {
        port: 8088,
        host: '0.0.0.0',
        open: true
    }
})
