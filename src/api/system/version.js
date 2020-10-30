import request from '@/utils/request'
import qs from 'qs'
//获取版本列表
export function versionList(params) {
  return request({
    url: '/version/list?'+ qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
//添加新版本
export function versionAdd(data) {
  return request({
    url: '/version/add',
    method: 'post',
    data
  })
}
//修改版本
export function versionEdit(data) {
  return request({
    url: '/version/modify',
    method: 'put',
    data
  })
}
//删除版本
export function versionDel(ids) {
  return request({
    url: '/version/delete?id='+ids,
    method: 'delete',
   
  })
}