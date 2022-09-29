const express = require('express')
const app = express()
const router = express.Router();

const db = require('../models/db.js')

router.post('/create-achievement', async (req, res) => {
    const { username, name, subject, score } = req.body
    let data = {
        stucode: username,
        name,
        time: new Date()
    }
    data[subject] = score
    new db.Achievement(data).save((err, result) => {
        res.json({
            res: typeof result == "object",
            msg: err ? '录入失败' : null,
            err: err,
        })
    })
})

router.post('/updata-score', (req, res) => {
    const { username, subject, score, name, isAdd } = req.body
    let data = {
        name: name,
    }
    data[subject] = score
    if (isAdd) {
        data.time = new Date()
    } 
    db.Achievement.updateOne({
        stucode: username,
    }, data, { upsert:true }, function(err, result) {
        res.json({
            res: result
        })
    })
})

module.exports = router;