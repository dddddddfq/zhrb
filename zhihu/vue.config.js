const ENV = process.env.NODE_ENV;
module.exports = {
    lintOnSave: ENV !== 'production',
    publicPath: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8008',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};