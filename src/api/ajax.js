/* ajax请求函数模块
函数返回值：promise对象（异步返回的数据是response.data）
*/

import axios from 'axios'

// 暴露一个函数ajax，三个参数：地址、对象形式的数据、请求方式
export default function ajax (url, data={}, type='GET') {

    return new Promise(function(resolve, reject){    // promise外面又包裹一层promise
        // 执行异步ajax请求
        let promise
        // 如果是get请求，就把请求参数拼接到url上
        if (type==='GET') {
            let dataStr = ''
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&'
            })
            if (dataStr != '') {
                // 截取字符串，去掉最后一个多余的&
                dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            // 发送axios请求
            promise = axios.get(url)
    
        }else {
            // 如果是post请求，直接发送数据
            promise = axios.post(url, data)
        }

        promise.then(function(response){  //response是axios返回给promise的
            // 成功就调用resolve()，就可以直接返回response.data（最终目的！）
            resolve(response.data)
        }).catch(function(err){
            // 失败就调用reject()
            reject(err)            
        })
    })

}
/* 如果没有多包裹一层promise，返回的是response，还要获取数据：
const response = await ajax()
const result = response.data

而我们想直接得到response.data：
const result = await ajax()
*/