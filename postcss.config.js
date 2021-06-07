/* 
 * PostCss 配置文件
 * PostCss 是基于Node.js 运行的一个处理 CSS 的工具
 * 所以它的配置文件也是运行在 Node.js 中
 */

// PostCss 配置文件需要导出一个对象
module.exports = {
    // 配置要使用的相关插件
    plugins: {
        // 自动添加浏览器厂商声明前缀，用来兼容不同的浏览器
        // VueCLI 已经在内部默认配置了  autoprefixer
        // autoprefixer: {
        //     // browsers 用来配置要兼容到的系统（浏览器）环境
        //     // 这个配置没有问题，但是写到这里会有控制台编译警告
        //     // 因为VueCLI 是靠 browserslist 来配置兼容环境
        //     browsers: ['Android >=4.0', 'iOS >=8'],
        // },
        // 把 px 转化为 rem
        'postcss-pxtorem': {
            // 转换的根元素基准值
            // 正常情况下按照设计稿来
            // 750 宽的设计稿，750/10 = 75
            // 375 宽的设计稿，375/10 = 37.5
            // Vant 组件库是基于 375 宽写的
            // 移动端页面一般都是以 iphone 6/7/8 为原型设计的
            // Vant 组件库是基于逻辑像素 375 写的
            // 设计稿都是基于物理像素 750 设计的
            // 所以如果设置成 75 ，那么我们就可以在设计稿中测量多少就写多少，但是 Vant 的样式会小一半
            // 所以我们必须设置成 37.5
            // 测量设计稿的时候 让它 / 2 
            rootValue: 37.5,

            // 需要转换的 CSS 属性， * 就是所有属性都要转换
            propList: ['*'],
        },
    },
};