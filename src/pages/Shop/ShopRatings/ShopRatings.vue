<!--  -->
<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <!-- 商家评分信息 -->
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{info.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家99%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :rating="info.serviceScore" :size="36" />
            <span class="score">{{info.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :rating="info.foodScore" :size="36" />
            <span class="score">{{info.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{info.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>

      <div class="split"></div>

      <!-- 筛选栏 -->
      <div class="ratingselect">
        <div class="rating-type border-1px">
          <!-- 三种评价类型：全部2、满意0、不满意1 -->
          <span class="block positive" :class="{active:ratingType===2}" @click="setType(2)">
            全部<span class="count">{{ratings.length}}</span>
          </span>
          <span class="block positive" :class="{active:ratingType===0}" @click="setType(0)">
            满意<span class="count">{{positiveSize}}</span>
            <!-- 满意评论的长度根据state中的ratings计算得到，所以用getters计算属性 -->
          </span>
          <span class="block negative" :class="{active:ratingType===1}" @click="setType(1)">
            不满意<span class="count">{{ratings.length-positiveSize}}</span>
          </span>
        </div>
        <!-- 点击切换是否只看有内容的评价 -->
        <div class="switch" :class="{on:onlyShowContent}" @click="toggleShowText">
          <span class="iconfont icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
        </div>
      </div>

      <!-- 评价列表 -->
      <div class="rating-wrapper">
        <ul>
          <!-- 显示过滤后的数组 -->
          <li class="rating-item" v-for="(rating, index) in filterRatings" :key="index">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <Star :rating="rating.score" :size="24" />
                <span class="delivery">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <!-- 大拇指图标根据rateType来选择，值为0对应thumb_up，1对应thumb_down -->
                <span class="iconfont" :class="rating.rateType? 'icon-thumb_down' : 'icon-thumb_up'"></span>
                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Star from '../../../components/Star/Star.vue'

import BScroll from 'better-scroll'

export default {
  data () {
    return {
      ratingType: 2,      //满意0，不满意1，全部2
      onlyShowContent: false,   //是否只显示有内容的评价
      
    };
  },

  mounted() {
    this.$store.dispatch('getShopRatings', () => {
      this.$nextTick(() => {
        new BScroll('.ratings')
      })
    })
  },

  components: {
    Star
  },

  computed: {
    ...mapState(['info', 'ratings']),
    ...mapGetters(['positiveSize']),

    // 根据ratingType、onlyShowContent两个条件，过滤出来的评价数组
    filterRatings() {
      const {ratings, ratingType, onlyShowContent} = this

      // 把判断条件集中起来，直接过滤一次，return符合条件的评论
      return ratings.filter(rating => {
        /* 条件ratingType:  
              全部 2：直接返回true
              （不）满意 0/1：判断 这条评论rating.rateType 是否等于 当前选择的的ratingType  
              
          条件onlyShowContent：
              false：直接返回true
              true 只看有内容的：判断 rating.text的长度是否大于0
        
        同时考虑这两个条件  */
        return (ratingType===2 || rating.rateType===ratingType) && (!onlyShowContent || rating.text.length>0)

      })
      // 用if的写法太啰嗦
      // let filterRatings = []
      // if(ratingType===2) {
      //   filterRatings = ratings
      // }else if(ratingType===0) {
      //   filterRatings = ratings.filter(rating => rating.rateType===0)
      // }else if(ratingType===1) {
      //   filterRatings = ratings.filter(rating => rating.rateType===1)
      // } 
    },

  },

  methods: {
    setType (type) {
      this.ratingType = type      
    },

    toggleShowText() {
      this.onlyShowContent = !this.onlyShowContent
    }
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .ratings
    position: absolute
    top: 195px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    background: #fff
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .split
      width: 100%
      height: 16px
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      background: #f3f5f7
    .ratingselect
      .rating-type
        padding: 18px 0
        margin: 0 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .block
          display: inline-block
          padding: 8px 12px
          margin-right: 8px
          line-height: 16px
          border-radius: 1px
          font-size: 12px
          color: rgb(77, 85, 93)
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: $green
            color: #fff
          .count
            margin-left: 2px
            font-size: 8px
      .switch
        padding: 12px 18px
        line-height: 24px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        color: rgb(147, 153, 159)
        font-size: 0
        &.on
          .icon-check_circle
            color: $green
        .icon-check_circle
          display: inline-block
          vertical-align: top
          margin-right: 4px
          font-size: 24px
        .text
          display: inline-block
          vertical-align: top
          font-size: 12px
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .icon-thumb_down, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: $yellow
            .icon-thumb_down
              color: rgb(147, 153, 159)

            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
