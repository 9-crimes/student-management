import axios from 'axios';

export const api = async (params) => {
    let data
    await axios({
        method: "post",
        url: '/api',
        data: {
            ...params,
        }
    }).then(res => {
        data = res.data;
    })
    return data
}

export const update = async (params) => {
    let data
    await axios({
        method: "post",
        url: '/update',
        data: {
            ...params,
        }
    }).then(res => {
        data = res.data;
    })
    return data
}