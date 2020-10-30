import request from '@/utils/request'
import qs from 'qs'

export function album(params) {
  return request({
    url: '/album'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function cateAlbum() {
  return request({
    url: '/album/cateAlbum',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: '/album/add',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/album/del?id='+ids,
    method: 'delete',
   
  })
}

export function edit(data) {
  return request({
    url: '/album/edit',
    method: 'put',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/album/changeStatus',
    method: 'put',
    data
  })
}

export function getAllRecomCate() {
  return request({
    url: '/album/getAllRecomCate',
    method: 'get',
  })
}

export function setRecom(ids) {
  return request({
    url: '/album/setRecom',
    method: 'post',
    data: ids
  })
}

export function checkRecom(params) {
  return request({
    url: '/album/checkRecom'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function search(params) {
  return request({
    url: '/album/search'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}

export function sort(data) {
  return request({
    url: '/album/sort',
    method: 'put',
    data
  })
}

//PUT 设置对应周的胎教音乐所对应的合集
export function prenatalSet(data) {
  return request({
    url: '/album/prenatal/set',
    method: 'put',
    data
  })
}