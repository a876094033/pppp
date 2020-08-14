import request from '@/utils/request'

// 查询Members列表
export function listMembers(query) {
  return request({
    url: '/api/v1/membersList',
    method: 'get',
    params: query
  })
}

// 查询Members详细
export function getMembers(id) {
  return request({
    url: '/api/v1/members/' + id,
    method: 'get'
  })
}

// 新增Members
export function addMembers(data) {
  return request({
    url: '/api/v1/members',
    method: 'post',
    data: data
  })
}

// 修改Members
export function updateMembers(data) {
  return request({
    url: '/api/v1/members',
    method: 'put',
    data: data
  })
}

// 删除Members
export function delMembers(id) {
  return request({
    url: '/api/v1/members/' + id,
    method: 'delete'
  })
}

