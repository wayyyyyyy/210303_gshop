/* 包含所有接口请求函数的模块
调用ajax函数
函数返回值：promise对象
 */

import ajax from './ajax'
http://localhost:4000

// 1、根据经纬度获取位置详情
export const reqAddress = (geohash) => ajax('/position/${geohash}')  // url是/position/:geohash的形式，参数之间传入路径中${}   
// function reqAddress() {}

// 2、获取食品分类列表
export const reqFoodTypes = () => ajax('/index_category')

// 3、根据经纬度获取商铺列表
export const reqShops = (latitude, longitude) => ajax('/shops', {latitude, longitude})

// 4、根据经纬度和关键字搜索商铺列表
export const reqSearchShop = (keyword, geohash) => ajax('/search_shops', {keyword, geohash})

// 6、用户名密码登陆
export const reqPwdLogin = (name, pwd, captcha) => ajax('/login_pwd', {name, pwd, captcha}, 'POST')

// 7、发送短信验证码
export const reqSendCode = (phone) => ajax('/sendcode', {phone})

// 8、手机号验证码登陆
export const reqSendCode = (phone, code) => ajax('/login_sms', {phone, code}, 'POST')

// 9、根据会话获取用户信息
export const reqUserInfo = () => ajax('/userinfo')

// 10、用户登出
export const reqLogout = () => ajax('/logout')

