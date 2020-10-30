import request from '@/utils/request'
import qs from 'qs'


///获取运费模板   
export function assetAllocationList() {
    return request({
      url: '/system/assetAllocation',
      method: 'get',
    })
}         

///修改运费模板   
export function assetAllocationEdit(data) {
  return request({
    url: '/system/assetAllocation',
    method: 'put',
    data
  })
}