import request from '@/utils/request'

// 查询Borrow列表
export function listBorrow(query) {
  return request({
    url: '/api/v1/borrowList',
    method: 'get',
    params: query
  })
}

// 查询Borrow详细
export function getBorrow(id) {
  return request({
    url: '/api/v1/borrow/' + id,
    method: 'get'
  })
}

// 新增Borrow
export function addBorrow(data) {
  return request({
    url: '/api/v1/borrow',
    method: 'post',
    data: data
  })
}

// 修改Borrow
export function updateBorrow(data) {
  return request({
    url: '/api/v1/borrow',
    method: 'put',
    data: data
  })
}

// 删除Borrow
export function delBorrow(id) {
  return request({
    url: '/api/v1/borrow/' + id,
    method: 'delete'
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/api/v1/borrow/avatar',
    method: 'post',
    data: data
  })
}
