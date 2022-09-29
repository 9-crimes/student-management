import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue'),
    children: [{
      path: '/create-teacher',
      name: 'createTeacher',
      component: () => import('../views/teacher/create-teacher.vue')
    }, {
      path: '/read-teacher',
      name: 'readTeacher',
      component: () => import('../views/teacher/read-teacher.vue')
    }, {
      path: '/updata-teacher',
      name: 'updataTeacher',
      component: () => import('../views/teacher/updata-teacher.vue')
    }, {
      path: '/updata-admin',
      name: 'updataAdmin',
      component: () => import('../views/admin/updata-admin.vue')
    }, {
      path: '/admin-chengji',
      name: 'adminChengji',
      component: () => import('../views/admin/admin-chengji.vue')
    }, {
      path: '/read-student',
      name: 'readStudent',
      component: () => import('../views/student/read-student.vue')
    }, {
      path: '/create-student',
      name: 'createStudent',
      component: () => import('../views/student/create-student.vue')
    }, {
      path: '/updata-student',
      name: 'updataStudent',
      component: () => import('../views/student/updata-student.vue')
    }, {
      path: '/student-score',
      name: 'student-score',
      component: () => import('../views/student/student-score.vue')
    }, {
      path: '/teacher-chengji',
      name: 'teacherChengji',
      component: () => import('../views/teacher/teacher-chengji.vue')
    }, {
      path: '/teacher-excel',
      name: 'teacher-excel',
      component: () => import('../views/teacher/teacher-excel.vue')
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
