import axios from '@/utils/request'

export const getAlipayAddressApi = (params) => {
    return axios({
        url: '/api/getRechargeAddress',
        method: 'get',
        params
    })
}

export const updateAlipayAddressApi = (data) => {
    return axios({
        url: "/api/updateAlipayAddress",
        method: "post",
        data
    })
}

export const getRechargeListApi = (data) => {
    return axios({
        url: "/api/getRechargeList",
        method: "post",
        data
    })
}