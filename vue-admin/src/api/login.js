import axios from 'axios';

export const login = async (params) => {
    let data
    await axios({
        method: "post",
        url: '/login',
        data: {
            ...params,
        }
    }).then(res => {
        data = res.data;
    })
    return data
}

export const signup = async (params) => {
    let data
    await axios({
        method: "post",
        url: '/signup',
        data: {
            ...params,
        }
    }).then(res => {
        data = res.data;
    })
    return data
}