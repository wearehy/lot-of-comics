import request from '@/utils/request'

export function login(username, password, code,verify,rememberMe) {
  return request({
    url: '/login',
    method: 'post',
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
    url: '/info',
    method: 'get'
  })
}

//验证码
export function getCodeImg() {
  return request({
    url: '/createVerify',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'delete'
  })
}
