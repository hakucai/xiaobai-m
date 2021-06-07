/* 
 * 本地存储封装模块
 */

// 获取本地存储数据
export const getItem = name => {
    const data = window.localStorage.getItem(name)
        // 把 JSON.parse放到 try catch 中是因为 data 可能不是 JSON 格式字符串

    try {
        // 尝试把 javascript 转换为 对象
        return JSON.parse(data)
    } catch (error) {
        // data 不是 JSON 格式字符串 直接返回
        return data
    }
}

// 设置本地存储数据
export const setItem = (name, value) => {
    // 如果value 是对象，那么就把value转成 JSON 格式字符串 再存储
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)
}

// 移除本地存储数据
export const removeItem = name => {
    window.localStorage.removeItem(name)
}