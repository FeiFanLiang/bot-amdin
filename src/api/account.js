import axios from '@/utils/request'

export const getAccountListApi = (data) => {
    return axios({
        url:"/api/getAccountList",
        method:'post',
        data
    })
}

export const editAccountAmountApi = (data) => {
    return axios({
        url:"/api/editAccountAmount",
        method:"post",
        data
    })
}


export const getRateApi = (data) => {
    return axios({
        url:'/api/getRate',
        method:'get',
        data
    })
}


export const updateRateApi = (data) => {
    return axios({
        url:'/api/updateRate',
        method:'post',
        data
    })
}