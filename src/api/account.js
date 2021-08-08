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

