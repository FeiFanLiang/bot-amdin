import axios from '@/utils/request'



export const getNewListApi = (data) => {
    return axios({
        url:"/api/getNewList",
        method:"post",
        data
    })
}

export const updateNewApi = (data) => {
    return axios({
        url:"/api/updateNew",
        method:"post",
        data
    })
}

export const deleteNewApi = (id) => {
    return axios({
        url:`/api/deleteNew/${id}`,
        method:"delete"
    })
}