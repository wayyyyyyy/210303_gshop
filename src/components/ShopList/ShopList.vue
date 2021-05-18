<!--  -->
<template>
  <div class="msite_shop_list">
    <div class="shop_header">
      <i class="iconfont icon-xuanxiang"></i>
      <span class="shop_header_title">附近商家</span>
    </div>

    <div class="shop_container">
      <!-- <div class="placeholder" :style="{ height: itemHeight*shops.length + 'px' }"></div> -->
      <ul class="shop_list" v-if="shops.length" @scroll="handleScroll">
        <!-- 遍历、填充数据，点击前进到商家页面（可以回退） -->
        <li class="shop_li border-1px"  v-for="(shop, index) in shops" :key="index" @click="$router.push('/shop')">
          <a>
            <div class="shop_left">
              <img class="shop_img" src="./images/shop/1.jpg">
            </div>
            <div class="shop_right">
              <section class="shop_detail_header">
                <h4 class="shop_title ellipsis">{{shop.name}}</h4>
                <ul class="shop_detail_ul">
                  <li class="supports" v-for="(support, index) in shop.supports" :key="index">{{support.icon_name}}</li>
                  </ul>
              </section>
              <section class="shop_rating_order">
                <section class="shop_rating_order_left">
                  <!-- 星星子组件：将分数和大小值传给子组件 -->
                  <Star :rating="shop.rating" :size="24"/>
                  <div class="rating_section">
                    {{shop.rating}}
                  </div>
                  <div class="order_section">
                    月售{{shop.recent_order_num}}单
                  </div>
                </section>
                <section class="shop_rating_order_right">
                  <span class="delivery_style delivery_right">{{shop.delivery_mode.text}}</span>
                </section>
              </section>
              <section class="shop_distance">
                <p class="shop_delivery_msg">
                  <span>¥{{shop.float_minimum_order_amount}}起送</span>
                  <span class="segmentation">/</span>
                  <span>配送费约¥{{shop.float_delivery_fee}}</span>
                </p>
              </section>
            </div>
          </a>
        </li>

      </ul>

      <ul v-else>
        <li v-for="(item, index) in 5" :key="index">
          <!-- 自己设一个图片的数量 -->
          <img src="./images/shop_back.svg" alt="back">
        </li>

      </ul>
    </div>
  </div>

</template>

<script>
import {mapState} from 'vuex'
import Star from '../../components/Star/Star.vue'

export default {
  data () {
    return {
      baseImageUrl: 'http://cangdu.org:8001/img/',
      // itemHeight: 74,
      // count: 3,
      // shoplist:{},
    };
  },

  mounted() {
    this.$store.dispatch('getShops')
  },

  components: {
    Star
  },

  computed: {
    ...mapState(['shops'])
  },

  methods: {
    //直接更新可视区元素的方法
    handleScroll(){
      let lastStart = 0;    // 上次开始的位置
      const container = document.querySelector('.shop_container');
      const list = document.querySelector('.shop_list');  //可视区ul
      const item = document.querySelector('.shop_li');    //列表项li
      const itemHeight = this.itemHeight;    //一个列表项li的高度
      
      console.log(document.documentElement.scrollTop+document.body.scrollTop+window.pageYOffset);      

      // return function() {
      //   const currentScrollTop = document.body.scrollTop;
      //   const fixedScrollTop = currentScrollTop - currentScrollTop % itemHeight;
      //   let start = Math.floor(currentScrollTop / itemHeight); // 可视区域开始渲染的位置
      //   // 截取可见区域对应的数据，更新数据
      //   this.shoplist = this.shops.slice(start, start + this.count);

      //   if (lastStart < start) {
      //     lastStart = start;
      //     // 调整可视区的不满足一个列高度的偏差
      //     list.style.transform = `translateY(${fixedScrollTop}px)`;   
      //     // 创建占位元素，添加新的列表项
      //     let div = document.createDocumentFragment();             
      //     for (let i = start, len = start + this.count; i < len; i++) {
      //         let item = document.createElement('li');
      //         item.className = '.shop_li';
      //         div.appendChild(item);
      //     }
      //     // 更新可视区中的元素
      //     container.innerHTML = '';
      //     container.appendChild(div);  
      //   }                
      // }
    },

    //复用DOM的方法
    // handleScroll(){
    //   let lastStart = 0;    // 上次开始的位置
    //   const list = document.querySelector('.shop_list');
    //   const items = document.querySelectorAll('.shop_li');
    //   const itemHeight = this.height;   //一个item的高度
      
    //   const currentScrollTop = document.body.scrollTop;
    //   const fixedScrollTop = currentScrollTop - currentScrollTop % itemHeight;
    //   let start = Math.floor(currentScrollTop / itemHeight); // 可视区域开始渲染的位置    
    //   this.list = this.data.slice(start, start + this.count); // 截取可见区域对应的数据，更新数据

    //   if (lastStart < start) {
    //     // 调整可视区的不满足一个列高度的偏差
    //     list.style.transform = `translateY(${fixedScrollTop}px)`;  
    //     // 将上方滑动出可视区的item移动到列表的尾部
    //     for (var i = lastStart; i < start; i++) {
    //       items[i].style.transform = `translateY(${itemHeight*this.count}px)`;
    //     }
    //     lastStart = start;
    //   }
    // }
  }
  
}
</script>

