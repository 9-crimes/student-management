const express = require('express')
const app = express()
const router = express.Router();

let db = require('../models/db')

router.post('/api', (req, res) => {
    let biaomin = req.body.col.slice(0,1).toUpperCase() + req.body.col.slice(1).toLowerCase();
    let data = {}
    if (req.body.select) {
        data = {
            ...req.body.select
        }
        //  模糊查询
        if (req.body.isOr && req.body.col == 'student') {
            var query = new RegExp(req.body.select.name)
            data = {
                $or: [{
                    "name": query,
                }]
            }
        }
    }
    db[biaomin].find(data, (err, result) => {
        res.json({
            res:result
        })
    })
})

//修改人员信息的复用方法
router.post('/update', (req, res) => {
    let biaomin = req.body.type.slice(0,1).toUpperCase() + req.body.type.slice(1).toLowerCase();
    let userData = {
        password: req.body.password, 
    }
    if (req.body.type === 'admin') {
        userData.username = req.body.username
    }
    db.User.findByIdAndUpdate(req.body.user, userData, (userErr, userResult) => {
        if(userErr) {
            res.json({
                res: userErr ? false: true,
                msg:userErr ? '修改失败' : null
            })
            return
        }
        const id = req.body.id
        const data = JSON.parse(JSON.stringify(req.body))
        delete data.id
        delete data.type
        delete data.user
        db[biaomin].findByIdAndUpdate(id, data, (err, result) =>{
            res.json({
                res: err ? false: true,
                msg: err ? '修改失败' : null
            })
        })
    })
})



module.exports = router;