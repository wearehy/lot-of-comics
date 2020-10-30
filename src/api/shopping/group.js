import request from '@/utils/request'
import qs from 'qs'


///获取运费模板   
export function groupList() {
    return request({
      url: '/mail/commodity/group/all',
      method: 'get',
    })
}         

///修改运费模板   
export function groupEdit(data) {
  return request({
    url: '/mail/commodity/group/update',
    method: 'put',
    data
  })
}
///删除运费模板
export function groupDel(ids) {
  return request({
    url: '/mail/commodity/group/delete?guid='+ids,
    method: 'delete',
  })
}

///添加运费模板
export function groupAdd(data) {
  return request({
    url: '/mail/commodity/group/add',
    method: 'post',
    data
  })
}