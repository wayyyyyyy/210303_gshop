<!--  -->
<template>
    <!-- 星星大小的样式由size决定 -->
    <div class="star" :class="'star-'+size">
        <!-- 遍历样式数组，再按数组中的值设置每个星星的样式 -->
        <span class="star-item on" v-for="(sc, index) in starClass" :key="index" :class="sc"></span>
    </div>
</template>

<script>
export default {
props:{
    rating: Number,
    size: Number  //星星的大小也各有不同
},

  computed: {
    starClass () {
        // 根据分数计算星星on、half、off分别有几个，组成一个数组如['on','on','on','half','off']
        const {rating} = this
        const scs = []

        // on的个数就是整数部分
        const ratInt =  Math.floor(rating)
        for(let i=0; i<ratInt; i++){
            scs.push('on')
        }
        // 若小数部分大于0.5，就有一个half，否则就没有half
        if(rating*10 - ratInt*10 >= 5){  //为了避免rating-ratInt>=0.5 小数加减的误差
            scs.push('half')
        }
        // 数组长度不超过5的情况下，剩下的填补off
        while(scs.length < 5){
            scs.push('off')
        }       
        return scs
    }
    
  },

  methods: {}
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/star48_on')
        &.half
          bg-image('./images/star48_half')
        &.off
          bg-image('./images/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star36_on')
        &.half
          bg-image('./images/star36_half')
        &.off
          bg-image('./images/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star24_on')
        &.half
          bg-image('./images/star24_half')
        &.off
          bg-image('./images/star24_off')
</style>