import request from '@/utils/request'
import qs from 'qs'

// 查看
export function adminList(params) {
  return request({
    url: '/admin/sec/user/page'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}
// 角色下拉列表
export function roleList() {
  return request({
    url: '/admin/sec/role/all',
    method: 'get',
  })
}
// 添加
export function adminAdd(data) {
  return request({
    url: '/admin/sec/user/add',
    method: 'post',
    data
  })
}
// 编辑
export function adminEdit(data) {
  return request({
    url: '/admin/sec/user/edit',
    method: 'put',
    data
  })
}
// 删除
export function adminDel(params) {
  return request({
    url: '/admin/sec/user' + '?' + qs.stringify(params, { indices: false }),
    method: 'delete',
  
  })
}
// 更改状态
export function changeStatus(data) {
  return request({
    url: '/admin/sec/user/status',
    method: 'put',
    data
  })
}

// 另外页面
export function modifyProfile(data) {
  return request({
    url: '/modifyProfile',
    method: 'put',
    data
  })
}
export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: 'updatePass',
    method: 'put',
    data
  })
}