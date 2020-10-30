import request from '@/utils/request'
import qs from 'qs'

export function recomCate(params) {
  return request({
    url: '/recomCate'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: '/recomCate/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/recomCate/del?id='+ids,
    method: 'delete',
  })
}

export function edit(data) {
  return request({
    url: '/recomCate/edit',
    method: 'put',
    data
  })
}

export function changeCateStatus(data) {
  return request({
    url: '/recomCate/changeCateStatus',
    method: 'put',
    data
  })
}

export default {recomCate, add, edit, del, changeCateStatus}
