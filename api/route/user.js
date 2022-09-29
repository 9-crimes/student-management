const express = require('express')
const app = express()
const router = express.Router();

let db = require('../models/db')

router.post('/delete-user', (req, res) => {
    const { id, col } = req.body
    let biaomin = col.slice(0,1).toUpperCase() + col.slice(1).toLowerCase();
    db.User.deleteOne({_id: id}, function(userErr, userResult) {
        if (userErr) {
            res.json({
                res: typeof userResult == "object" &&  !userErr ? true: false,
                msg: typeof userResult == "object" && !userErr ? null : '删除失败'
            })
            return
        }
        db[biaomin].deleteOne({user: id}, function(err, result) {
            res.json({
                res: typeof result == "object" && !err ? true: false,
                msg: typeof result == "object" && !err ? null : '删除失败'
            })
        })
    })
})
module.exports = router;