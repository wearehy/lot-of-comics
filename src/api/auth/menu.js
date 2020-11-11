import request from '@/utils/request'

export function getMenusTree() {
  return request({
    url: '/menus/tree',
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: '/admin/sec/permission/tree',
    method: 'get'
  })
}

export function menus() {
  return request({
    url: '/menus',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/menus/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/menus/del?id='+ids,
    method: 'delete',
 
  })
}

export function edit(data) {
  return request({
    url: '/menus/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree}
