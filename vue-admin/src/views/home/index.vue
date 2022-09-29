<template>
   <component :is="nav"></component>
  <div class="title">
    {{ title }}
    <div class="back" title="点击退出系统" @click="back">
      <i class="el-icon-back"></i>
      退出系统
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import { computed, reactive, toRefs, onUnmounted } from 'vue'
import { useRouter } from "vue-router";
import admin from "@/components/nav-admin";
import teacher from "@/components/nav-teacher";
import student from "@/components/nav-student";

export default {
    setup() {
        const router = useRouter();
        let name = localStorage.user;
        if (name == undefined) {
            console.log(router)
            router.replace("/login");
        }
        document.body.style.paddingLeft = "200px";
        const state = reactive({
            nav: computed(()=> {
                return localStorage.id == "admin" ? admin : localStorage.id == "teacher" ? teacher : student;
            }),
            title: computed(() => {
                let obj = {
                    "student": '学生',
                    "teacher": '老师',
                    "admin": '管理员'
                }
                return obj[localStorage.id]
            })
        })
        const back = () => {
            localStorage.clear();
            router.replace("/login");
        }
        onUnmounted(() => {
            document.body.style.paddingLeft = "0px";
            document.body.classList.add("login");
        });
        return {
            ...toRefs(state),
            back,
        }
    },
}
</script>

<style scoped lang="scss">
.title {
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: #545c64;
  color: white;
}
.back {
  float: right;
  font-size: 14px;
  margin-right: 20px;
  color: white;
}
</style>