import request from '@/utils/request'

export function getUserListApi() {
  return request({
    url: '/api/userlist',
    method: 'get'
  })
}

export function editUserApi(data){
    return request({
        url:"/api/editUser",
        method:'post',
        data
    })
}

export function deleteUserApi(params){
    return request({
        url:'/api/deleteUser',
        method:"get",
        params
    })
}

export function resetPassApi (data) {
  return request({
    url:'/api/resetPass',
    method:"post",
    data
  })
}
