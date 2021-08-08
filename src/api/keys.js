import axios from '@/utils/request'

export const getKeysListApi = (data) => {
    return axios({
        url:'/api/getKeysList',
        method:'post',
        data
    })
}

export const updateKeyApi = (data) => {
    return axios({
        url:'/api/updateKeys',
        method:"post",
        data
    })
}

export const deleteKeyApi = (data) => {
    return axios({
        url:'/api/deleteKey',
        method:'post',
        data
    })
}