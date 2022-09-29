const express = require('express');
const app = express();
// 资源跨域
const cors = require('cors');
app.use(cors())
// 接收post请求
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// 文件上传包
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use('/excel',express.static('excel'));

app.use('/', require('./route/api')); //复用接口
app.use('/', require('./route/login')); //登录

app.use('/', require('./route/teacher')); //教师接口
app.use('/', require('./route/student')); //学生接口
app.use('/', require('./route/user')); //user
app.use('/', require('./route/achievement')); //成绩接口

const port = 5000;
app.listen(port, () => console.log(`监听端口:${port}`));
