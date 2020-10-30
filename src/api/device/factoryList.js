import request from '@/utils/request'
import qs from 'qs'


///获取设备工厂列表   
export function factoryList() {
    return request({
        url: '/device/factory/all',
        method: 'get',
    })
}




