import request from '@/utils/request'
import qs from 'qs'


///获取漫画推荐分类   
export function list(params) {
    return request({
        url: '/comic-admin/recomicon/list' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}

///添加漫画推荐分类
export function add(data) {
    return request({
        url: '/comic-admin/recomicon/add',
        method: 'post',
        data
    })
}

///修改漫画推荐分类   
export function edit(data) {
    return request({
        url: '/comic-admin/recomicon/update',
        method: 'put',
        data
    })
}
///删除漫画推荐分类
export function del(params) {
    return request({
        url: '/comic-admin/recomicon/delete' + '?' + qs.stringify(params, { indices: false }),
        method: 'delete',
    })
}
///批量删除漫画推荐分类
export function dels(data) {
    return request({
        url: '/comic-admin/recomicon/delete/more',
        method: 'post',
        data
    })
}
///修改状态
export function changeDisplay(data) {
    return request({
        url: '/comic-admin/recomicon/update/state',
        method: 'put',
        data
    })
}