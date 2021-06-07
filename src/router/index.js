import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'Login',
        component: () =>
            import ('@/views/Login/'),
        meta: { requiresAuth: false } // 添加额外的自定义数据
    },
    {
        path: '/',
        component: () =>
            import ('@/views/Layout/'),
        children: [{
                path: '',
                name: 'Home',
                component: () =>
                    import ('@/views/Home/'),
                meta: { requiresAuth: false }
            },
            {
                path: '/qa',
                name: 'Qa',
                component: () =>
                    import ('@/views/Qa/'),
                meta: { requiresAuth: false }
            },
            {
                path: '/video',
                name: 'Video',
                component: () =>
                    import ('@/views/Video/'),
                meta: { requiresAuth: false }
            },
            {
                path: '/mine',
                name: 'Mine',
                component: () =>
                    import ('@/views/Mine/'),
                meta: { requiresAuth: false }
            },
        ]
    },
    {
        path: '/search',
        name: 'Search',
        component: () =>
            import ('@/views/Search/'),
        meta: { requiresAuth: false }
    },
    {
        path: '/article/:articleId',
        name: 'Article',
        component: () =>
            import ('@/views/Article/'),
        // 将动态路由参数映射到组件的 props 中，无论是访问还是维护都狠方便
        props: true,
        meta: { requiresAuth: false }
    },
    {
        path: '/user/profile',
        name: 'UserProfile',
        component: () =>
            import ('@/views/UserProfile/'),
        meta: { requiresAuth: false }
    },
    {
        path: '/user/chat',
        name: 'UserChat',
        component: () =>
            import ('@/views/UserChat/'),
        meta: { requiresAuth: true }
    },
]

const router = new VueRouter({
    routes
})

// to:要访问的页面的路由信息
// from:来自哪个页面的路由信息
// next:放行的标记
router.beforeEach((to, from, next) => {
    // 判断用户是否登录
    if (to.meta.requiresAuth) {

        // 如果已登录，直接通过
        if (store.state.user) {
            return next()
        }
        // 没有登录提示
        Dialog.confirm({
                title: '访问提示',
                message: '该功能需要登录才能访问，需要登录吗'
            })
            .then(() => {
                // 确认执行这里
                router.replace({
                    name: 'Login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                })
                next()
            })
            .catch(() => {
                // 取消执行这里
                // 取消了之后中断路由导航
                next(false)
            })
    } else {
        // 不需要登录状态的页面，直接过去
        next()
    }
})

export default router