import request from '@/utils/request'
import qs from 'qs'

///分类管理

///分类管理查看
export function typeList() {
    return request({
        url: '/service/admin/trend/type',
        method: 'get',
    })
}

///分类管理添加
export function typeAdd(data) {
    return request({
        url: '/service/admin/trend/type',
        method: 'post',
        data
    })
}

///分类管理修改 
export function typeEdit(data) {
    return request({
        url: '/service/admin/trend/type',
        method: 'put',
        data
    })
}


