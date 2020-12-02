import request from '@/utils/request'
import qs from 'qs'


///获取漫画分类   
export function list(params) {
    return request({
        url: '/comic-admin/category/list' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}

///添加漫画分类
export function add(data) {
    return request({
        url: '/comic-admin/category/add',
        method: 'post',
        data
    })
}

///修改漫画分类   
export function edit(data) {
    return request({
        url: '/comic-admin/category/update',
        method: 'put',
        data
    })
}
///删除漫画分类
export function del(params) {
    return request({
        url: '/comic-admin/category/delete' + '?' + qs.stringify(params, { indices: false }),
        method: 'delete',

    })
}
///修改状态
export function changeStatus(data) {
    return request({
        url: '/comic-admin/category/state',
        method: 'put',
        data
    })
}