import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'dashboard', icon: 'dashboard' }
    }]
  },
  {
    path:'/user',
    name:'user',
    meta:{
      title:'用户管理'
    },
    component:Layout,
    children:[
      {
        path:'userList',
        name:'userList',
        meta:{
          title:'后台用户'
        },
        component:() => import('@/views/user-list')
      },
      {
        path:'accountList',
        name:"accountList",
        meta:{
          title:'机器人用户'
        },
        component:() => import('@/views/account-list')
      },
      {
        path:"access",
        name:"access",
        meta:{
          title:"机器人过滤设置"
        },
        component:() => import('@/views/access-config')
      }
    ]
  },
  {
    path:"/rate",
    name:"rate",
    meta:{
      title:'汇率管理'
    },
    component:Layout,
    children:[
      {
        path:'rate-list',
        meta:{
          title:'汇率管理'
        },
        component:() => import('@/views/rate-list')
      },
      {
        path:"enery-list",
        meta:{
          title:'USDT能量汇率/手续费',
        },
        component:() => import('@/views/enery-list')
      },
    ]
  },
  {
    path:'/cunntasan',
    name:'流水记录',
    component:Layout,
    meta:{
      title:"流水记录"
    },
    children:[
      {
        path:'bill',
        meta:{
          title:'流水记录'
        },
        component:() =>import('@/views/bill-list')
      }
    ]
  },
  {
    path:'/rechargeAddress',
    name:"rechargeAddress",
    component:Layout,
    meta:{
      title:"充值设置"
    },
    children:[
      {
        path:'alipay',
        name:'alipay',
        meta:{
          title:"支付设置"
        },
        component:() => import('@/views/recharge-address')
      },
      {
        path:'redpack',
        name:'redpack',
        meta:{
          title:'红包设置'
        },
        component:() => import('@/views/redpack/index.vue')
      }
    ]
  },
  {
    path:'/address',
    name:'address',
    component:Layout,
    children:[
      {
        path:"/addressList",
        name:'addressList',
        meta:{
          title:"地址管理"
        },
        component:() => import('@/views/address-list')
      }
    ]
  },
  {
    path:'/messageTemplate',
    name:"messageTemplate",
    meta:{
      title:'机器人管理'
    },
    component:Layout,
    children:[
      {
        path:'keyList',
        name:'keyList',
        meta:{
          title:'变量管理'
        },
        component:() => import('@/views/command-list')
      },
      {
        path:'templateList',
        name:'templateList',
        meta:{
          title:'消息模板'
        },
        component:() => import('@/views/template-list')
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
