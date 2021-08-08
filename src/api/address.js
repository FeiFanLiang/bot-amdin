import axios from '@/utils/request'



export const getAddressListApi = (data) => {
    return axios({
        url:"/api/getAddressList",
        method:"post",
        data
    })
}

export const addAddressApi = (data) => {
    return axios({
        url:'/api/addAddress',
        method:"post",
        data
    })
}