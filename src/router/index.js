import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [
    { path: '*', component: () => import('../components/404'), name: '404' },
    { path: '/', component: () => import('../components/Login'), name: '登陆' },
    {
      path: '/home', component: () => import('../components/Home'),
      // meta: [{ loginAuth: true }],
      // redirect:'/index',
      children: [
        //首页及用户
        {
          path: '/index', component: () => import('../components/component1/index'),
          meta: { loginAuth: true },
          name: [{ name: '首页', path: '/index' }]
        },
        {
          path: '/error', component: () => import('../components/component1/error'),
          meta: { loginAuth: true },
          name: [{ name: '权限不足', path: '/error' }]
        },
        {
          path: '/user', component: () => import('../components/component1/user'),
          name: [{ name: '用户管理', path: '/user' }],
          meta: { loginAuth: true, auth: '系统管理' }
        },
        {
          path: '/user/adduser', component: () => import('../components/component2/addUser'),
          name: [{ name: '用户管理', path: '/user' }, { name: '添加用户', path: '/user/adduser' }],
          meta: { loginAuth: true, auth: '系统管理' },
        },
        //采购
        {
          path: '/buy/supplier', component: () => import('../components/component1/supplier'),
          name: [{ name: '供应商管理', path: '/buy/supplier' }],
          meta: { loginAuth: true, auth: '采购管理' },
        },
        {
          path: '/buy/supplier/addsupp', component: () => import('../components/component2/addSupp'),
          meta: { loginAuth: true, auth: '采购管理' },
          name: [{ name: '供应商管理', path: '/buy/supplier' }, { name: '添加供应商', path: '/buy/supplier/addsupp' }]
        },
        {
          path: '/buy/pomain', component: () => import('../components/component1/pomain'),
          meta: { loginAuth: true, auth: '采购管理' },
          name: [{ name: '采购单管理', path: '/buy/pomain' }]
        },
        {
          path: '/buy/pomain/addpomain', component: () => import('../components/component2/addpomain'),
          meta: { loginAuth: true, auth: '采购管理' },
          name: [{ name: '采购单管理', path: '/buy/pomain' }, { name: '新添采购单', path: '/buy/pomain/addpomain' }]
        },
        {
          path: '/buy/pomainover', component: () => import('../components/component1/pomainOver'),
          meta: { loginAuth: true, auth: '采购管理' },
          name: [{ name: '采购单了结', path: '/buy/pomain' }]
        },
        {
          path: '/buy/pomainsearch', component: () => import('../components/component1/pomainSearch'),
          meta: { loginAuth: true, auth: '采购管理' },
          name: [{ name: '采购单查询', path: '/buy/pomain' }]
        },
        //仓储
        {
          path: '/goods/instock', component: () => import('../components/component1/instock'),
          meta: { loginAuth: true, auth: '仓库管理' },
          name: [{ name: '入库登记', path: '/goods/instock' }]
        },
        {
          path: '/goods/outstock', component: () => import('../components/component1/outstock'),
          meta: { loginAuth: true, auth: '仓库管理' },
          name: [{ name: '出库登记', path: '/goods/outstock' }]
        },
        {
          path: '/goods/checkstock', component: () => import('../components/component1/checkstock'),
          meta: { loginAuth: true, auth: '仓库管理' },
          name: [{ name: '库存盘点', path: '/goods/checkstock' }]
        },
        {
          path: '/goods/querystock', component: () => import('../components/component1/querystock'),
          meta: { loginAuth: true, auth: '仓库管理' },
          name: [{ name: '库存查询', path: '/goods/querystock' }]
        },
        //财务
        {
          path: '/money/receipt', component: () => import('../components/component1/receipt'),
          meta: { loginAuth: true, auth: '财务管理' },
          name: [{ name: '收款登记', path: '/money/receipt' }]
        },
        {
          path: '/money/pay', component: () => import('../components/component1/pay'),
          meta: { loginAuth: true, auth: '财务管理' },
          name: [{ name: '出款登记', path: '/money/pay' }]
        },
        {
          path: '/money/querypr', component: () => import('../components/component1/queryPR'),
          meta: { loginAuth: true, auth: '财务管理' },
          name: [{ name: '收支查询', path: '/money/querypr' }]
        },
        //销售

        {
          path: '/cell/product', component: () => import('../components/component1/product'),
          meta: { loginAuth: true, auth: '销售管理' },
          name: [{ name: '产品管理', path: '/cell/product' }]
        },
        {
          path: '/cell/category', component: () => import('../components/component1/category'),
          meta: { loginAuth: true, auth: '销售管理' },
          name: [{ name: '产品分类管理', path: '/cell/category' }]
        },
        {
          path: '/cell/somain', component: () => import('../components/component1/somain'),
          meta: { loginAuth: true, auth: '销售管理' },
          name: [{ name: '销售单管理', path: '/cell/somain' }]
        },
        {
          path: '/cell/somain/addsomain', component: () => import('../components/component2/addSomain'),
          meta: { loginAuth: true, auth: '销售管理' },
          name: [{ name: '销售单管理', path: '/cell/somain' },{ name: '新添销售单', path: '/cell/somain/addsomain' }]
        },
        {
          path: '/cell/customer', component: () => import('../components/component1/customer'),
          meta: { loginAuth: true, auth: '销售管理' },
          name: [{ name: '客户管理', path: '/cell/customer' }]
        },
        {
          path: '/cell/somainover', component: () => import('../components/component1/somainOver'),
          meta: { loginAuth: true, auth: '销售管理' },
          name: [{ name: '销售单了结', path: '/cell/somainover' }]
        },
        {
          path: '/cell/somainsearch', component: () => import('../components/component1/somainSearch'),
          meta: { loginAuth: true, auth: '销售管理' },
          name: [{ name: '销售单查询', path: '/cell/somainsearch' }]
        },

        //报表
        {
          path: '/report/pomain', component: () => import('../components/component1/reportPomain'),
          meta: { loginAuth: true, auth: '业务报表' },
          name: [{ name: '月度采购报表', path: '/report/pomain' }]
        },

        {
          path: '/report/payment', component: () => import('../components/component1/reportPayment'),
          meta: { loginAuth: true, auth: '业务报表' },
          name: [{ name: '月度收支报表', path: '/report/payment' }]
        },
        {
          path: '/report/instock', component: () => import('../components/component1/reportInstock'),
          meta: { loginAuth: true, auth: '业务报表' },
          name: [{ name: '月度入库报表', path: '/report/instock' }]
        },
        {
          path: '/report/outstock', component: () => import('../components/component1/reportOutstock'),
          meta: { loginAuth: true, auth: '业务报表' },
          name: [{ name: '月度出库报表', path: '/report/outstock' }]
        },
        {
          path: '/report/stock', component: () => import('../components/component1/reportStock'),
          meta: { loginAuth: true, auth: '业务报表' },
          name: [{ name: '产品库存报表', path: '/report/stock' }]
        },
        {
          path: '/report/somain', component: () => import('../components/component1/reportSomain'),
          meta: { loginAuth: true, auth: '业务报表' },
          name: [{ name: '月度销售报表', path: '/report/somain' }]
        },
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  let modelList = Cookies.get('models')
  // console.log(modelList)
  //需要先登录
  if (to.matched.some(res => res.meta.loginAuth)) {
    //登录基础上有权限限定
    if (to.matched.some(res => res.meta.auth)) {
      //判断cookie中的数组是否包含此次跳转的权限
      if (modelList.indexOf(to.meta.auth) >= 0) {
        next()
      } else {
        next({ path: '/error' })
      }
    } else {
      if (Cookies.get('username')) {
        next()
      } else {
        next({ path: '/' })
      }
    }
  } else {
    next()
  }
})
export default router