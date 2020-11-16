import request from '@/utils/request'

export function login(username, password, code,verify,rememberMe) {
  return request({
    url: '/admin/sec/user/login',
    method: 'put',
    data: {
      username,
      password,
      code,
      verify,
      rememberMe
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

//验证码
export function getCodeImg() {
  return request({
    url: '/admin/sec/user/verifyCode',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'delete'
  })
}
