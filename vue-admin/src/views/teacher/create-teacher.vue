<template>
  <el-form label-width="80px">
     <el-form-item label="登录工号">
      <el-input
        placeholder="请输入工号"
        v-model="username"
        clearable
      >
      </el-input>
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
      <el-select v-model="sex" placeholder="请选择">
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
      <el-select v-model="subject" placeholder="请选择">
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
      >添加教师</el-button
    >
  </el-form>
</template>
<script>
import { reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { createTeacher } from "@/api/teacher";

export default {
  setup () {
    const state = reactive({
      username: "",
      name: "",
      tel: "",
      sex: "男",
      sexs: [{
        label: "男",
      }, {
        label: "女",
      }],
      subject: "VUE.js",
      subjects: [{
        label: "VUE.js",
      },{
        label: "创新与实践",
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
      const { username, name, tel, sex, subject } = state
      let telTest = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      let nullTest = /^[\s\S]*.*[^\s][\s\S]*$/;
      let isCreate =
        nullTest.test(name) &&
        nullTest.test(tel) &&
        telTest.test(tel) && username;
      if (isCreate) {
        createTeacher({
          username: username,
          name: name,
          sex: sex,
          subject: subject,
          tel: tel,
        }).then((res) => {
          if (res.res) {
            ElMessage({
              message: `成功添加教师：${name},工号：${res.id}`,
              type: "success",
            });
            state.username = "";
            state.name = "";
            state.tel = "";
          } else {
             ElMessage({
              message: res.msg || '创建失败',
              type: "error",
            });
          }
          
        });
      } else {
        ElMessage.warning({
          message: "请按照正确格式填写全部内容",
          type: "warning",
        });
      }
    }
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