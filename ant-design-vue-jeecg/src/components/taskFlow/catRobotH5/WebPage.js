import { getUUID } from '../assets/js/util.js'
// var sha1 = require('sha1');

import qs from 'qs'
import axios from 'axios'

var isTest = false

class WebPage {
    constructor(page) {
        this.page = page
            //存储未发送成功的内容
        this.notSentinputValue = '' //未发送的内容
    }
    init() {
        var page = this.page
            //		page.$Spin.show();  //这里开启loading
        return new Promise((resolve, reject) => {
            this.checkExpire().then(() => {
                //				page.$Spin.hide();  //这里关闭loading
                this.login().then(() => {
                    if (this.notSentinputValue) {
                        page.chatbotAi(this.notSentinputValue) //重新去发送
                        this.notSentinputValue = '' //设置为空
                    }
                    resolve()
                }).catch(() => {
                    reject()
                })
            }).catch(() => {
                //					page.$Spin.hide();  //这里关闭loading
                reject()
            })
        })
    }
    login() {
            var page = this.page
            return new Promise((resolve, reject) => {
                var url = page.acceptUrl.getToken + `?identity=${page.identity}`
                axios.get(url).then(res1 => {
                    var res = res1.data
                    if (!res) {
                        page.$message.error('服务器未返回！');
                    }
                    //						var res = response.data  //不同接口的状态码可能不同
                    if (res.status == '1') {
                        var responseData = res.responseData
                        page.access_token = responseData.access_token //设置access_token
                        resolve()
                    } else {
                        reject('-res-', res)
                    }
                }, response => {
                    reject('-res-')
                        //						this.$message.error('重置失败！');
                })
            })
        }
        //0610新增接口
    checkExpire() {
            var page = this.page
            return new Promise((resolve, reject) => {
                if (!page.botId) {
                    reject('-没有botId-')
                }

                var url = page.acceptUrl.checkExpire + `/${page.botId}`
                var body = qs.stringify({
                    uuid: page.uuid,
                })
                axios.post(url, body).then(res1 => {
                    var res = res1.data
                    if (!res) {
                        page.$message.error('服务器未返回！');
                    }
                    if (res.status == '1') {
                        //							page.chatbotName = res.responseData || ''		
                        //							if(res.responseData) {
                        //								document.title = res.responseData || ''  //0717动态设置页面title
                        //							}
                        resolve()
                    } else if (res.status == '-1') {
                        reject('-res-', res)
                        page.expired = true //链接已过期
                        page.$message.error('链接已过期！');
                    } else if (res.status == '-2') {
                        reject('-res-', res)
                        page.expired = true //链接禁用不可用
                        page.expiredTxt = res.errorMsg
                    } else {
                        page.$message.error(res.errorMsg);
                    }

                    this.setChatbotName(res.responseData) ////0730新增机器人名字
                }, response => {
                    reject('-res-')
                    page.$message.error(response.errorMsg);
                })
            })
        }
        //0730新增机器人名字
    setChatbotName(chatbotName) {
        var page = this.page
        page.chatbotName = chatbotName || ''
        if (chatbotName) {
            document.title = chatbotName || '' //0717动态设置页面title
        }
    }

    setHeaders() {
        var that = this
        var page = this.page
            //				accessToken（请求头 获取token接口返回的access_token）
            //signature（请求头 签名  将identity、timestamp、nonce 3个参数进行字典排序后，将三个参数字符串拼接成一个字符串进行sha1加密后得到的字符串）
            //timestamp（请求头 时间戳）
            //nonce（请求头 随机数）
        var timestamp = Date.parse(new Date());
        var nonce = getUUID() //随机值
        var signature = {
            identity: page.identity,
            nonce,
            timestamp: '' + timestamp,
        }
        var fruits = [page.identity, nonce, '' + timestamp];
        var fruits1 = fruits.sort();
        var fruitsLast = fruits1.join('')

        var result = {
            socketHost: page.socketHost,
            accessToken: page.access_token,
            nonce,
            timestamp,
            signature: sha1(fruitsLast),
        }
        return result
    }
    handleTokenInvalidation(res, inputValue) {
        var that = this
        var page = this.page
        var status = res.status
        var result = true
            //		0-失败   1-成功      E_INVALID_PARAMETER("1001","参数异常"),
            //  E_TOKEN_LOST("1002","未能获取请求头accessToken参数"),
            //  E_TOKEN_TIMEOUT("1003","accessToken失效"),
            //  E_TOKEN_INVALID("1004","accessToken参数异常"),
            //
            //  E_SING_CHECK_FAILED("2001","验签失败");	
        if (status == '1003' || status == '1004' || status == '2001') {
            //过期了，把数据存到数组中去
            this.notSentinputValue = inputValue
                //重新去登录
            this.init()
            result = false
        } else if (status == '1') {
            result = true
        } else {
            result = false
            page.$message.error(res.errorMsg); //提示错误信息
        }
        return result
    }
}

export {
    WebPage
}