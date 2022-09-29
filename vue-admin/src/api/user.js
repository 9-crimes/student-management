import axios from 'axios';

export const deleteUser = async (params) => {
    let data;
    await axios({
        method: "post",
        url: '/delete-user',
        data: {
            col:params.col,
            id:params.id
        }
    }).then(res => {
        data = res.data;
    })
    return data
}
