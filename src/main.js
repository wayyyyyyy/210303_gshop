/* 入口JS */

import Vue from 'vue'
import App from './App.vue'
// 引入路由器
import router from './router'
// 注册store 
import store from './store'

// 加载mock服务器
import './mock/mockServer'


new Vue({
   el:'#app',
   render: h => h(App),
   router,  //使用vue-router
   store    //使用vuex
})