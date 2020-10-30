import request from '@/utils/request'
import qs from 'qs'


///获取基础模板   
export function vtList() {
    return request({
        url: '/vt/list',
        method: 'get',
    })
}

///修改基础模板   
export function vtEdit(data) {
    return request({
        url: '/vt/edit',
        method: 'patch',
        data
    })
}


///添加基础模板
export function vtAdd(data) {
    return request({
        url: '/vt/add',
        method: 'post',
        data
    })
}