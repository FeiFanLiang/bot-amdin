import axios from '@/utils/request'

export const getTemplateListApi = (data) => {
    return axios({
        url:'/api/getTemplateList',
        method:"post",
        data
    })
}

export const updateTemplateApi = (data) => {
    return axios({
        url:'/api/updateTemplate',
        method:"post",
        data
    })
}

export const getAllButtonApi = () => {
    return axios({
        url:'/api/getAllButton',
        method:'get'
    })
}