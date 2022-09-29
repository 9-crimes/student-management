import axios from 'axios';
export const createAchievement = async (params) => {
    let data
    await axios({
        method: "post",
        url: '/create-achievement',
        data: {
            ...params,
        }
    }).then(res => {
        data = res.data;
    })
    return data
}

export const updateScore = async (params) => {
    let data
    await axios({
        method: "post",
        url: '/updata-score',
        data: {
            ...params,
        }
    }).then(res => {
        data = res.data;
    })
    return data
}
