<!-- 加入购物车的控制组件 -->
<template>
  <div class="cartcontrol">
    <transition name="move">
      <!-- 减号：绑定点击事件，与加号的事件相同，传参不同 -->
      <!-- 这里的点击会冒泡到父组件ShopGoods上，引起食物详情的显示，所以.stop阻止事件冒泡 -->
      <div class="iconfont icon-remove_circle_outline" v-if="food.count" @click.stop="updateFoodCount(false)"></div>
    </transition>
    <!-- 当数量为0时，减号和数字都不显示 -->
    <div class="cart-count" v-if="food.count">{{food.count}}</div>
    <!-- 加号 -->
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true)"></div>
  </div>
</template>

<script>
export default {
  props: {
    // 接收父组件的food数据
    food: Object
  },

  components: {},

  computed: {},

  methods: {
    updateFoodCount (isAdd) {
      // 触发actions的方法（注意参数传递的格式）
      this.$store.dispatch('updateFoodCount', {food:this.food, isAdd})
    }
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)

    .icon-remove_circle_outline
      display: inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color $green
      &.move-enter-active, &.move-leave-active
        transition all .3s
      &.move-enter, &.move-leave-to
        opacity 0
        transform translateX(15px) rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .icon-add_circle
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color $green
</style>
