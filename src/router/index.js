import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'js-cookie'

Vue.use(Router)


const Index = () => import('@/components/board/Board')
const Apply = () => import('@/components/apply/Apply')
const Board = () => import('@/components/board/Board')
const MyInds = () => import('@/components/my/MyInds')
const Indesc = () => import('@/components/my/Indesc')
const NounDesc = () => import('@/components/my/NounDesc')
const Page = () => import('@/components/test/testPage')


const router = new Router({
  routes: [
    {
        path: '/',
        component: Board
        },
        {
          path: '/board',
          component: Board,
          meta: {
            title: '签保任务',
          },
        },
        {
          path: '/apply',
          component: Apply
        },
        {
          path: '/myinds',
          component: MyInds
        },
        {
          path: '/indesc',
          component: Indesc
        },
        {
          path: '/nounDesc',
          component: NounDesc
        },
        {
          path: '/page',
          component: Page
        },
        {
        path: '*',
        redirect: '/',
        }
    ]
})

router.beforeEach((to, from, next) => {
  // 从路由的元信息中获取 title 属性
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.query.ticket && to.query.uid) {
    Cookie.set('t8t-it-ticket', to.query.ticket)
    Cookie.set('t8t-it-uid', to.query.uid)
  }
  next()
})

export default router
