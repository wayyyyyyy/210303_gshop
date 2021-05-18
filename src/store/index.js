/* vuex最核心的管理对象store */

// 引入第三方模块
import Vue from 'vue'
import Vuex from 'vuex'
// 引入自定义模块
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

// 声明使用
Vue.use(Vuex)

export default new Vuex.Store({
    // 配置
    state,
    mutations,
    actions,
    getters
})
