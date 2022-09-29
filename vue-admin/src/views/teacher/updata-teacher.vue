<template>
  <el-form label-width="80px">
    <el-form-item label="教师工号">
      <el-input type="text" v-model="id" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input show-password clearable v-model="password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item label="教师姓名">
      <el-input
        type="text"
        v-model="name"
        placeholder="填写教师姓名"
      ></el-input>
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input
        type="text"
        v-model="tel"
        placeholder="填写教师电话"
        maxlength="11"
      ></el-input>
    </el-form-item>

    <el-form-item label="性别">
      <el-select v-model="sex" placeholder="请选择" :disabled="isTeacher">
        <el-option
          v-for="item in sexs"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="任课">
      <el-select v-model="subject" placeholder="请选择" :disabled="isTeacher">
        <el-option
          v-for="item in subjects"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-button type="primary" icon="el-icon-check" @click="create"
      >确认修改</el-button
    >
  </el-form>
</template>
<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { api, update } from "@/api/api";


export default {
  setup() {
    let route = useRoute();
    const state = reactive({
      user: "", //用户id
      isTeacher: localStorage.id == "teacher",
      id: "",
      name: "",
      tel: "",
      sex: "男",
      sexs: [{
        label: "男",
      }, {
        label: "女",
      }],
      password: "",
      subject: 'VUE.js',
      subjects: [{
        label: "VUE.js",
      },{
        label: "英语",
      },{
        label: "马克思主义思想",
      }, {
        label: "高等数学",
      }, {
        label: "Node.js",
      }, {
        label: "MySQL数据库",
      }]
    })
    const create = () => {
      let telTest = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      let nullTest = /^[\s\S]*.*[^\s][\s\S]*$/;
      let isCreate =
        nullTest.test(state.name) &&
        nullTest.test(state.tel) &&
        telTest.test(state.tel);
      if (isCreate) {
        update({
          type: 'teacher',
          id: route.query.id,
          user: state.user,
          name: state.name,
          tel: state.tel,
          sex: state.sex,
          subject: state.subject,
          password: state.password,
        }).then((res) => {
          if (res.res) {
            ElMessage({
              message: `修改成功`,
              type: "success",
            });
          } else {
            ElMessage({
              message: `修改失败`,
              type: "error",
            });
          }
        })
      } else {
        ElMessage.warning({
          message: "请按照正确格式填写全部内容",
          type: "warning",
        });
      }
    }

    onMounted(() => {
      let select = {}
      if(route.query.id) {
        select = {
          _id: route.query.id,
        }
      } else {
        select = {
          username: route.query.name,
        }
      }
      api({
        col: 'teacher',
        select: select,
      }).then((res) => {
        let data = res.res[0];
        state.user = data.user
        state.name = data.name;
        state.id = data.username;
        state.tel = data.tel;
        state.sex = data.sex;
        state.subject = data.subject;
        state.password = data.password;
      })
    })
    return {
      ...toRefs(state),
      create,
    }
  }
}
</script>
<style scoped lang='scss'>
.el-form-item {
  width: 400px;
  margin: 0px auto;
  margin-top: 30px;
}
.el-button {
  width: 400px;
  margin: 0px auto;
  margin-top: 30px;
  display: block;
}
.el-select {
  margin-top: 0px !important;
  margin-left: 0px !important;
}
</style>