import request from '@/utils/request'
//章节费用
export function list() {
    return request({
        url: '/comic-admin/price',
        method: 'get'
    })
}
// 编辑
export function edit(data) {
    return request({
      url: '/comic-admin/price',
      method: 'put',
      data
    })
  }