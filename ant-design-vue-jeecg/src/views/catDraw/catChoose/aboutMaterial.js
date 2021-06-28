import { getUUID, stitchinParameters } from '../util'

import catDrawListData from '../catRobotNew/cardType/catDrawListData' //初始化media
import { getMaterialsByType } from '@/api/api'
var isTest = false

//设置素材列表选择
class AboutMaterial {
    constructor(page) {
            this.page = page
            this.acceptUrl = page.acceptUrl //URL地址
            this.botId = page.botId //机器人id

            this.arrs = null //所有素材的数组

            this.clearMetarialNum = 0 //0701新增是否有清空素材,0是没有数据，1是说明有清空，2是已经清空过的
        }
        //获取图片素材
    getMaterials(materialType, botId) {
            var parmer = {
                materialType: materialType || 'image', //image，audio，video
                botId: botId || this.botId, //兼容群发的接口
            }

            return new Promise((resolve, reject) => {
                this.requestMy('post', 'queryMaterialsByType', parmer).then((res) => {
                    var dataList = res.materialList || []
                    console.log(dataList);
                    dataList.forEach((item) => {

                        if (item.materialFileProperty && typeof item.materialFileProperty == 'string') {
                            console.log(item);


                            var materialFileProperty = JSON.parse(item.materialFileProperty)
                            item.materialFileProperty = materialFileProperty
                            item.materialFileProperty.materialId = item.materialId //新加上materialId
                            for (var key in materialFileProperty) {
                                item[key] = materialFileProperty[key]
                            }
                        }
                    })

                    this.page.materialList[materialType + 'List'] = dataList
                    console.log(this.page.materialList);
                    //0701设置权限
                    if (res.status == '-99') {
                        this.page.materialList[materialType + 'Authority'] = false
                    } else {
                        this.page.materialList[materialType + 'Authority'] = true
                    }
                    resolve()
                })
            })
        }
        //获取所有的list
    getArrs() {
            if (!this.arrs) {
                var materialList = this.page.materialList || {}
                var imageList = materialList.imageList
                var audioList = materialList.audioList
                var videoList = materialList.videoList
                this.arrs = imageList.concat(audioList, videoList)
            }
        }
        //在数组中找到当前的id
    findInArr(materialId) {
            var index = -1
            if (!materialId) {
                return index
            }

            this.getArrs()

            var arrs = this.arrs
            for (var i = 0; i < arrs.length; i++) {
                var item = arrs[i]
                if (item.materialId == materialId) {
                    index = i
                    break
                }
            }
            return index
        }
        //情况之前的数据
    clearMetarial(reply) {
            //清空之前的数据
            var res = new catDrawListData.CatMedia()
            for (var key in res) {
                reply[key] = res[key]
            }
            reply.materialId = '' //设置成空
        }
        //处理媒体资源
    dealReply(reply) {
            var materialId = reply.materialId || '' //素材id
            if (materialId) {
                var findIndex = this.findInArr(materialId)
                if (findIndex == -1) {
                    //说明没找到id，清空数据
                    this.clearMetarial(reply)

                    this.clearMetarialNum = 1 //有清空数据
                }
            }
        }
        //判断是否有对应的id
    judgeMaterialId(finalReply) {
            //判断是否有，如果没有，就直接清空数据,再获取后直接修改
            var finalReply = finalReply || []
            finalReply.forEach((item) => {
                //处理图片，音频，视频
                var needEmpry = ['image', 'audio', 'video']
                if (needEmpry.indexOf(item.replyType) > -1) {
                    var reply = item.reply
                    this.dealReply(reply)
                }
                if (item.replyType == 'singleCard') {
                    var reply = item.reply.card.media
                    this.dealReply(reply)
                } else if (item.replyType == 'manyCards') {
                    var cards = item.reply.cards || []
                    cards.forEach((item1) => {
                        var reply = item1.media
                        this.dealReply(reply)
                    })
                }
            })
        }
        // judgePop() {
        // 	//0701说明有清空，需要提示
        // 		if(this.clearMetarialNum == 1) {
        // 			this.clearMetarialNum = 2
        // 			this.confirm()  //提示
        // 		}
        // }
        // confirm () {
        // 	var page = this.page
        // 	page.$root.eventBus.$emit("modal_visible_change_" + 'unavailable')
        // }
        //请求方法
    async requestMy(type, urlType, parmer = {}) {
        //			type:get或post方法， urlType请求的别称
        var that = this
        var acceptUrl = this.acceptUrl
        var url = acceptUrl[urlType]
        return new Promise((resolve, reject) => {
            //如果是get请求，拼接参数到链接后
            if (type == 'get' && stitchinParameters(parmer)) {
                url = url + '?' + stitchinParameters(parmer)
            } else {}

            getMaterialsByType(parmer).then(
                response => {
                    if (!response) {
                        this.page.$Message.error('服务器未返回！');
                    }
                    var res = response
                    if (res.status == '0') {
                        resolve(res)
                    } else if (res.status == '-99') {
                        resolve(res)
                    } else {
                        try {
                            res.message && that.page.$Message.error(res.message);
                        } catch (e) {}
                        reject()
                    }
                }, response => {
                    try {
                        var res = response.data
                        res.message && that.page.$Message.error(res.message);
                    } catch (e) {}
                    reject()
                }
            )

            // that.page.$http[type](url, parmer).then(response => {
            // 	if(!response) {
            // 			this.page.$Message.error('服务器未返回！');
            // 	}
            // 	var res = response.data
            // 	if(res.status == '0') {
            // 		resolve(res)
            // 	} else if(res.status == '-99') {
            // 		resolve(res)
            // 	} else {
            // 		try{
            // 			res.message && that.page.$Message.error(res.message);
            // 		}catch(e){}
            // 		reject()
            // 	}
            // }, response => {
            // 	try{
            // 			var res = response.data
            // 			res.message && that.page.$Message.error(res.message);
            // 		}catch(e){}
            // 	reject()
            // })
        });
    }

    //0618画布不用请求数据，接口中有返回
    getMaterialsDraw(dataList) {
        return new Promise((resolve, reject) => {
            dataList = dataList || []
            var imageList = []
            var audioList = []
            var videoList = []
            dataList.forEach((item) => {
                if (item.materialFileProperty && typeof item.materialFileProperty == 'string') {
                    var materialFileProperty = JSON.parse(item.materialFileProperty)
                    item.materialFileProperty = materialFileProperty
                    item.materialFileProperty.materialId = item.materialId //新加上materialId
                    for (var key in materialFileProperty) {
                        item[key] = materialFileProperty[key]
                    }
                }
                if (item.materialType == 'image') {
                    imageList.push(item)
                } else if (item.materialType == 'audio') {
                    audioList.push(item)
                } else if (item.materialType == 'video') {
                    videoList.push(item)
                }
            })
            this.page.materialList.imageList = imageList
            this.page.materialList.audioList = audioList
            this.page.materialList.videoList = videoList
        });
    }
}

export {
    AboutMaterial,
}