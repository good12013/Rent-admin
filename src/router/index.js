import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/home',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Home', icon: 'component' }
    }]
  },
  {
    path: '/scene',
    component: Layout,
    redirect: '/scene/list',
    meta: { title: 'Station Manage', icon: 'international' },
    children: [
      {
        path: 'list',
        name: 'SceneList',
        component: () => import('@/views/scene/list'),
        meta: { title: 'Station List',keepAlive: true}
      }
    ]
  },
  {
    path: '/live',
    component: Layout,
    redirect: '/live/list',
    meta: { title: 'Shop Manage', icon: 'eye-open' },
    children: [
      {
        path: 'list',
        name: 'LiveList',
        component: () => import('@/views/live/list'),
        meta: { title: 'Shop List'}
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/live/detail'),
        name: 'LiveList',
        meta: { title: 'Shop List', activeMenu: '/live/list' },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/list',
  //   children: [{
  //     path: 'list',
  //     name: 'UserList',
  //     component: () => import('@/views/user/list'),
  //     meta: { title: '用户管理', icon: 'peoples' }
  //   }]
  // },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/role',
  //   children: [{
  //     path: '/role',
  //     name: 'Role',
  //     component: () => import('@/views/permission/role'),
  //     meta: { title: '权限管理', icon: 'lock' }
  //   }]
  // },
  // {
  //   path: '/keywords',
  //   component: Layout,
  //   redirect: '/keywords/list',
  //   children: [{
  //     path: '/list',
  //     name: 'Keywords',
  //     component: () => import('@/views/keywords/list'),
  //     meta: { title: '标签', icon: 'search' }
  //   }]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()





export default router
