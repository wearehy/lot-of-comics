import request from '@/utils/request'
import qs from 'qs'
//获取设备列表
export function deviceList(params) {
  return request({
    url: '/device/list?'+ qs.stringify(params, { indices: false }),
    method: 'get'
  })
}
///更新设备列表
export function deviceUpdate(data) {
  return request({
      url: '/device/factory/channel',
      method: 'patch',
      data
  })
}

///获取渠道列表 
export function channelList() {
  return request({
      url: '/device/channel/all',
      method: 'get',
  })
}