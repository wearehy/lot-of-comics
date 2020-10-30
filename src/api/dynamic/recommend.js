import request from '@/utils/request'
import qs from 'qs'

///推荐管理

///推荐管理查看
export function recommendList(params) {
    return request({
        url: '/service/admin/trend/article/recommend'+ '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}




