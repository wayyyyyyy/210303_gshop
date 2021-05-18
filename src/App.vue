<template>
    <div id="app">
        <!-- 模板中上面显示路由内容，下面显示底部导航 -->
        <router-view/>
        <FooterGuide v-if="$route.meta.showFooter" />
    </div>
</template>

<script>
import FooterGuide from './components/FooterGuide/FooterGuide.vue'
// import {reqAddress} from './api'
import {mapActions} from 'vuex'

export default {
    // 在mounted里发请求
    async mounted() {
        // // 发送ajax的接口请求
        // const result = await reqAddress("40.10038,116.36867")
        // console.log(result);

        // 触发actions，获取后台数据
        // this.$store.dispatch('getAddress')
        this.getAddress()

        // 每次App打开就调用这些方法获取数据，如果有用户信息就实现自动登录了
        this.getUeserInfo()

    },

    methods:{
        ...mapActions(['getAddress', 'getUeserInfo'])  //将actions里的方法映射成函数，就可以直接调用
    },

    // 映射成标签
    components:{
        FooterGuide
    }    
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app
  width 100%
  height 100%
  background #f5f5f5
  position relative
</style>