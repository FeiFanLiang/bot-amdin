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

export const getAmountCountApi = () => {
    return axios({
        url:'/api/amountCount',
        method:'get'
    })
}

export const updateAccessApi = (data) => {
    return axios({
        url:'/api/updateAccess',
        method:'post',
        data
    })
}
export const getWhiteApi = () => {
    return axios({
        url:'/api/getWhite',
        method:"get"
    })
}

export const getFilterRuleApi = () => {
    return axios({
        url:'/api/getFilterRule',
        method:'get'
    })
}

export const updateWhiteApi = (data) => {
    return axios({
        url:'/api/updateWhite',
        method:'post',
        data
    })
}
export const updateFilterRuleApi = (data) => {
    return axios({
        url:"/api/updateFilterRule",
        method:"post",
        data
    })
}

export const getEnergyApi = () => {
    return axios({
        url:"/api/getEnergy",
        method:"get"
    })
}
export const updateEnergyApi = (data) => {
    return axios({
        url:'/api/updateEnergy',
        method:"post",
        data
    })
}

export const getHandingFeeApi = () => {
    return axios({
        url:'/api/usdtRate',
        method:"get"
    })
}

export const updateHandingFeeApi = (data) => {
    return axios({
        url:'/api/updateUsdtRate',
        method:"post",
        data
    })
}
export const restartBotApi = () => {
    return axios({
        url:"/api/restart",
        method:"get"
    })
}