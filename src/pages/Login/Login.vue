<!-- 登录组件是一级路由 -->
<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <!-- 点击切换登录方式：通过点击事件改变样式 -->
            <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
            <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <!-- 表单提交时(@submit事件)前台验证、异步登录，并阻止默认提交行为 -->
          <form @submit.prevent="login">
            <div :class="{on:loginWay}">
              <section class="login_message">
                <!-- 双向绑定数据 -->
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <!-- 添加一个样式right_phone，手机号符合要求后按钮解除禁用，并且颜色变为黑色 -->
                <!-- 点击后开始倒计时，并且发送请求（都包含在getCode事件里）（.prevent阻止点击默认的跳转行为） -->
                <button :disabled="!rightPhone" class="get_verification" :class="{right_phone:rightPhone}" @click.prevent="getCode">
                  <!-- 有倒计时就显示“已发送..”，时间为0就显示“获取验证码” -->
                  {{countTime>0? `已发送(${countTime}s)`:'获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:!loginWay}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <!-- 密码的显示或隐藏：用两种输入框 -->
                  <input type="text" maxlength="8" placeholder="密码" v-model="pwd" v-if="showPwd">
                  <input type="password" maxlength="8" placeholder="密码" v-model="pwd" v-else>
                  <!-- 点击切换密码的显示方式，并改变切换按钮的样式 -->
                  <div class="switch_button" :class="showPwd ? 'on':'off'" @click="showPwd=!showPwd">
                    <div class="switch_circle" :class="{right:showPwd}"></div>
                    <span class="switch_text">{{showPwd ? 'abc':'...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <!-- 点击重新获取图片验证码：用ref标记起来，方便getCaptcha方法中使用 -->
                  <img class="get_verification" src="./images/captcha.svg" alt="captcha" @click="getCaptcha" ref="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <!-- 点击返回按钮，路由后退 -->
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>

      <!-- 提示框子组件 -->
      <AlertTip :alertText="alertText" v-if="alertShow" @closeTip="closeTip" />
    </section>
 </template>



<script>
  // 引入提示框子组件
  import AlertTip from '../../components/AlertTip/AlertTip.vue'
  import {reqSendCode, reqSmsLogin, reqPwdLogin} from '../../api'

  export default {
    data () {
      return {
        loginWay: true,   //默认true为短信登录，false为密码登录
        phone: '',
        code: '',        //短信验证码
        countTime: 0,    //验证码倒计时的时间
        pwd: '',
        showPwd: false,  //是否显示出密码
        captcha: '',     //验证码
        name: '',        //用户名
        alertText:'',    //提示框中的文本
        alertShow: false, //是否显示提示框组件
      };
    },

    components: {
      AlertTip
    },

    computed: {
      // 根据输入手机号的变化，判断rightPhone的值，所以用计算属性
      rightPhone() {
        //正则化：以1开头，后面10个数字
        return /^1\d{10}$/.test(this.phone)    
      }
    },

    methods: {
      // 异步获取短信验证码
      async getCode () {      
        // 如果当前没有计时，启动倒计时，同时发送请求
        if(!this.countTime) {
          this.countTime = 30
          this.countDown = setInterval(() => {   //const countDown下面发送请求中用不了，所以改成this.countDown
            // 先减1，再判断清除定时器，否则会减到-1
            this.countTime--
            if(this.countTime <= 0) {
              clearInterval(this.countDown)
            }
          },1000)

          // 发送验证码请求（在组件里直接发请求，也可以通过vuex的actions）
          // 异步获取验证码
          const result = await reqSendCode(this.phone)
          if(result.code===1) {   //如果失败了，显示提示信息
            this.showAlert(result.msg)
            // 停止倒计时
            if(this.countTime){
              this.countTime = 0
              clearInterval(this.countDown)
              this.countDown = undefined
            }
          }
          
        }
      },

      // 显示提示框
      showAlert (text) {
        this.alertShow = true
        this.alertText = text
            
      },

      // 异步登录
      async login () {
        let result   //块作用域的变量
        
        // 前台表单验证
        if(this.loginWay) {    //短信登录时，检查手机号和短信验证码 
          const {rightPhone, phone, code} = this
          if(!rightPhone) {
            // 如果检测到不正确，就显示提示框，return不再向下执行
            this.showAlert('手机号不正确')
            return
          }else if(!/^d{6}$/.test(code)){
            this.showAlert('验证码必须为6位数字')
            return
          }

          // 短信登录
          result = await reqSmsLogin(phone, code)
          
        }else{                //密码登录时，检查用户名、密码和图形验证码
          const {name, pwd, captcha} = this
          if(!name){
            this.showAlert('用户名必须输入')
            return
          }else if(!pwd) {
            this.showAlert('密码必须输入')  
            return
          }else if(!captcha) {
            this.showAlert('验证码必须输入')
            return
          }

          // 密码登录
          result = await reqPwdLogin({name, pwd, captcha})        
        }

        // 点击登录提交表单之后，停止倒计时
        if(this.countTime){
          this.countTime = 0
          clearInterval(this.countDown)
          this.countDown = undefined
        }

        // 因为两种登录后对结果的处理是一样的，所以提取出来在外面写
        if(result.code===0) {    //成功
            const user = result.data
            //触发actions，将数据保存到state
            this.$store.dispatch('recordUser', user)

            //跳转路由到个人中心页面
            this.$router.replace('/profile')
          }else{
            this.showAlert(result.msg)
            //失败后更新图片验证码
            this.getCaptcha()
          }        
      },

      // 关闭提示框
      closeTip () {
        this.alertShow = false
        this.alertText = ''
      },

      // 获取图片验证码
      getCaptcha() {
        //如果只是点击事件要调用这个函数，可以用event.target.src，但是登录失败后也要调用它，所以用ref把captcha标记起来
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
      }
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>

