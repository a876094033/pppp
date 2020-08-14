import request from '@/utils/request'

// 查询Invest列表
export function listInvest(query) {
  console.log(query)
  return request({
    url: '/api/v1/investList',
    method: 'get',
    params: query
  })
}

// 查询Invest详细
export function getInvest(investId) {
  return request({
    url: '/api/v1/invest/' + investId,
    method: 'get'
  })
}

// 新增Invest
export function addInvest(data) {
  return request({
    url: '/api/v1/invest',
    method: 'post',
    data: data
  })
}

// 修改Invest
export function updateInvest(data) {
  return request({
    url: '/api/v1/invest',
    method: 'put',
    data: data
  })
}

// 删除Invest
export function delInvest(investId) {
  return request({
    url: '/api/v1/invest/' + investId,
    method: 'delete'
  })
}

