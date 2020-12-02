import request from '@/utils/request'
import qs from 'qs'


///获取推荐管理   
export function list(params) {
    return request({
        url: '/comic-admin/recomlist/list' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///获取推荐列表  
export function recList() {
    return request({
        url: '/comic-admin/recomlist/icon/name',
        method: 'get',
    })
}

///删除推荐管理
export function del(params) {
    return request({
        url: '/comic-admin/recomlist/delete' + '?' + qs.stringify(params, { indices: false }),
        method: 'delete',

    })
}
///批量删除推荐管理
export function dels(data) {
    return request({
        url: '/comic-admin/recomlist/delete/more',
        method: 'post',
        data
    })
}

