import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token,rememberMe) {
  if(rememberMe){
    // 登录页记住我，cookie存7天
    return Cookies.set(TokenKey, token,{expires: Config.tokenCookieExpires})
  }else{
    // 登录页记住我，cookie存1小时
    return Cookies.set(TokenKey, token,{expires: 0.05})
  }
  
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
