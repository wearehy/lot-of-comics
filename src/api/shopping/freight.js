import request from '@/utils/request'
import qs from 'qs'


///获取运费模板   
export function freightList() {
    return request({
      url: '/mail/freight/all',
      method: 'get',
    })
}         

///修改运费模板   
export function freightEdit(data) {
  return request({
    url: '/mail/freight/update',
    method: 'put',
    data
  })
}
///删除运费模板
export function freightDel(ids) {
  return request({
    url: '/mail/freight/delete?guid='+ids,
    method: 'delete',

  })
}

///添加运费模板
export function freightAdd(data) {
  return request({
    url: '/mail/freight/add',
    method: 'post',
    data
  })
}