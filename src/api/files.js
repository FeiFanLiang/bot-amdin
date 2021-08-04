import axios from '@/utils/request'

export const updateFileApi = (data) => {
    return axios({
        url:'/api/updateFile',
        method:"post",
        data
    })
}

export const getAllFileApi = () => {
    return axios({
        url:"/api/allFile",
        method:"get"
    })
}

export const getFileListApi = (data) => {
    return axios({
        url:"/api/getFileList",
        method:"post",
        data
    })
}

export const deleteFileApi = (id) => {
    return axios({
        url:`/api/deleteFile/${id}`,
        method:"delete"
    })
}