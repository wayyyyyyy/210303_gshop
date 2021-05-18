/* vuex管理的状态对象 */

export default {
    latitude: 40.10038, // 纬度 
    longitude: 116.36867, // 经度 
    address: {},    // 地址信息对象
    categorys: [],  // 食品分类数组
    shops: [],      // 商家数组

    userInfo: {},   // 用户信息
    
    goods:[],      //一个商家的商品分类
    ratings:[],   //一个商家的评价列表
    info:{},      //一个商家的信息

    shopCart:[],  //购物车中的食物列表

    searchShops:[], //搜索得到的商家列表

}