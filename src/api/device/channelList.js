import request from '@/utils/request'
import qs from 'qs'


///获取渠道列表 
export function channelList() {
    return request({
        url: '/device/channel/all',
        method: 'get',
    })
}




///添加渠道
export function channelAdd(data) {
    return request({
        url: '/device/channel',
        method: 'post',
        data
    })
}

///修改渠道
export function channelEdit(data) {
    return request({
        url: '/device/factory',
        method: 'patch',
        data
    })
  }