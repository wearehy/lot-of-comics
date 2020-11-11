import request from '@/utils/request'

//获取系统信息
export function getSystemInfo() {
  return request({
    url: '/system/info',
    method: 'get'
  })
}

export function config() {
  return request({
    url: '/config-admin/basics',
    method: 'get'
  })
}

export function editConfig(data) {
  return request({
    url: '/system/config/edit',
    method: 'put',
    data
  })
}

export function pay() {
  return request({
    url: '/system/pay',
    method: 'get'
  })
}

export function editPay(data) {
  return request({
    url: '/system/pay/edit',
    method: 'put',
    data
  })
}

export function thirdLogin() {
  return request({
    url: '/system/thirdLogin',
    method: 'get'
  })
}

export function editThirdLogin(data) {
  return request({
    url: '/system/thirdLogin/edit',
    method: 'put',
    data
  })
}

