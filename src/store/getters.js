/* 基于state的计算属性 */

export default {
    // 计算购物车所有食物的数量：将购物车中每个food的count累加
    totalCount (state) {
        return state.shopCart.reduce((preTotal, food) => {
            return preTotal += food.count
        }, 0)
    },

    // 计算购物车所有食物的价格
    totalPrice (state) {
        return state.shopCart.reduce((preTotal, food) => {
            return preTotal += food.count*food.price
        }, 0)
    },

    // 满意的评论的数量
    positiveSize (state) {
        return state.ratings.reduce((preTotal, rating) => {
            return preTotal + (rating.rateType===0 ? 1:0)
        }, 0)
    }
}