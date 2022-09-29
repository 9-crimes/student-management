const express = require('express')
const app = express()
const router = express.Router();

const db = require('../models/db.js')

router.post('/create-student', async (req, res) => {
    console.log(req.body)
    const { username, name, sex, tel, stuClass} = req.body
    new db.User({
        username: username,
        password: '123456',
        type: 'student'
    }).save((userErr, userResult) => {
        if (userErr) {
            res.json({
                res: userErr ? false : true,
                msg: userErr ? (userErr.code === 11000 ? '工号不能重复' : '创建失败') : null,
                id: username,
            })
            return
        }
        let data = {
            user: userResult._id,
            username: username,
            password: '123456',
            name,
            sex,
            tel,
            class: stuClass,
            time: new Date()
        }
        new db.Student(data).save((err, result) => {
            console.log('result', result, username)
            res.json({
                res: typeof result == "object",
                msg: err ? '创建失败' : null,
                id: username,
            })
        })
    })
})

module.exports = router;