/* 请求模块 */
import axios from 'axios'
import router from '@/router'
import { Toast } from 'vant';

// 在非组件模块中获取 store 必须用这种方法
// 这里加载 store 和 在组件中 this.$store 是一个东西
import store from '@/store'

const refreshTokenReq = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net',
})

const request = axios.create({
    baseURL: 'http://api-toutiao-web.itheima.net',
})

//请求拦截器
request.interceptors.request.use(function(config) {
    const { user } = store.state

    // 如果用户已登录，统一给接口设置 token 信息
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    // 处理完之后返回
    return config
}, function(error) {
    return Promise.reject(error)
})

//响应拦截器
request.interceptors.response.use(function(response) {
    // 所有响应码为 2xx 的响应都会进入这里

    // response 是响应处理
    // 注意一定要把响应结果 return ，否则真正发请求拿不到数据
    return response
}, async function(error) {
    const { status } = error.response
        // 任何超出 2xx 的响应码都会进入这里
    if (status === 400) {
        Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
        // token 无效
        // 如果没有 user 或者 user.token，直接去登陆页面
        const { user } = store.state
        if (!user || !user.token) {
            Toast.fail('登录状态无效，请重新登录')
            return redirectLogin()
        }
        // 如果有 refresh_token  则请求获取新的 token

        try {
            const { data } = await refreshTokenReq({
                method: 'PUT',
                url: '/app/v1_0/authorization',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            })

            // 拿到新的 token 之后把它更新到容器中
            user.token = data.data.token
            store.commit('setUser', user)

            // 把失败的请求重新发出去
            // error.config 是本次请求的相关配置信息对象
            // 这里使用 request 发请求，它会走自己的拦截器
            // 它的请求拦截器通过 store 容器访问 token 数据
            return request(error.config)

        } catch (error) {
            // 刷新 token 失败了，跳转登录页
            redirectLogin()
        }

    } else if (status === 403) {
        // token 未携带或已过期 

        Toast('没有操作权限')
    } else if (status === 400) {
        // 客户端参数错误
        Toast.fail('参数错误,清检查请求参数')
    } else if (status >= 500) {
        Toast.fail('服务端内部异常，请稍后重试')
    }

    return Promise.reject(error)
})

function redirectLogin() {
    // router.replace('/login')
    router.replace({
        name: 'login',
        // 传递查询参数，查询参数会以 ? 作为分隔符放到 url 后面
        query: {
            // 数据名是自己定的
            // router.currentRoute 和我们在组件重获取的 this.$route 是一个东西

            redirect: router.currentRoute.fullPath
        }
    })
}

export default request