const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    assetsDir: '',
    publicPath: "",
    devServer: {
        port: 8088,
        host: 'localhost',
        open: true
    }
})
