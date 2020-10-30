import request from '@/utils/request'
import qs from 'qs'


///获取运费模板   
export function categoryList() {
    return request({
      url: '/mail/category/all',
      method: 'get',
    })
}         

///修改运费模板   
export function categoryEdit(data) {
  return request({
    url: '/mail/category/update',
    method: 'put',
    data
  })
}
///删除运费模板
export function categoryDel(ids) {
  return request({
    url: '/mail/category/delete?guid='+ids,
    method: 'delete',
  })
}

///添加运费模板
export function categoryAdd(data) {
  return request({
    url: '/mail/category/add',
    method: 'post',
    data
  })
}