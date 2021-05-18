<!--  -->
<template>
  <section class="search">
    <headerTop title="搜索"/>
    
    <!-- 搜索框 -->
    <form class="search_form" action="#" @submit.prevent="search">
      <input type="search" name="search" placeholder="请输入商家或美食名称" class="search_input" v-model="keywords">
      <input type="submit" name="submit" class="search_submit">
    </form>

    <!-- 搜索结果 v-if="!noSearchShops"-->
    <section class="list" >
      <ul class="list_container">
        <!-- 原本是 <li class="list_li"> -->
        <!--点击可以跳转到商家页面， 对象写法或者字符串写法:to="'/shop?id='+item.id"-->
        <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li"
                     v-for="item in searchShops" :key="item.id" class="list_li">
          <section class="item_left">
            <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class="item_right_text">
              <p>
                <span>{{item.name}}</span>
              </p>
              <p>月售 {{item.month_sales||item.recent_order_num}} 单</p>
              <p>{{item.delivery_fee||item.float_minimum_order_amount}} 元起送 / 距离{{item.distance}}</p>
            </div>
          </section>
        </router-link>
      </ul>
    </section>

    <div class="search_none" @click="cc">很抱歉！无搜索结果</div>

  </section>
</template>

<script>
import { mapState } from 'vuex';
import headerTop from '../../components/headerTop/headerTop.vue'
 
export default {
  data () {
    return {
      keywords:'',
      imgBaseUrl:'http://cangdu.org:8001/img/',

      noSearchShops: false,  //是否有搜索结果
    };
  },

  components: {
    headerTop
  },

  computed: {
    ...mapState(['searchShops'])
  },

  methods: {
    search() {
      // 先预处理和判断一下keywords，再发请求
      const keywords = this.keywords.trim()  //去掉前后空格
      if(keywords) {
        this.$store.dispatch('searchShop', keywords)
      }
    },

    cc(){
      console.log(this.keywords)
      console.log(this.searchShops)
    }
  },

  // watch: {
  //   searchShops() {
  //     if(this.searchShops.length) {
  //       this.noSearchShops = false
  //     }
  //   }
  // }
 
}

</script>

<style lang='stylus' rel='stylesheet/stylu'>
  @import "../../common/stylus/mixins.styl"
  .search  //搜索
    width 100%
    overflow hidden
    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774

</style>