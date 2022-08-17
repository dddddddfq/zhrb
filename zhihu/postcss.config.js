module.exports = {
    plugins: {
        'postcss-pxtorem': {
            //1rem 等于 37.5px
            rootValue: 37.5,
            //渲染所有样式 
            propList: ['*']
        }
    }
};