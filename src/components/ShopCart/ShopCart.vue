<!-- 购物车组件 -->
<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <!-- 点击显示具体列表 -->
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount}">
              <i class="iconfont icon-shopping_cart" :class="{highlight:totalCount}"></i>
            </div>
            <div class="num" v-show="totalCount">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight:totalCount}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <!-- 两种显示情况、三种显示文字：都用计算属性来给出，因为要根据价格来判断 -->
          <div class="pay" :class="payClass">
            {{payText}}
          </div>
        </div>
      </div>

      <!-- 具体列表 -->
      <transition name="move">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearCart">清空</span>
          </div>
          <div class="list-content">
            <ul>
              <li class="food" v-for="(food, index) in shopCart" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price"><span>￥{{food.price}}</span></div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    
    <transition name="fade">
    <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import CartControl from '../CartControl/CartControl.vue'

import BScroll from 'better-scroll'

export default {
  data () {
    return {
      isShow: false,  //是否显示具体列表
      
    };
  },

  // mounted() {
  //   new BScroll('.list-content')
  // },
  

  components: {
    CartControl
  },

  computed: {
    // 从state和getters中读取要显示的数据
    ...mapState(['shopCart', 'info']),
    ...mapGetters(['totalCount', 'totalPrice']),

    // 支付模块的样式
    payClass () {
      const {totalPrice} = this
      const {minPrice} = this.info
      // totalPrice达到minPrice就是 enough，否则就是not-enough
      return totalPrice < minPrice ?  'not-enough' : 'enough'
    },

    // 支付模块显示的文字
    payText() {
      const {totalPrice} = this
      const {minPrice} = this.info
      // totalPrice的三种情况
      if(this.totalPrice===0){
        return `￥${minPrice}起送`
      }else if(totalPrice < minPrice){
        return `还差￥${minPrice-totalPrice}起送`
      }else{
        return '结算'
      }
    },

    // 具体列表的显示隐藏：除了由点击的isShow决定，还要看购物车是否有商品
    listShow () {
      if(this.totalCount===0) {
        // 如果数量为0，直接不显示列表，同时也要将isShow更新为false，否则下次点击会出错
        this.isShow = false
        return false        
      }

      if(this.isShow) {
        // 确定要显示列表之后，等更新完页面，才创建滚动       
        this.$nextTick(()=>{
          // 创建之前，判断BScroll是不存在的才创建，否则就会重复创建（单例模式）
          if(!this.scroll) {
            this.scroll = new BScroll('.list-content')
          }else{
            //如果已存在就刷新一下，重新统计ul的高度，否则显示后第一下滚动不了
            this.scroll.refresh()
          }
        })
      }      
      return this.isShow  
    }
  },

  methods: {
    toggleShow() {
      // 购物车中有商品时，点击才切换isShow，没有商品时不切换 listShow为false
      if(this.totalCount) {
        this.isShow = !this.isShow
      }
    },

    // 清空购物车
    clearCart() {
      this.$store.dispatch('clearCart')
    }
  },

 
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background $green
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 5px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          font-size 16px
          font-weight 700
          color #fff
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align bottom
          margin-bottom 15px
          margin-left -45px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          color #fff
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background $green
          transition all 0.4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translateY(-100%)
      &.move-enter-active, &.move-leave-active
        transition transform .3s
      &.move-enter, &.move-leave-to
        transform translateY(0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 220)

      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    opacity 1
    background rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity 0
      
</style>
