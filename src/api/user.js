import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export const updatePasswordApi = (data) => {
  return request({
    url:"/api/updatePass",
    method:"post",
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'get'
  })
}

export function getRedpackConfigApi () {
  return request({
    url:'/api/getRedpackConfig',
    method:"get"
  })
}

export function updateRedpackConfigApi (data) {
  return request({
    url:'/api/updateRedpackConfig',
    method:"post",
    data
  })
}

export function updateBotApi(data){
  return request({
    url:'/api/bot',
    method:"post",
    data
  })
}