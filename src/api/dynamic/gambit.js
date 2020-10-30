import request from '@/utils/request'
import qs from 'qs'

///话题管理

///话题管理查看
export function gambitList() {
    return request({
        url: '/service/admin/trend/alltopic',
        method: 'get',
    })
}

///话题管理添加
export function gambitAdd(data) {
    return request({
        url: '/service/admin/trend/topic',
        method: 'post',
        data
    })
}
///话题管理编辑
export function gambitEdit(data) {
    return request({
        url: '/service/admin/trend/topic',
        method: 'put',
        data
    })
}

///话题管理删除
export function gambitDel(params) {
    return request({
        url: '/service/admin/trend/topic' + '?' + qs.stringify(params, { indices: false }),
        method: 'delete',
    })
}
