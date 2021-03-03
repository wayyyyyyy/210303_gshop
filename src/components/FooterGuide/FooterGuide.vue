<!--  -->
<template>
  <div class="footer_guide">
    <!-- 当前路由的路径=某个固定值时，添加on这个类(图标绿色效果) -->
    <!-- 点击跳转路由 -->
    <a href="javascript:;" class="guide_item" :class="{on: $route.path==='/msite'}" @click="goTo('/msite')">
      <span class="item_icon">
        <i class="iconfont icon-icon-waimai"></i>
      </span>
      <span>外卖</span>
    </a>
    <a href="javascript:;" class="guide_item" :class="{on: $route.path==='/search'}" @click="goTo('/search')">
      <span class="item_icon">
        <i class="iconfont icon-search"></i>
      </span>
      <span>搜索</span>
    </a>
    <a href="javascript:;" class="guide_item" :class="{on: $route.path==='/order'}" @click="goTo('/order')">
      <span class="item_icon">
        <i class="iconfont icon-dingdan"></i>
      </span>
      <span>订单</span>
    </a>
    <a href="javascript:;" class="guide_item" :class="{on: $route.path==='/profile'}" @click="goTo('/profile')">
      <span class="item_icon">
        <i class="iconfont icon-icon-geren"></i>
      </span>
      <span>我的</span>
    </a>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  methods: {
    // 跳转路由
    goTo(path){
      this.$router.replace(path)
    }
  }
}
</script>

<!-- 使用了mixins.styl文件中的top-border-1px，所以要引入文件 -->
<style lang='stylus' rel='stylesheet/stylu'>
  @import "../../common/stylus/mixins.styl"
  .footer_guide
    top-border-1px(#e4e4e4)
    position fixed
    z-index 100
    left 0
    right 0
    bottom 0
    background-color #fff
    width 100%
    height 50px
    display flex
    .guide_item
      display flex
      flex 1
      text-align center
      flex-direction column
      align-items center
      margin 5px
      color #999999
      &.on
        color #02a774
      span
        font-size 12px
        margin-top 2px
        margin-bottom 2px
        .iconfont
          font-size 22px
</style>