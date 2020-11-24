// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'Home' },
    redirect: '/auth/login',
    children: [
        {
            path: '/auth',
            component: UserLayout,
            redirect: '/auth/login',
            hidden: true,
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/auth/Login')
                }
            ]
        },
        {
            path: '/stations',
            name: 'Stations',
            component: () => import('@/views/exam/Index'),
            meta: { title: 'StationList' },
            redirect: '/station/list',
            hideChildrenInMenu: true,
            children: [
                {
                    path: '/station/list',
                    name: 'StationList',
                    component: () => import('@/views/station/StationList'),
                    meta: { title: 'StationList', role: ['super', 'admin'] }
                }
            ]
        },
        {
            path: '/exams',
            name: 'Exam',
            component: () => import('@/views/exam/Index'),
            meta: { title: 'ShopList' },
            redirect: '/exams/list',
            hideChildrenInMenu: true,
            children: [
                {
                    path: '/exams/list',
                    name: 'ShopList',
                    component: () => import('@/views/exam/ExamList'),
                    meta: { title: '测评列表', role: ['super', 'admin'] }
                }
            ]
        },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/auth',
    component: UserLayout,
    redirect: '/auth/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/Login')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/exception/404')
  }
]
