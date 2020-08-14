import request from '@/utils/request'

// 查询Area列表
export function listArea(query) {
  return request({
    url: '/api/v1/areaList',
    method: 'get',
    params: query
  })
}

// 查询Area详细
export function getArea(areaId) {
  return request({
    url: '/api/v1/area/' + areaId,
    method: 'get'
  })
}

// 新增Area
export function addArea(data) {
  return request({
    url: '/api/v1/area',
    method: 'post',
    data: data
  })
}

// 修改Area
export function updateArea(data) {
  return request({
    url: '/api/v1/area',
    method: 'put',
    data: data
  })
}

// 删除Area
export function delArea(areaId) {
  return request({
    url: '/api/v1/area/' + areaId,
    method: 'delete'
  })
}

