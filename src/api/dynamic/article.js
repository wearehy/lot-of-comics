import request from '@/utils/request'
import qs from 'qs'

///帖子管理

///帖子管理全部查看
export function articleList(params) {
    return request({
        url: '/service/admin/trend/article'+ '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///帖子管理视频查看
export function videoList(params) {
    return request({
        url: '/service/admin/trend/article/video'+ '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///帖子管理图文查看
export function txtList(params) {
    return request({
        url: '/service/admin/trend/article/image_and_text'+ '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}

///帖子审核
export function articleCheck(data) {
    return request({
        url: '/service/admin/trend/article/check',
        method: 'post',
        data
    })
}



///帖子放入回收站
export function articleDel(params) {
    return request({
        url: '/service/admin/trend/article/display'+ '?' + qs.stringify(params, { indices: false }),
        method: 'delete',
    })
}


