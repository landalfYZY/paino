import Vue from 'vue'
import Router from 'vue-router'

/**
 * user interface pages
 */
import main from '../components/common/main'
import login from '../components/common/login'
import uiConsoleGallery from '../components/common/ui_console_gallery'
import wxuser from '../components/common/wxuser'

import goodsAdd from '../components/paino/goodsAdd'
import goodsList from '../components/paino/goodsList'
import goodsUpdate from '../components/paino/goodsUpset'
import specifAdd from '../components/paino/specifAdd'
import specifList from '../components/paino/specifList'

Vue.use(Router)

export default new Router({
  routes: [
    { path:'/login',name:'login',component:login},
    
    { path: '/', name: 'main', component: main ,children:[
      //全局文件
      { path:'/uiConsoleGallery',name:'文件库',component:uiConsoleGallery},
      { path:'/goodsAdd',name:'添加商品',component:goodsAdd},
      { path:'/goodsList',name:'商品列表',component:goodsList},
      { path:'/goodsUpdate',name:'商品修改',component:goodsUpdate},
      { path:'/wxuser',name:'微信用户',component:wxuser},

      { path:'/specifAdd',name:'添加规格',component:specifAdd},
      { path:'/specifList',name:'规格列表',component:specifList},
    ]},
    
  ]
})
