import Vue from 'vue'
import Router from 'vue-router'

/**
 * user interface pages
 */
import main from '../components/common/main'
import login from '../components/common/login'
import uiConsoleGallery from '../components/common/ui_console_gallery'
import wxuser from '../components/common/wxuser.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path:'/login',name:'login',component:login},
    
    { path: '/', name: 'main', component: main ,children:[
      //全局文件
      
      { path:'/uiConsoleGallery',name:'文件库',component:uiConsoleGallery},
      
      { path:'/wxuser',name:'微信用户',component:wxuser},
      
    ]},
    
  ]
})
