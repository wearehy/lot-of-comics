import request from '@/utils/request'
import qs from 'qs'

///回收站管理

///回收站管理查看
export function hideList(params) {
    return request({
        url: '/service/admin/trend/article/display'+ '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}

///回收站还原
export function hideReduction(params) {
    return request({
        url: '/service/admin/trend/article/display'+ '?' + qs.stringify(params, { indices: false }),
        method: 'post',

    })
}

///回收站彻底删除
export function hideDel(params) {
    return request({
        url: '/service/admin/trend/article' + '?' + qs.stringify(params, { indices: false }),
        method: 'delete',
    })
}

