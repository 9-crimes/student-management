<template>
  <el-form>
    <el-form-item label="管理员账号">
      <el-input v-model="user" clearable placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item label="管理员密码">
      <el-input v-model="password" show-password clearable placeholder="密码"></el-input>
    </el-form-item>
    <el-button type="primary" plain @click="updateAdmin">确认修改</el-button>
  </el-form>
</template>
<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { api, update } from "@/api/api";
// let router = useRouter();
// let user = ref("");
// let password = ref("");
// let test = /^[\s\S]*.*[^\s][\s\S]*$/;

// readStudent({ col: "admin", id: localStorage.admin }).then((res) => {
//   user.value = res.res[0].id;
//   password.value = res.res[0].password;
// });

// function updata() {
//   let isUpdata = test.test(user.value) && test.test(password.value);
//   api(
//     `UPDATE admin SET id='${user.value}', password='${password.value}' where id='${localStorage.admin}';`
//   ).then((res) => {
//     localStorage.clear();
//     router.replace('/logn')
//   });
// }
export default {
  setup () {
    let test = /^[\s\S]*.*[^\s][\s\S]*$/;
    let router = useRouter();
    const state = reactive({
      user: "",
      password: "",
      userId: "",
      id: ""
    })
    const updateAdmin = () => {
      update({
        type: 'admin',
        id: state.id,
        user: state.userId,
        username: state.user,
        password: state.password,
      }).then((res) => {
        if (res.res) {
          localStorage.clear();
          router.replace('/login')
        }
      });
    }
    onMounted(() => {
      api({
        col: 'admin',
        select: {
          username: localStorage.admin,
        },
      }).then((res) => {
        let data = res.res[0];
        state.id = data._id
        state.userId = data.user
        state.user = data.username
        state.password = data.password
      })
    })
    return {
      ...toRefs(state),
      updateAdmin,
    }
  }
}
</script>
<style scoped lang='scss'>
.el-form-item {
  width: 400px !important;
  display: flex;
  margin: 0px auto;
  margin-top: 30px;
}
.el-button {
  width: 300px;
  margin: 0px auto;
  margin-top: 30px;
  display: block;
}
</style>