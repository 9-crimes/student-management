const express = require('express')
const app = express()
const router = express.Router();
let db = require('../models/db')

//注册用户名和密码
router.post('/signup', function(req, res) {
    let biaomin = req.body.type.slice(0,1).toUpperCase() + req.body.type.slice(1).toLowerCase();
    new db.User(req.body).save((err, result) => {
        if (err) {
            res.json({
                res: err ? false : true,
                msg: err ? (err.code === 11000 ? '账号不能重复' : '注册失败') : null,
            })
            return
        }
        new db[biaomin]({
            user: result._id,
            username: req.body.username,
            password: req.body.password,
            time: new Date(),
        }).save((err1, result1) => {
            res.json({
                res: err1 ? false : true,
                msg: err1 ? (err1.code === 11000 ? '账号不能重复' : '注册失败') : null,
            })
        })
        
    })
})

router.post('/login', (req, res) => {
    let biaomin = req.body.col.slice(0,1).toUpperCase() + req.body.col.slice(1).toLowerCase();
    db[biaomin].findOne({
        username: req.body.id
    }, (err, result) => {
        res.json({
            res: err || !result ? false : true,
            id: req.body.col,
            user: req.body.id
        })
    })
})

module.exports = router;