const express = require('express')
const app = express()
const router = express.Router();
var xlsx = require('node-xlsx').default;
const fs = require('fs')

const db = require('../models/db.js')

router.post('/create-teacher', async (req, res) => {
    const { username, name, sex, tel, subject} = req.body
    new db.User({
        username: username,
        password: '123456',
        type: 'teacher'
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
            subject,
            time: new Date()
        }
        new db.Teacher(data).save((err, result) => {
            res.json({
                res: typeof result == "object",
                msg: err ? '创建失败' : null,
                id: username,
            })
        })
    })
})

router.post('/teacher-print', (req, res) => {
    const options = {
        '!cols': [{
            wch: 16
        }, {
            wch: 17
        }, {
            wch: 10
        }]
    };
    var buffer = xlsx.build([{
        name: "mySheetName",
        data: req.body.data.data
    }], options); // Returns a buffer
    fs.writeFile(`./excel/${req.body.data.name}.xlsx`, buffer, function (err) {
        res.json({
            res: true
        })
    })
})

router.post('/upload-excel', (req, res) => {
    let name = Object.keys(req.files)[0];
    let time = new Date().getTime();
    fs.writeFile(`./excel/${time}.xlsx`, req.files[name].data, function (err) {
        var sheets = xlsx.parse(`./excel/${time}.xlsx`); //获取到所有sheets;
        let fromData = [];
        sheets.forEach(function (sheet) {
            sheet['data'].splice(0, 1) //把第一个删掉
            for (var rowId in sheet['data']) {
                var row = sheet['data'][rowId];
                // 判断成绩范围
                if (+row[2] > -1 && +row[2] < 101) {
                    fromData.push({
                        name: row[0],
                        stucode: row[1],
                        score: row[2]
                    })
                    let obj  = {}
                    if (name) {
                        obj[name] = row[2]
                    }
                    db.Achievement.updateOne({
                        stucode: row[1],
                    }, obj, function (err, result) {})
                }
            }
        });
        res.json({
            data: fromData
        })
        setTimeout(() => {
            fs.unlinkSync(`./excel/${time}.xlsx`)
        }, 10000);
    })
})

router.post('/delete-file', (req, res)=>{
    const fileName = req.body.fileName
    fs.unlink(`./excel/${fileName}.xlsx`, (err) => {
        res.json({
            res: err ? false : true
        })
    })
})

module.exports = router;