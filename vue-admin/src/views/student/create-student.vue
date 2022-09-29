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
    <el-form-item label="学生姓名">
      <el-input
        type="text"
        v-model="name"
        placeholder="填写学生姓名"
      ></el-input>
    </el-form-item>
    <el-form-item label="电话号码">
      <el-input
        type="text"
        v-model="tel"
        placeholder="填写学生电话"
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

    <el-form-item label="班级">
      <el-select v-model="stuClass" placeholder="请选择">
        <el-option
          v-for="item in setClass"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-button type="primary" icon="el-icon-check" @click="create"
      >添加学生</el-button
    >
  </el-form>
</template>
<script>
import { reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { createStudent } from "@/api/student";
// let name = ref("");
// let tel = ref("");
// let sex = ref("男");
// let sexs = ref([
//   {
//     label: "男",
//   },
//   {
//     label: "女",
//   },
// ]);
// let stuClass = ref("软件工程1班");
// let setClass = ref([
//   {
//     label: "软件工程1班",
//   },
//   {
//     label: "软件工程2班",
//   },
//   {
//     label: "软件工程3班",
//   },
//   {
//     label: "软件工程4班",
//   },
//   {
//     label: "软件工程5班",
//   },
//   {
//     label: "软件工程6班",
//   },
// ]);
// // 将成绩表和学生绑定
// function create() {
//   let telTest = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
//   let nullTest = /^[\s\S]*.*[^\s][\s\S]*$/;
//   let isCreate =
//     nullTest.test(name.value) &&
//     nullTest.test(tel.value) &&
//     telTest.test(tel.value);
//   let id = "s" + new Date().getTime();
//   if (isCreate) {
//     createStudent({
//       name: name.value,
//       sex: sex.value,
//       class: stuClass.value,
//       tel: tel.value,
//     }).then((res) => {
//       ElMessage({
//         message: `成功添加学生:${name.value},学号：${res.id}`,
//         type: "success",
//       });
//       name.value = "";
//       tel.value = "";
//     });
//   } else {
//     ElMessage.warning({
//       message: "请按照正确格式填写全部内容",
//       type: "warning",
//     });
//   }
// }
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
      stuClass: "软件工程1班",
      setClass: [
        {
          label: "软件工程1班",
        },
        {
          label: "软件工程2班",
        },
        {
          label: "软件工程3班",
        },
        {
          label: "软件工程4班",
        },
        {
          label: "软件工程5班",
        },
        {
          label: "软件工程6班",
        },
      ],
    })
    const create = () => {
      const { username, name, tel, sex, stuClass } = state
      let telTest = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      let nullTest = /^[\s\S]*.*[^\s][\s\S]*$/;
      let isCreate =
        nullTest.test(name) &&
        nullTest.test(tel) &&
        telTest.test(tel) && username;
      if (isCreate) {
        createStudent({
          username: username,
          name: name,
          sex: sex,
          stuClass: stuClass,
          tel: tel,
        }).then((res) => {
          if (res.res) {
            ElMessage({
              message: `成功添加学生：${name},工号：${res.id}`,
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
  margin-left: 0px  !important;;
}
</style>