import request from '@/utils/request'
import qs from 'qs'

export function recomCateList(params) {
  return request({
    url: '/recomCateList'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}


export function del(ids) {
  return request({
    url: '/recomCateList/del?id='+ids,
    method: 'delete',
  })
}


export function changeRecomCateStatus(data) {
  return request({
    url: '/recomCateList/changeRecomCateStatus',
    method: 'put',
    data
  })
}

export function cates() {
  return request({
    url: '/recomCateList/cates',
    method: 'get',
  })
}
export function search(params) {
  return request({
    url: '/recomCateList/search'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function sort(data) {
  return request({
    url: '/recomCateList/sort',
    method: 'put',
    data
  })
}
