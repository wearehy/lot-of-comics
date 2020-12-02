import request from '@/utils/request'
export function config() {
    return request({
        url: '/config-admin/basics',
        method: 'get'
    })
}
//获取系统信息
export function getSystemInfo() {
    return request({
        url: '/system/info',
        method: 'get'
    })
}