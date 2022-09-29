<template>
  <el-select v-model="subject" placeholder="请选择" @change="select">
    <el-option
      v-for="item in subjects"
      :key="item.label"
      :label="item.label"
      :value="item.label"
    >
    </el-option>
  </el-select>
  <el-table
    :data="tableData"
    style="width: 100%"
    :default-sort="{ prop: 'time', order: 'descending' }"
  >
    <el-table-column label="工号" width="180">
      <template v-slot="scope">
        <span @click="change(scope)">{{ scope.row.username }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="姓名" width="100"> </el-table-column>
    <el-table-column prop="sex" label="性别" width="80"> </el-table-column>
    <el-table-column prop="subject" label="授课" width="160"> </el-table-column>
    <el-table-column prop="tel" label="手机号码" width="180"> </el-table-column>
    <el-table-column prop="time" label="入职日期" width="200" sortable>
    </el-table-column>
    <el-table-column label="删除">
      <template v-slot="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="remove(scope.row.user, scope.$index)"
          ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { api } from "@/api/api";
import { deleteUser } from "@/api/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  setup () {
    let router = useRouter();
    const state = reactive({
      tableData: [],
      subject: 'VUE.js',
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
    const change = (data) => {
      console.log(data.row._id)
      router.push({ path: "/updata-teacher", query: { id: data.row._id } });
    }
    const remove = (id, index) => {
      deleteUser({ col: "teacher", id: id }).then((res) => {
        if (res.res) {
          router.go(0);
        } else {
          ElMessage({
            message: res.msg || '删除失败',
            type: "error",
          })
        }
      })
    }
    const select = () => {
      api({
        col: 'teacher',
        select: {
          subject: state.subject,
        },
      }).then((res) => {
        state.tableData = res.res;
      });
    }
    onMounted(() =>{
      api({
        col: 'teacher'
      }).then((res) => {
        state.tableData = res.res;
      });
    })
    return {
      ... toRefs(state),
      change,
      remove,
      select,
    }
  }
}
</script>
<style scoped lang='scss'>
.el-select {
  margin-top: 20px;
  margin-left: 30px;
}
</style>