/*
 *用户相关请求模块 
 */

import request from '@/utils/request'



// 登录模块
export const login = data => {
    return request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data

    })
}

// 获取短信验证码
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}

// 获取用户信息
export const getCurrentUser = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user',
    })
}

// 获取用户频道列表
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels',
    })
}

// 获取用户个人资料
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/profile',
    })
}

// 更新用户个人资料
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/profile',
        data
    })
}

// 更新用户头像
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/photo',
        data
    })
}