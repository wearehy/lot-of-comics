import request from '@/utils/request'
import qs from 'qs'


///获取优惠券  总览 
export function voucherTotal() {
    return request({
      url: '/voucher/total',
      method: 'get',
    })
}         
///获取优惠券   
export function voucherList(params) {
    return request({
      url: '/voucher/list?' + qs.stringify(params, { indices: false }),
      method: 'get',
    })
}         
///获取优惠券模板  
export function voucherTitle() {
    return request({
      url: '/voucher/title',
      method: 'get',
    })
}         


///删除优惠券
export function voucherDel(ids) {
  return request({
    url: '/voucher?id='+ids,
    method: 'delete',

  })
}


