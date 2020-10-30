import request from '@/utils/request'
import qs from 'qs'

export function orderGet(params) {
    return request({
      url: '/mail/order/get'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
}
export function orderInfoGet(params) {
    return request({
      url: '/mail/order/info/get'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
}         
export function express(params) {
    return request({
      url: '/mail/express/get'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
}
export function expressAdd(data) {
    return request({
      url: '/mail/express/add',
      method: 'post',
      data
    })
}