<!-- 使用了mixins.styl文件中的top-border-1px，所以要引入文件 -->
<style lang='stylus' rel='stylesheet/stylu'>
  @import "../../common/stylus/mixins.styl"
  .msite_shop_list
    top-border-1px(#e4e4e4)
    margin-top 10px
    background #fff
    .shop_header
      padding 10px 10px 0
      .shop_icon
        margin-left 5px
        color #999
      .shop_header_title
        color #999
        font-size 14px
        line-height 20px
    .shop_container
      margin-bottom 50px
      .shop_list
        .shop_li
          bottom-border-1px(#f1f1f1)
          width 100%
          >a
            clearFix()
            display block
            box-sizing border-box
            padding 15px 8px
            width 100%
            .shop_left
              float left
              box-sizing border-box
              width 23%
              height 75px
              padding-right 10px
              .shop_img
                display block
                width 100%
                height 100%
            .shop_right
              float right
              width 77%
              .shop_detail_header
                clearFix()
                width 100%
                .shop_title
                  float left
                  width 200px
                  color #333
                  font-size 16px
                  line-height 16px
                  font-weight 700
                  &::before
                    content '品牌'
                    display inline-block
                    font-size 11px
                    line-height 11px
                    color #333
                    background-color #ffd930
                    padding 2px 2px
                    border-radius 2px
                    margin-right 5px
                .shop_detail_ul
                  float right
                  margin-top 3px
                  .supports
                    float left
                    font-size 10px
                    color #999
                    border 1px solid #f1f1f1
                    padding 0 2px
                    border-radius 2px
              .shop_rating_order
                clearFix()
                width 100%
                margin-top 18px
                margin-bottom 8px
                .shop_rating_order_left
                  float left
                  color #ff9a0d                  
                  .rating_section
                    float left
                    font-size 10px
                    color #ff6000
                    margin-left 4px
                  .order_section
                    float left
                    font-size 10px
                    color #666
                    transform scale(.8)
                .shop_rating_order_right
                  float right
                  font-size 0
                  .delivery_style
                    transform-origin 35px 0
                    transform scale(.7)
                    display inline-block
                    font-size 12px
                    padding 1px
                    border-radius 2px
                  .delivery_left
                    color #fff
                    margin-right -10px
                    background-color #02a774
                    border 1px solid #02a774
                  .delivery_right
                    color #02a774
                    border 1px solid #02a774
              .shop_distance
                clearFix()
                width 100%
                font-size 12px
                .shop_delivery_msg
                  float left
                  transform-origin 0
                  transform scale(.9)
                  color #666
                .segmentation
                  color #ccc
</style>