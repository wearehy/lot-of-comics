import request from '@/utils/request'
import qs from 'qs'

// 获取所有的Role
export function getAll(params) {
  return request({
    url: '/admin/sec/role/page'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/roles/add',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/roles/' + id,
    method: 'get'
  })
}


export function del(ids) {
  return request({
    url: '/roles/del?id='+ids,
    method: 'delete',

  })
}

export function edit(data) {
  return request({
    url: '/roles/edit',
    method: 'put',
    data
  })
}

export function editMenu(data) {
  return request({
    url: '/roles/menu',
    method: 'put',
    data
  })
}

export default { add, edit, del, get, editMenu }
