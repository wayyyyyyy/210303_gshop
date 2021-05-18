/* 操作state：直接更新state的多个方法的对象 */

// 引入常量
import Vue from 'vue'
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

export default {
    // 定义方法，去更新state的数据
    [RECEIVE_ADDRESS] (state, {address}) { //接收到的address是包含数据的对象
        state.address = address
    },
    [RECEIVE_CATEGORYS] (state, {categorys}) {
        state.categorys = categorys
    },
    [RECEIVE_SHOPS] (state, {shops}) {
        state.shops = shops
    },
    [RECEIVE_USER_INFO] (state, {userInfo}) {
        state.userInfo = userInfo
    },

    // 清空用户信息
    [RESET_USER_INFO] (state) {
        state.userInfo = {}
    },

    [RECEIVE_GOODS](state, {goods}) {
        state.goods = goods
    },
    [RECEIVE_RATINGS](state, {ratings}) {
        state.ratings = ratings 
    },
    [RECEIVE_INFO](state, {info}) {
        state.info = info 
    },
    
    // 增加或减少食物的数量
    [INCREMENT_FOOD_COUNT](state, {food}) {
        if(!food.count) {
            // 最开始没有购买食物时，food没有count这个属性，所以要新增属性并且数据绑定
            //给有数据绑定的数据（food）添加属性（count），参数：对象，属性名，属性值
            Vue.set(food, 'count', 1)
            
            // 第一次添加食物时，将它存入购物车数组中
            state.shopCart.push(food)
        }else{
            food.count++
        }
    },
    [DECREMENT_FOOD_COUNT](state, {food}) {
        if(food.count){
            food.count--
            // 当食物数量减到0时，将它从购物车中移除
            if(!food.count) {
                state.shopCart.splice(state.shopCart.indexOf(food), 1)
            }
        }
    },

    // 清空购物车
    [EMPTY_CART] (state) {
        // 清空数组之前，要将其中food的count清零
        state.shopCart.forEach((food) => food.count = 0)
        state.shopCart = []
    },

    // 更新 搜索商家列表
    [RECEIVE_SEARCH_SHOPS] (state, {searchShops}) {
        state.searchShops = searchShops
    }
}