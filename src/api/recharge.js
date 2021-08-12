import axios from '@/utils/request'

export const getAlipayAddressApi = () => {
    return axios({
        url:'/api/getAlipayAddress',
        method:'get'
    })
}

export const updateAlipayAddressApi = (data) => {
    return axios({
        url:"/api/updateAlipayAddress",
        method:"post",
        data
    })
}

export const getRechargeListApi = (data) => {
    return axios({
        url:"/api/getRechargeList",
        method:"post",
        data
    })
}