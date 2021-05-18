<!--  -->
<template>
  <section class="msite">
    <!--首页头部-->
    <!-- 头部子组件：用属性绑定引入address数据 -->
    <headerTop :title="address.name">
      <!-- 将搜索图标作为跳转的链接 -->
      <router-link class="header_search" slot="left" to="/search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>
      <!-- 若没有登录就显示文字，若已经登录就显示icon-person图标 -->
      <router-link class="header_login" slot="right" :to="userInfo._id? '/userinfo':'/login'">
        <span class="header_login_text" v-if="!userInfo._id">登录|注册</span>
        <span class="header_login_text" v-else>
          <i class="iconfont icon-person"></i>
        </span>
      </router-link>        
    </headerTop>

    <!--首页导航-->
    <nav class="msite_nav">
      <!-- 按照swiper插件的要求，写轮播图对应的类名 -->
      <div class="swiper-container" v-if="categorys.length">
        <div class="swiper-wrapper">
          <!-- 对于categorys二维数组，用双层遍历来获得数据 -->
          <div class="swiper-slide" v-for="(categorys, index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category, index) in categorys" :key="index">
              <div class="food_container">
                <img :src="baseImageUrl + category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>

          </div>
        </div>

        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <!-- 若categorys数据还没加载完，就用此svg图片代替显示 -->
      <img src="./images/msite_back.svg" alt="back" v-else>
    </nav>
    <!--首页附近商家-->
    <ShopList/>
  </section>
</template>

<script>
// 引入子组件
import headerTop from '../../components/headerTop/headerTop.vue'
import ShopList from '../../components/ShopList/ShopList.vue'
// 引入轮播插件swiper
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
// import 'swiper/swiper-bundle.min.js'

import {mapState} from 'vuex'

export default {
  data () {
    return {
      baseImageUrl: 'https://fuss10.elemecdn.com'
    };
  },

  mounted(){
    // 发请求，获取食物分类
    this.$store.dispatch('getCategorys')
  },

    // 计算属性
  computed: {
    ...mapState(['address', 'categorys', 'userInfo']),  //读取state里的数据

    // 为了实现轮播，要将categorys这个一维数组转为二维数组，一组最多八个小类
    categorysArr() {
      const {categorys} = this            //（解构赋值）
      const arr = []     //外层数组
      let minArr = []  //内层数组

      categorys.forEach(c => {
         // 如果当前内层数组放满8个了，就创建新的内层数组
        if(minArr.length === 8){
          minArr = []
        }
        // 如果内层数组是空的，就把新的内层数组推到外层数组中
        if(minArr.length === 0){
          arr.push(minArr)
        }
        minArr.push(c)       
      })
      return arr
    }
  },

  watch: {
    // 监听categorys，数据变化就会执行后面的函数
    categorys(newValue) {
      this.$nextTick(() => {     //（数据更新后）界面完成更新就立即调用
        // 数据和页面全部更新之后，才创建swiper对象
        new Swiper('.swiper-container',{
          loop: true, // 循环模式   
          //direction: 'vertical', // 垂直切换选项
          // 分页器
          pagination: {
            el: '.swiper-pagination'
          }
        })
      })
    }
  },

  components: {
    headerTop,
    ShopList
  },
  
  
  methods: {}
}

</script>

<style lang='stylus' rel='stylesheet/stylu'>
  @import "../../common/stylus/mixins.styl"
  .msite
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774

</style>