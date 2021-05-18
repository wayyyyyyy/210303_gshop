/* mutation和actions之间进行交互的常量模块：
包含mutation的type名称常量 */

// 接收数据
export const RECEIVE_ADDRESS = 'receive_address'
export const RECEIVE_CATEGORYS = 'receive_categorys'
export const RECEIVE_SHOPS = 'receive_shops'
export const RECEIVE_USER_INFO = 'receive_user_info'
// 重置用户信息
export const RESET_USER_INFO = 'reset_user_info'

export const RECEIVE_GOODS = 'receive_goods' // 接收商品数组 
export const RECEIVE_RATINGS = 'receive_ratings' // 接收商家评价数组 
export const RECEIVE_INFO = 'receive_info' // 接收商家信息

// 增加或减少食物的数量
export const INCREMENT_FOOD_COUNT= 'increment_food_count'
export const DECREMENT_FOOD_COUNT= 'decrement_food_count'

// 清空购物车
export const EMPTY_CART= 'empty_cart'

// 接收搜索的商家数据
export const RECEIVE_SEARCH_SHOPS= 'receive_search_shops'



