<!-- 商品列表子路由 -->
<template>
  <div>
    <div class="goods">
      <!-- 左边的菜单列表 -->
      <div class="menu-wrapper">
        <ul>
          <!--current类的判断 -->
          <li class="menu-item" v-for="(good, index) in goods" :key="index" :class="{current: index===currentIndex}" @click="clickMenu(index)">
            <span class="text bottom-border-1px">
              <!-- 有可能没有icon，就不显示 -->
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>

      <!-- 右边的食物列表 -->
      <div class="foods-wrapper" >
        <ul ref="foodsUl">
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <!-- 每个分类下的食物food，点击显示食物详情 -->
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods"
                  :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                     <!-- 加入购物车按键：将当前food数据传给子组件 -->
                    <CartControl :food="food" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart />
    </div>
    <!-- 食物详情子组件：要传递的food需要定义，ref标识以便父组件调用子组件的方法 -->
    <Food :food="food" ref="food"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// 引入滑动库
import BScroll from 'better-scroll'
// 引入加入购物车按键、食物详情、购物车子组件
import CartControl from '../../../components/CartControl/CartControl.vue'
import Food from '../../../components/Food/Food.vue'
import ShopCart from '../../../components/ShopCart/ShopCart.vue'

export default {
  data () {
    return {
      currentClass:true,
      scrollY:0,   //右侧滑动的Y轴坐标（实时变化）
      tops:[],     //右侧所有分类的第一个食物的Y坐标组成的数组
      food: {},   //传给Food子组件的数据
    };
  },

  mounted() {
    // 显示这个组件时才发请求
    // 传一个回调函数给getShopGoods
    this.$store.dispatch('getShopGoods', () => { //数据更新后执行
      this.$nextTick(() => {    //等页面更新后才创建
        this._initScroll()    //创建BScroll，收集scrollY
        this._initTops()      //收集tops数组  
      })  
    })
  },

  components: {
    CartControl,
    Food,
    ShopCart
  },

  computed: {
    ...mapState(['goods']),

    // 当前分类的下标：通过scrollY、tops两个数据计算得到
    currentIndex () {
      const {scrollY, tops} = this
      //如果scrollY变化到 tops的某一个区间内，当前分类下标就是当前的i
      // for(let i=0;i<tops.length;i++) {
      //   if(scrollY >= tops[i] && scrollY < tops[i+1]) {
      //     return i
      //   }
      // }
      const index = tops.findIndex((top,index)=>{
        return scrollY >= top && scrollY < tops[index+1]
      })
      return index
    }
  },

  methods: {
    // 初始化滚动，_在mounted里调用
    _initScroll () {
      new BScroll('.menu-wrapper', {
        //默认是false阻止浏览器的点击事件，所以要配置为true
        click:true
      })
      this.foodScroll =  new BScroll('.foods-wrapper', {
        //配置收集坐标的频率，1/2/3
        probeType: 2,    //惯性滑动不触发
        click:true
      })

      // 给右侧食物列表绑定事件，去收集滑动时的实时坐标
      this.foodScroll.on('scroll', ({x, y}) => {
        this.scrollY = Math.abs(y)
      })
      // 如果快速滑动产生惯性，上一个收集scroll的就不准确（也可以将probeType改为3）
      // 收集滑动停止后的y坐标
      this.foodScroll.on('scrollEnd', ({x, y}) => {
        this.scrollY = Math.abs(y)
      })
    },

    // 收集tops数组的数据（每个分类的高度坐标）
    _initTops () {
      const tops = []
      //顶端第一个food的坐标为0
      let top = 0
      tops.push(top)

      //获取每个分类列表，得到的是一个伪数组
      const lis = this.$refs.foodsUl.children
      //转为真数组，并遍历叠加每个li的高度，保存到tops
      Array.from(lis).forEach(li => {
        top += li.clientHeight
        tops.push(top)
      })
      this.tops = tops
    },

    // 点击左边的某一个分类时，将右边的食物列表页滑动到对应位置（使scrollY变化，currentIndex也随之变化，点击的样式就实现了）
    clickMenu(index) {
      //这样会右边先滚动，等scrollTo触发scrollEnd变化scrollY才变，左边的点击样式最后才变，感觉反应延迟
      // const y = -this.tops[index]   //找到该分类的高度坐标
      // this.foodScroll.scrollTo(0, y, 300) //参数x、y坐标、变化时间

      const scrollY = this.tops[index]
      this.scrollY = scrollY  //立即更新scrollY
      this.foodScroll.scrollTo(0, -scrollY, 300)      
    },

    // 显示食物详情
    showFood (food) {
      this.food = food
      // 调用food子组件里显示隐藏的方法
      this.$refs.food.toggleShow()
    }
  }

}

</script>

<style lang='stylus' rel='stylesheet/stylu'>
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>