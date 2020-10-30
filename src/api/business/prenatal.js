import request from '@/utils/request'
import qs from 'qs'
//获取胎教集合列表
export function prenatalList(params) {
  return request({
    url: '/album/prenatal/list?'+ qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

//修改胎教集合
export function prenatalEdit(data) {
  return request({
    url: '/album/prenatal/set',
    method: 'put',
    data
  })
}
//删除胎教集合
export function prenatalDel(ids) {
  return request({
    url: '/album/prenatal/delete?id='+ids,
    method: 'delete',
   
  })
}