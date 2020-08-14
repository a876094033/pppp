import request from '@/utils/request'

// 查询BorrowDiya列表
export function listBorrowDiya(query) {
  console.info(query)
  return request({
    url: '/api/v1/borrowdiyaList?borrowId=' + query.borrowId,
    method: 'get',
    params: query
  })
}

// 查询BorrowDiya详细
export function getBorrowDiya(diyaId) {
  return request({
    url: '/api/v1/borrowdiya/' + diyaId,
    method: 'get'
  })
}

// 新增BorrowDiya
export function addBorrowDiya(data) {
  return request({
    url: '/api/v1/borrowdiya',
    method: 'post',
    data: data
  })
}

// 修改BorrowDiya
export function updateBorrowDiya(data) {
  return request({
    url: '/api/v1/borrowdiya',
    method: 'put',
    data: data
  })
}

// 删除BorrowDiya
export function delBorrowDiya(diyaId) {
  return request({
    url: '/api/v1/borrowdiya/' + diyaId,
    method: 'delete'
  })
}

