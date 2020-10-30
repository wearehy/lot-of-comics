import request from '@/utils/request'
import qs from 'qs'

///获取商品
export function commodityGet(params) {
    return request({
      url: '/mail/commodity/get'+ '?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
}      
///获取商品品类   
export function categoryGet() {
    return request({
      url: '/mail/category/all',
      method: 'get',
    })
}         
///获取商品分类
export function commodityGroupGet() {
    return request({
      url: '/mail/commodity/group/all',
      method: 'get',
    })
}         
///上架 下架
export function commoditySell(data) {
  return request({
    url: '/mail/commodity/sell',
    method: 'put',
    data
  })
}
///删除
export function commodityDelete(data) {
  return request({
    url: '/mail/commodity/delete',
    method: 'put',
    data
  })
}
///修改分组
export function commodityGroupUpdate(data) {
  return request({
    url: '/mail/commodity/group/list/update',
    method: 'put',
    data
  })
}
///获取商品详情
export function commodityInfo(params) {
  return request({
    url: '/mail/commodity/info'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}
///邮费模板
export function freightGet(params) {
  return request({
    url: '/mail/freight/all',
    method: 'get',
  })
}

///修改商品
export function commodityUpdate(data) {
  return request({
    url: '/mail/commodity/update',
    method: 'put',
    data
  })
}
///发布商品
export function commodityAdd(data) {
  return request({
    url: '/mail/commodity/add',
    method: 'post',
    data
  })
}
///选择轮播图
export function bannerAdd(data) {
  return request({
    url: '/banner/add/commodity',
    method: 'post',
    data
  })
}