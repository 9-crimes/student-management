<template>
    <div class="login-box">
        <el-input
            placeholder="请输入账号"
            v-model="user"
            clearable
            prefix-icon="el-icon-user"
        >
        </el-input>
        <el-input
            placeholder="请输入密码"
            v-model="password"
            show-password
            clearable
            prefix-icon="el-icon-key"
            style="margin-top: 20px"
        ></el-input>
        <el-input
            v-if="!isLogin"
            placeholder="请再次输入密码"
            v-model="conpassword"
            show-password
            clearable
            prefix-icon="el-icon-key"
            style="margin-top: 20px"
        ></el-input>
        <el-select v-model="id" :disabled="!isLogin" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <el-button v-if="isLogin" type="primary" @click="loginClick">登录</el-button>
        <el-button v-else type="primary" @click="signupClick">注册</el-button>
        <div class="bottom">
            <span v-if="isLogin" @click="isLogin=false; id='admin'">立即注册</span>
            <span v-else @click="isLogin=true;id='student'">已有账号？立即登录</span>
        </div>
    </div>
</template>

<script>
import { reactive, onMounted, onUnmounted, toRefs } from "vue";
import { login, signup } from '../../api/login.js'
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export default {
    setup () {
        let router = useRouter();
        const state = reactive({
            options: [
                {
                    label: "学生",
                    value: "student",
                },
                {
                    label: "教师",
                    value: "teacher",
                },
                {
                    label: "管理员",
                    value: "admin",
                },
            ],
            user: '',
            password: '',
            conpassword: '',
            id: 'student',
            isLogin: true,
        })
        const signupClick = () => {
            let { user, password, conpassword, id } = state
             if (user == "" || password == "" || conpassword == "") {
                ElMessage({
                message: "请将信息填写完整",
                type: "error",
                });
                return;
            }
            if ( password != conpassword) {
                ElMessage({
                message: "两次输入密码不一致",
                type: "error",
                });
                return;
            }
            signup({
                type: id,
                username: user,
                password: password,
            }).then((res) => {
                if (res.res) {
                    ElMessage({
                        message: "注册成功",
                        type: "success",
                    });
                } else {
                    ElMessage({
                        message: res.msg || '注册失败',
                        type: "error",
                    });
                }
            })
        }
        const loginClick = () => {
            let { user, password, id } = state
            if (user == "" || password == "") {
                ElMessage({
                message: "请将信息填写完整",
                type: "error",
                });
            } else {
                login({
                    col: id,
                    id: user,
                    password: password,
                }).then((res) => {
                    if (res.res) {
                        localStorage.id = res.id; //身份
                        localStorage.user = res.user; //账号
                        localStorage[res.id] = user;
                        let go =
                        res.id == "admin"
                            ? "create-teacher"
                            : res.id == "teacher"
                            ? "read-student"
                            : "student-score";
                        router.replace({ path: `/${go}`, query: { user: user } });
                    } else {
                        ElMessage({
                            message: "账号或密码错误",
                            type: "error",
                        });
                    }
                })
            }
        }
        onMounted(() => {
            document.body.classList.add("login");
        });
        onUnmounted(() => {
            document.body.classList.remove("login");
        });
        return {
            ...toRefs(state),
            loginClick,
            signupClick,
        }
    },
}   
</script>

<style scoped lang="scss">
.login-box {
    text-align: center;
    width: 400px;
    // height: 280px;
    margin: 0 auto;
    background-color: white;
    top: calc((100vh - 310px) / 2);
    position: relative;
    border-radius: 10px;
    padding: 30px 30px 10px;
    box-sizing: border-box;
}
.el-input {
    width: 100%;
    display: block;
    margin: 0px auto;
}

.el-select {
    width: 100%;
    margin-top: 30px;
    margin-left: 0px !important;
}
.el-button {
    width: 100%;
    margin-top: 30px;
}
.bottom {
    text-align: right;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #eee;
    span {
        font-size: 14px;
        color: #4e4e4e;
    } 
}
</style>