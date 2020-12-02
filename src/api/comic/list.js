import request from '@/utils/request'
import qs from 'qs'


///获取漫画列表
export function list(params) {
    return request({
        url: '/comic-admin/content/list' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///获取一条漫画
export function one(params) {
    return request({
        url: '/comic-admin/content/one' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///获取漫画是否推荐
export function recommend(params) {
    return request({
        url: '/comic-admin/content/recommend' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///获取漫画列表分类名称
export function classify(params) {
    return request({
        url: '/comic-admin/content/category/name',
        method: 'get',
    })
}
///获取漫画最新章节
export function chapter(params) {
    return request({
        url: '/comic-admin/content/newest/chapter' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}

///添加一条漫画
export function add(data) {
    return request({
        url: '/comic-admin/content/add',
        method: 'post',
        data
    })
}
///添加推荐管理
export function recomAdd(data) {
    return request({
        url: '/comic-admin/content/add/recom/list',
        method: 'post',
        data
    })
}
///删除一条漫画
export function del(data) {
    return request({
        url: '/comic-admin/content/delete',
        method: 'put',
        data
    })
}
///批量删除漫画
export function dels(data) {
    return request({
        url: '/comic-admin/content/delete/more',
        method: 'post',
        data
    })
}
///修改热度
export function view(data) {
    return request({
        url: '/comic-admin/content/update/view',
        method: 'put',
        data
    })
}
///修改收藏
export function collect(data) {
    return request({
        url: '/comic-admin/content/update/collect',
        method: 'put',
        data
    })
}
///修改收费
export function vip(data) {
    return request({
        url: '/comic-admin/content/update/vip',
        method: 'put',
        data
    })
}
///修改app显示
export function show(data) {
    return request({
        url: '/comic-admin/content/update/app/show',
        method: 'put',
        data
    })
}
///批量修改app显示
export function shows(data) {
    return request({
        url: '/comic-admin/content/update/app/show/more',
        method: 'post',
        data
    })
}
///修改漫画信息
export function edit(data) {
    return request({
        url: '/comic-admin/content/update/list',
        method: 'put',
        data
    })
}


///回收站漫画查看
export function rList(params) {
    return request({
        url: '/comic-admin/Recycle/list' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///回收站漫画删除
export function rDel(params) {
    return request({
        url: '/comic-admin/Recycle/delete' + '?' + qs.stringify(params, { indices: false }),
        method: 'delete',
    })
}
///回收站漫画批量删除
export function rDels(data) {
    return request({
        url: '/comic-admin/Recycle/delete/more',
        method: 'post',
        data
    })
}
///回收站漫画还原
export function rReturn(data) {
    return request({
        url: '/comic-admin/Recycle/update',
        method: 'put',
        data
    })
}

///回收站章节查看
export function cList(params) {
    return request({
        url: '/comic-admin/Recycle/list/chapter' + '?' + qs.stringify(params, { indices: false }),
        method: 'get',
    })
}
///回收站章节删除
export function cDel(params) {
    return request({
        url: '/comic-admin/Recycle/delete/chapter' + '?' + qs.stringify(params, { indices: false }),
        method: 'delete',
    })
}
///回收站章节批量删除
export function cDels(data) {
    return request({
        url: '/comic-admin/Recycle/delete/chapter',
        method: 'post',
        data
    })
}
///回收站章节还原
export function cReturn(data) {
    return request({
        url: '/comic-admin/Recycle/update/chapter',
        method: 'put',
        data
    })
}

