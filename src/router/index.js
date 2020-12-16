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
    path: '/station',
    component: Layout,
    redirect: '/station/list',
    meta: { title: 'Station Manage', icon: 'international' },
    children: [
      {
        path: 'list',
        name: 'SceneList',
        component: () => import('@/views/station/list'),
        meta: { title: 'Station List',keepAlive: true}
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/list',
    meta: { title: 'Shop Manage', icon: 'eye-open' },
    children: [
      {
        path: 'list',
        name: 'LiveList',
        component: () => import('@/views/shop/list'),
        meta: { title: 'Shop List'}
      },
      {
        path: 'detail',
        component: () => import('@/views/shop/detail'),
        name: 'LiveList',
        meta: { title: 'Shop List', activeMenu: '/shop/list' },
        hidden: true
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()





export default router
