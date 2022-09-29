import axios from 'axios';

export const createStudent = async (params) => {
    let data;
    await axios({
        method: "post",
        url: '/create-student',
        data: {
            username: params.username,
            name: params.name,
            sex: params.sex,
            stuClass: params.stuClass,
            tel: params.tel
        }
    }).then(res => {
        data = res.data;
    })
    return data
}