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

export function getInfo() {
  return request({
    url: '/api/getRole',
    method: 'get'
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

export function getIndexImgApi() {
  return request({
    url:'/api/getIndexImg',
    method:'get'
  })
}

export function updateIndexImgApi(data){
  return request({
    url:"/api/updateIndexImg",
    method:'post',
    data
  })
}