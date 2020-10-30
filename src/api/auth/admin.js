import request from '@/utils/request'
import qs from 'qs'

export function admin(params) {
    return request({
      url: '/admin'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
}

export function getAllRole() {
  return request({
    url: '/getAllRole',
    method: 'get',
  })
}

export function modifyProfile(data) {
    return request({
      url: '/modifyProfile',
      method: 'put',
      data
    })
}

export function changeStatus(data) {
  return request({
    url: '/admin/changeStatus',
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

export function add(data) {
    return request({
      url: '/admin/add',
      method: 'post',
      data
    })
}
  
export function del(ids) {
    return request({
      url: '/admin/del?id='+ids,
      method: 'delete',
    
    })
}
  
export function edit(data) {
    return request({
      url: '/admin/edit',
      method: 'put',
      data
    })
}