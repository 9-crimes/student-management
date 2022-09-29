<template>
  <div class="chengji-header" >
    <el-select
      v-model="stuClass"
      placeholder="请选择"
      style="margin-top: 20px; margin-left: 30px; float: left"
      @change="classSelect"
    >
      <el-option v-for="item in setClass" :key="item.label" :label="item.label" :value="item.label">
      </el-option>
    </el-select>
    <el-button type="primary" class="sort" @click="setSort">
      成绩排序
      <i class="el-icon-arrow-up" v-show="isSort != 'true' && isSort"></i>
      <i class="el-icon-arrow-down" v-show="isSort != 'true' && !isSort"></i>
    </el-button>
    <el-button @click="enter" type="primary" class="enter">录入成绩</el-button>
    <el-button @click="log" type="primary" class="log">打印成绩</el-button>
    <el-button type="primary" class="log" @click="isEchart">成绩统计分析</el-button>
  </div>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="stucode" label="学号"> </el-table-column>
    <el-table-column prop="name" label="姓名"> </el-table-column>
    <el-table-column :label="label">
      <template v-slot="scope">
        <el-button @click="setNum(scope)">
          {{ scope.row.score || "未输入" }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-card class="box-card" v-show="excelShow">
    <template #header>
      <div class="card-header">
        <span>点击下载Excel</span>
        <el-button class="button" type="text" @click="excelShow = false">关闭</el-button>
      </div>
    </template>
    <div class="text item">
      <a :href="excel" download="excel" target="_blank">点击下载</a>
    </div>
  </el-card>
  <echarts :option="option" v-if="isShow" @notShow="hide(value)"></echarts>

  <!-- 修改成绩弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="`修改学号为: ${showDataOption.user_id} 的学生${label}？`"
    :before-close="beforClose"
  >
    <table>
      <tr>
        <td></td>
        <td>占比</td>
        <td>分数</td>
      </tr>
      <tr>
        <td>平时成绩</td>
        <td>
          <el-input-number
            v-model="showDataOption.cumulative"
            :min="0"
            :max="100"
            @change="
              value => {
                showDataOption.end = 100 - value;
              }
            "
          />
        </td>
        <td>
          <el-input-number v-model="showDataOption.cumulative_count" :min="0" :max="100" />
        </td>
      </tr>
      <tr>
        <td>期末成绩</td>
        <td>
          <el-input-number
            v-model="showDataOption.end"
            :min="0"
            :max="100"
            @change="
              value => {
                showDataOption.cumulative = 100 - value;
              }
            "
          />
        </td>
        <td>
          <el-input-number v-model="showDataOption.end_count" :min="0" :max="100" />
        </td>
      </tr>
    </table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="setChengji">确认录入</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 录入成绩弹窗 -->
  <el-dialog
    v-model="dialogEnterVisible"
    :title="`录入${label}`"
  >
    <el-form label-width="80px">
      <el-form-item label="录入学生">
        <el-select v-model="showDataOption.user_id" placeholder="请选择">
          <el-option
            v-for="item in studentList"
            :key="item.username"
            :label="item.username"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
       <table>
        <tr>
          <td></td>
          <td>占比</td>
          <td>分数</td>
        </tr>
        <tr>
          <td>平时成绩</td>
          <td>
            <el-input-number
              v-model="showDataOption.cumulative"
              :min="0"
              :max="100"
              @change="
                value => {
                  showDataOption.end = 100 - value;
                }
              "
            />
          </td>
          <td>
            <el-input-number v-model="showDataOption.cumulative_count" :min="0" :max="100" />
          </td>
        </tr>
        <tr>
          <td>期末成绩</td>
          <td>
            <el-input-number
              v-model="showDataOption.end"
              :min="0"
              :max="100"
              @change="
                value => {
                  showDataOption.cumulative = 100 - value;
                }
              "
            />
          </td>
          <td>
            <el-input-number v-model="showDataOption.end_count" :min="0" :max="100" />
          </td>
        </tr>
      </table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogEnterVisible = false">关闭</el-button>
        <el-button type="primary" @click="setChengji">确认录入</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { api } from "@/api/api";
import { createAchievement, updateScore,  } from "@/api/achievement"
// import readUser from "@/modules/common/read-user";
// import updataScore from "@/api/common/updata-score";
import { teacherPrint } from "@/api/teacher";
import echarts from "@/components/echarts";
import { v4 } from "uuid";

let store = useStore();


let tableData = ref("");
let allData;
let subject = ref("");
let label = ref("");
api({
  col: 'teacher',
  select: {
    username: localStorage.teacher
  }
}).then((res) => {
  label.value = res.res[0].subject + "成绩";
  switch (res.res[0].subject) {
    case "创新与实践":
      subject.value = "innovate";
      break;
    case "马克思主义思想":
      subject.value = "marx";
      break;
    case "高等数学":
      subject.value = "math";
      break;
    case "VUE.js":
      subject.value = "vue";
      break;
    case "Node.js":
      subject.value = "node";
      break;
    case "MySQL数据库":
      subject.value = "mysql";
      break;
  }
  api({
    col: 'achievement',
  }).then(res => {
    tableData.value = res.res;
    allData = res.res;
    // 将授课科目的成绩单独处理为score
    tableData.value.forEach((el, i) => {
      tableData.value[i].score = tableData.value[i][subject.value];
    });
  })
})


let stuClass = ref("");
let setClass = ref([
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
]);
// 查询对应班级的学生的学号，将成绩总数据的表进行遍历，如果学号对得上，说明是这个班级的，就push到tableData里面
function classSelect() {
  api({
    col: 'student',
    select: {
      class: stuClass.value
    },
  }).then(res=> {
    let isClass = [];
    res.res.forEach((item, i) => {
      isClass.push(item.username);
    });
    tableData.value = [];
    allData.forEach((item, i) => {
      if (isClass.includes(item.stucode)) {
        tableData.value.push(item);
      }
    });
  })
}
// 获得焦点时候获取成绩存为变量，失去焦点时对比成绩是否有变化
let dialogVisible = ref(false);
let showDataOption = ref({
  user_id: "",
  //平时分、占比/期末分数、占比
  cumulative: 40,
  cumulative_count: 0,
  end: 60,
  end_count: 0,
});
const beforClose = () => {
  dialogVisible.value = false;
  showDataOption.value = {
    user_id: "",
    cumulative: 40,
    cumulative_count: 0,
    end: 60,
    end_count: 0,
  };
};
function setNum(scope) {
  showDataOption.value.user_id = scope.row.stucode;
  dialogVisible.value = true;
}

// 文本框失去焦点之后设置成绩
function setChengji() {
  let id = showDataOption.value.user_id; //ID
  let score = (
    (showDataOption.value.cumulative_count / 100) * showDataOption.value.cumulative +
    (showDataOption.value.end_count / 100) * showDataOption.value.end
  ).toFixed(0); //成绩计算
  if (dialogEnterVisible.value) { //新增
    let student = (studentList.value || []).find(item => id === item.username)
    createAchievement({
      username: id,
      name: student.name || '',
      score: score,
      subject: subject.value
    }).then(createRes => {
      if (createRes.res) {
        api({
          col: 'achievement',
        }).then(res => {
          ElMessage({
            message: `录入ID: ${id} 同学的${label.value}成绩为${score}`,
            type: "success",
            duration: 1000,
          });
          tableData.value = res.res;
          allData = res.res;
          // 将授课科目的成绩单独处理为score
          tableData.value.forEach((el, i) => {
            tableData.value[i].score = tableData.value[i][subject.value];
          });
        })
      } else {
        ElMessage({
          message: createRes.err && createRes.err.code == 11000 ? "不能重复录入" : "录入失败",
          type: "error",
        });
      }
      dialogEnterVisible.value = false;
    })
  } else {
    updateScore({ username: id, score: score, subject: subject.value }).then(res => {
      if (res.res) {
        ElMessage({
          message: `成功修改ID: ${id} 同学的${label.value}成绩为${score}`,
          type: "success",
          duration: 1000,
        });
        tableData.value.find(item => item.stucode == id).score = score;
      } else {
        ElMessage({
          message: "修改失败",
          type: "error",
        });
      }
      dialogVisible.value = false;
    })
  }

}
// 打印表格
let excel = ref("");
let excelShow = ref(false);
function log() {
  let data = {
    name: v4(),
    data: [],
  };
  excel.value = store.state.excel + data.name + ".xlsx";
  data.data.push(["姓名", "学号", "成绩"]);
  tableData.value.forEach((item, index) => {
    data.data.push([item.name, item.stucode, item.score == "" ? "未录入" : item.score]);
  });
  teacherPrint({ data: data }).then(res => {
    excelShow.value = true;
  });
}
// 生成表单
let option = ref({
  title: {
    text: "成绩展示",
    left: "center",
  },
  color: ["red", "green", "yellow", "blueviolet", "gray"],

  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: "50%",
      data: [
        { value: 0, name: "不及格" },
        { value: 0, name: "中等" },
        { value: 0, name: "良好" },
        { value: 0, name: "优秀" },
        { value: 0, name: "未登记" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});
let isShow = ref(false);
function isEchart() {
  // 每次设置数量时候先清空
  option.value.series[0].data.forEach((item, index) => {
    item.value = 0;
  });
  // 设置标题
  option.value.title.text = `${stuClass.value == "" ? "全部同学的" : stuClass.value}${label.value}`;
  // 遍历数组设置个数
  tableData.value.forEach((item, index) => {
    let i;
    if (+item.score < 60 && item.score != "") {
      i = 0;
    } else if (+item.score >= 60 && +item.score < 81) {
      i = 1;
    } else if (+item.score >= 80 && +item.score < 90) {
      i = 2;
    } else if (+item.score >= 89 && +item.score < 101) {
      i = 3;
    } else {
      i = 4;
    }
    option.value.series[0].data[i].value++;
  });
  isShow.value = true;
}
function hide(value) {
  isShow.value = false;
}

let isSort = ref("true");
function setSort() {
  function compare(sort) {
    return function (obj1, obj2) {
      var value1 = +obj1["score"];
      var value2 = +obj2["score"];
      return sort ? value1 - value2 : value2 - value1; // 升序
    };
  }
  var sortObj = tableData.value.sort(compare(isSort.value));
  tableData.value = sortObj;
  isSort.value = !!!isSort.value;
}

const dialogEnterVisible = ref(false)
const studentList = ref([])
api({
  col: 'student'
}).then(res=> {
  studentList.value = res.res
})
function enter() {
  dialogEnterVisible.value = true
}

</script>
<style scoped lang="scss">
.chengji-header {
  height: 70px;
}
.enter {
  float: right;
  margin-right: 30px;
  margin-top: 20px;
}
.log {
  float: right;
  margin-right: 30px;
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  position: fixed;
  top: 100px;
  left: calc((100vw - 480px) / 2);
}
.sort {
  float: left;
  margin-top: 20px;
  margin-left: 20px;
}
.shenqing {
  position: fixed;
  bottom: 80px;
  right: 50px;
}

.alert {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.3);
  .box {
    width: 300px;
    height: 250px;
    background: rgb(248, 248, 248);
    text-align: center;
    border-radius: 10px;
    margin: 0px auto;
    margin-top: 100px;
  }
  .el-input {
    width: 200px;
    margin-top: 30px;
  }
  .el-date-picker {
    margin-top: 20px;
  }
  .el-button {
    display: block !important;
    width: 200px;
    margin: 0px auto;
    margin-top: 20px;
  }
}
</style>
