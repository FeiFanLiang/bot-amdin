import axios from '@/utils/request'



export const getHelpListApi = (data) => {
    return axios({
        url:"/api/getHelpList",
        method:"post",
        data
    })
}

export const updateHelpListApi = (data) => {
    return axios({
        url:"/api/updateHelp",
        method:"post",
        data
    })
}

export const deleteHelpApi = (id) => {
    return axios({
        url:`/api/deleteHelp/${id}`,
        method:"delete"
    })
}