<template>
  <div>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="key" label="说明"> </el-table-column>
      <el-table-column prop="value" label="结果"> </el-table-column>
    </el-table>
    <el-button type="primary" icon="el-icon-download" @click="log"
      >打印成绩</el-button
    >
    <el-card class="box-card" v-if="isShow">
      <template #header>
        <div class="card-header">
          <span>下载成绩</span>
          <el-button class="button close" type="text" @click="isShow = false"
            >关闭</el-button
          >
        </div>
      </template>
      <div class="text item">
        <a :href="store.state.excel + url + '.xlsx'">点击下载成绩</a>
      </div>
    </el-card>
    <div class="alert" v-if="isShow"></div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { api } from "@/api/api";
import { teacherPrint } from "@/api/teacher";

let store = useStore();
let url = ref("");
let tableData = ref([]);
let all = ref(0);
let gpa = ref(0);
let num = ref(0);

let data = ref([]);

api({
  col: 'achievement',
  select: {
    stucode: localStorage.student
  }
}).then((res) => {
  tableData.value = res.res;
  let objData = res.res[0] || {}
  let value = Object.keys(objData);
  let tmpData = ['vue', 'node', 'marx', 'innovate', 'mysql', 'math']
  value.forEach((item, index) => {
    if (tmpData.includes(item)) {
      if (+objData[item]) {
        all.value += +objData[item];
        num.value++;
      }
      if (+objData[item] > 90) {
        gpa.value += 4;
      } else if (+objData[item] > 80) {
        gpa.value += 3;
      } else if (+objData[item] > 70) {
        gpa.value += 2;
      } else if (+objData[item] > 60) {
        gpa.value += 1;
      }
    }
  });
  let keyObj = {
    "学号": 'stucode',
    "姓名": 'name',
    "VUE": 'vue',
    "Node.js": 'node',
    "马克思主义哲学": 'marx',
    "创新与实践": 'innovate',
    "MySQL": 'mysql',
    "高等数学": 'math',
  }

  Object.keys(keyObj).forEach((item, index) => {
    let val = keyObj[item]
    data.value.push({
      key: item,
      value: objData[val] || '',
    });
  });
  data.value.push({
    key: '平局绩点',
    value: (gpa.value / num.value).toFixed(2)
  })
  data.value.push({
    key: '平均分',
    value: (all.value / num.value).toFixed(2)
  })
  data.value.push({
    key: '总分',
    value: all.value
  })
})
let isShow = ref(false);
function log() {
  let data = [];
  let keyObj = {
    "姓名": 'name',
    "学号": 'stucode',
    "VUE": 'vue',
    "Node.js": 'node',
    "马克思主义哲学": 'marx',
    "创新与实践": 'innovate',
    "MySQL": 'mysql',
    "高等数学": 'math',
  }
  data = [Object.keys(keyObj)]
  data[0].push("总分")
  let newData = []
  Object.keys(keyObj).forEach((item, index) => {
    let val = keyObj[item]
    newData.push(tableData.value[0][val] || '')
  });
  newData[newData.length] = all.value;
  data.push(newData);
  console.log(data)
  let print = {
    name: localStorage.student + "同学的成绩单",
    data: data,
  };
  teacherPrint({ data: print }).then((res) => {
    isShow.value = true;
    url.value = print.name;
  });
}

</script>
<style scoped lang='scss'>
.box-card {
  width: 500px !important;
  height: 400px !important;
  position: fixed;
  top: 200px;
  left: calc((100vw - 500px) / 2);
  z-index: 99999;
}
.close {
  float: right;
}
.alert {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}
</style>