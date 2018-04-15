import Vue from 'vue'
import Router from 'vue-router'
import Cookie from 'js-cookie'




Vue.use(Router)


// const Index = () => import('@/components/board/Board')
// const Apply = () => import('@/components/apply/Apply')
// const Board = () => import('@/components/board/Board')
// const MyInds = () => import('@/components/my/MyInds')
// const Indesc = () => import('@/components/my/Indesc')
// const NounDesc = () => import('@/components/my/NounDesc')
// const Page = () => import('@/components/test/testPage')

// let routes = [
//   {
//       path: '/dbd',
//       redirect: '/bdc-prd-dbd/board'
//       },
//       {
//         path: '/bdc-prd-dbd/board',
//         component: Board
//       },
//       {
//         path: '/bdc-prd-dbd/apply',
//         component: Apply
//       },
//       {
//         path: '/bdc-prd-dbd/myinds',
//         component: MyInds
//       },
//       {
//         path: '/bdc-prd-dbd/indesc',
//         component: Indesc
//       },
//       {
//         path: '/bdc-prd-dbd/nounDesc',
//         component: NounDesc
//       },
//       {
//         path: '/bdc-prd-dbd/page',
//         component: Page
//       }
// ]


// export function createRouter() {
//     let router = new Router({
//         mode: 'history',
//         routes
//     })

//   router.beforeEach((to, from, next) => {
//     // 从路由的元信息中获取 title 属性
//     if (to.meta.title) {
//       document.title = to.meta.title
//     }

//     if (to.query.ticket && to.query.uid) {
//       Cookie.set('t8t-it-ticket', to.query.ticket)
//       Cookie.set('t8t-it-uid', to.query.uid)
//     }
//     next()
//   })
// }  


