/* 操作mutations：通过mutation间接更新state的多个方法的对象 */

// 引入常量
import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,
    RECEIVE_GOODS,
    RECEIVE_RATINGS,
    RECEIVE_INFO,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT,
    EMPTY_CART,
    RECEIVE_SEARCH_SHOPS    
} from './mutation-types'
// 引入api的接口函数
import {
    reqAddress,
    reqFoodCategorys,
    reqShops,
    reqUserInfo,
    reqLogout,
    reqShopGoods,
    reqShopRatings,
    reqShopInfo,
    reqSearchShop
} from '../api'

export default {
    // 通过接口请求函数，异步获取后台数据
    async getAddress ({commit, state}) {    //从state中拿数据作为请求的参数
        // 发送异步ajax请求，获取响应数据
        const geohash = state.latitude + ',' + state.longitude
        const result =  await reqAddress(geohash)

        // 根据结果提交一个mutation，去更新state
        if(result.code===0) {
            const address = result.data
            commit(RECEIVE_ADDRESS, {address})
        }
    },

    async getCategorys ({commit}) {    
        // 发送异步ajax请求，获取响应数据
        const result =  await reqFoodCategorys()

        // 根据结果提交一个mutation
        if(result.code===0) {
            const categorys = result.data
            commit(RECEIVE_CATEGORYS, {categorys})
        }
    },

    async getShops ({commit, state}) {     
        // 发送异步ajax请求，获取响应数据
        const {latitude, longitude} = state
        const result =  await reqShops({latitude, longitude})

        // 根据结果提交一个mutation
        if(result.code===0) {
            const shops = result.data
            commit(RECEIVE_SHOPS, {shops})
        }
    },

    // 因为userInfo已经在组件中发登录请求时获取到了，就不用在这里异步获取了
    // 同步记录用户信息，在组件中调用（传入参数userInfo）
    recordUser ({commit}, userInfo) {
        commit(RECEIVE_USER_INFO, {userInfo})
    },

    // 异步获取用户信息
    async getUeserInfo({commit}) {
        const result = await reqUserInfo()
        if(result.code===0) {
            const userInfo = result.data
            commit(RECEIVE_USER_INFO, {userInfo})
        }    
    },


    // 异步退出
    async login({commit}) {
        const result = await reqLogout()
        if(result.code===0) {
            //重置用户信息
            commit(RESET_USER_INFO)
        }    
    },


  // 异步获取商家商品列表，传入一个回调函数(new BScroll)
  async getShopGoods({commit}, callback) {
    const result = await reqShopGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      // 数据更新后，若callback函数存在就执行，不存在就返回一个false
      callback && callback()
    }
  },
  // 异步获取商家评价列表
  async getShopRatings({commit}, callback) {
    const result = await reqShopRatings()
    if (result.code === 0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
      // 数据更新了, 通知一下组件
      callback && callback()
    }
  },
  // 异步获取商家信息
  async getShopInfo({commit}) {
    const result = await reqShopInfo()
    if (result.code === 0) {
      const info = result.data
      commit(RECEIVE_INFO, {info})
    }
  }, 
  

    // 同步更新food的数量，根据isAdd进行数量+ 或者 - 的数据更新
    updateFoodCount ({commit}, {food, isAdd}) {
      if(isAdd) {
        commit(INCREMENT_FOOD_COUNT, {food})
      }else{
        commit(DECREMENT_FOOD_COUNT, {food})
      }      
    },

    
    // 同步清空购物车
    clearCart({commit}) {
      commit(EMPTY_CART)
    },

    
    // 异步获取搜索商家的数据
    async searchShop ({commit, state}, keyword) {
      const geohash = state.latitude + ',' + state.longitude  
      const result = await reqSearchShop(keyword, geohash)  //发请求

      if(result.code===0) {
        const shops = result.data
        commit(RECEIVE_SEARCH_SHOPS, {shops})     //提交数据  
      }
    }
    
}