/*
使用mockjs提供mock数据接口
 */
import Mock from 'mockjs'
import data from './data.json'

// 生成goods接口，访问前面的URL，就返回相应的数据
Mock.mock('/goods', {code:0, data: data.goods})
// ratings接口
Mock.mock('/ratings', {code:0, data: data.ratings})
// info接口
Mock.mock('/info', {code:0, data: data.info})

// export default ???  不需要向外暴露任何数据, 只需要保存能执行即可使用