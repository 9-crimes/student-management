const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/school',{
    useNewUrlParser:true,
    useUnifiedTopology: true,
}); 

const userSchema = new mongoose.Schema({
    username: { // 登录账号
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: String,
    type: {
        type: String,
        default: 'student',
        'enum': ['admin', 'teacher', 'student'],
    }
})

const achievementSchema = new mongoose.Schema({
    stucode: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    vue: String,
    node: String,
    marx: String,
    english: String,
    mysql: String,
    math: String,
    time: Date,
})

const adminSchema = new mongoose.Schema({
    user: { // 关联的用户账号
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
    },
    password: String,
})

const studentSchema = new mongoose.Schema({
    user: { // 关联的用户账号
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
    }, //登录账号
    password: String,
    name: String,
    sex: String,
    tel: String,
    class: String, // 班级
    time: Date,
})

const teacherSchema = new mongoose.Schema({
    user: { // 关联的用户账号
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
    }, //登录账号
    password: String,
    name: String,
    sex: String,
    tel: String,
    subject: String, // 课程
    time: Date,
})

const Models = {
    User: mongoose.model('User', userSchema),
    Achievement: mongoose.model('Achievement', achievementSchema),
    Admin: mongoose.model('Admin', adminSchema),
    Student: mongoose.model('Student', studentSchema),
    Teacher: mongoose.model('Teacher', teacherSchema)
}

module.exports = Models