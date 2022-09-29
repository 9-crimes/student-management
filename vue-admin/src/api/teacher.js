import axios from 'axios';

export const createTeacher = async (params) => {
    let data;
    await axios({
        method: "post",
        url: '/create-teacher',
        data: {
            username: params.username,
            name: params.name,
            sex: params.sex,
            subject: params.subject,
            tel: params.tel
        }
    }).then(res => {
        data = res.data;
    })
    return data
}

export const teacherPrint = async (params) => {
    let data;
    await axios({
        method: "post",
        url: '/teacher-print',
        data: {
            data: params.data
        }
    }).then(res => {
        data = res.data;
    })
    return data
}

export const uploadExcel = async (file) => {
    let data;
    await axios({
        method: "post",
        url: '/upload-excel',
        data: file
    }).then(res => {
        data = res.data;
    })
    return data
}

export const deleteFile = async (file) => {
    let data;
    await axios({
        method: "post",
        url: '/delete-file',
        data: {
            ...file
        }
    }).then(res => {
        data = res.data;
    })
    return data
}