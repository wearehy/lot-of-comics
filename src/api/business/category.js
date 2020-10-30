import request from '@/utils/request'

export function getCateTree() {
  return request({
    url: '/cate/tree',
    method: 'get'
  })
}

export function cate() {
  return request({
    url: '/cate',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/cate/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/cate/del?id='+ids,
    method: 'delete',
  })
}

export function edit(data) {
  return request({
    url: '/cate/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del, getCateTree}
