import request from '@/utils/request'
import qs from 'qs'

export function users(params) {
    return request({
      url: '/users'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
  }

export function del(ids) {
    return request({
      url: '/users/del?id='+ids,
      method: 'delete',
    })
  }
  
  export function edit(data) {
    return request({
      url: '/users/edit',
      method: 'put',
      data
    })
  }
  
  export function changeStatus(data) {
    return request({
      url: '/users/changeStatus',
      method: 'put',
      data
    })
  }

  export function feedback(params) {
    return request({
      url: '/users/feedback'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
  }

  export function delFeedback(ids) {
    return request({
      url: '/users/feedback/del',
      method: 'delete',
      data: ids
    })
  }
  export function edc(params) {
    return request({
      url: '/users/edc'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
  }  

  export function baby(params) {
    return request({
      url: '/users/baby'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
  } 
  export function collect(params) {
    return request({
      url: '/users/collect'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
  } 

  export function search(params) {
    return request({
      url: '/users/search'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
  } 