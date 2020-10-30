import request from '@/utils/request'
import qs from 'qs'

export function banner(params) {
  return request({
    url: '/banner'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}


export function add(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/banner/del?id='+ids,
    method: 'delete',
  })
}

export function edit(data) {
  return request({
    url: '/banner/edit',
    method: 'put',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/banner/changeStatus',
    method: 'put',
    data
  })
}

export function sort(data) {
  return request({
    url: '/banner/sort',
    method: 'put',
    data
  })
}

