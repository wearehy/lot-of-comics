import request from '@/utils/request'
import qs from 'qs'

export function audio(params) {
  return request({
    url: '/audio'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: '/audio/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/audio/del?id='+ids,
    method: 'delete',
   
  })
}

export function edit(data) {
  return request({
    url: '/audio/edit',
    method: 'put',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/audio/changeStatus',
    method: 'put',
    data
  })
}

export function search(params) {
  return request({
    url: '/audio/search'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function sort(data) {
  return request({
    url: '/audio/sort',
    method: 'put',
    data
  })
}
