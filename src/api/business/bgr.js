import request from '@/utils/request'
import qs from 'qs'

export function bgr(params) {
  return request({
    url: '/bgr'+ '?' + qs.stringify(params, { indices: false }),
    method: 'get',
  })
}