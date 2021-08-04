import axios from '@/utils/request'


export const getCaseListApi = (data) => {
    return axios({
        url:"/api/getCaseList",
        method:"post",
        data
    })
}

export const updateCaseListApi = (data) => {
    return axios({
        url:"/api/updateCase",
        method:"post",
        data
    })
}

export const deleteCaseApi = (id) => {
    return axios({
        url:`/api/deleteCase/${id}`,
        method:"delete"
    })
}