import { getUUID, stitchinParameters } from '../assets/js/util.js'

import catDrawListData from '../cardType/catDrawListData'  //初始化media

var isTest = false


//0829兼容csp数据
var setMaterialType = function (data, type) {
	var result = {
		pic: 'image',
		voice: 'audio',
		video: 'video',
		file: 'file',
	}
	//通过value返回对应的key
	if (type == 'value') {
		for (var k in result) {
			if (result[k] == data) {
				return k
			}
		}
	} else {
		return result[data]
	}
}

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
	getMaterials(materialType, botId, pager = {}) {
		var parmer = {
			materialType: setMaterialType(materialType),
		}

		//新增设置参数
		if (pager.pageNo) {
			parmer.pageNo = pager.pageNo
		}
		if (pager.pageSize) {
			parmer.pageSize = pager.pageSize
		}

		return new Promise((resolve, reject) => {
			this.requestMy('get', 'queryMaterialsByType', parmer).then((res) => {
				this.dealRequest(materialType, res)
				resolve(res)
			})
		})
	}
	dealRequest(materialType, res) {
		if (Array.isArray(res.result)) {
			var dataList = res.result
		} else {
			var dataList = res.result.records
		}

		dataList.forEach((item) => {
			var materialFileProperty = JSON.parse(item.materialFileProperty)
			var result = {
				"mediaUrl": item.materialUrl,
				"fileName": item.materialName,
//				"fileName": materialFileProperty.fileName,
				"fileSize": item.materialFileSize,
				"mediaType": setMaterialType(item.materialType, 'value'),
				"mediaContentType": item.materialFileContentType,
				"thumbnailMediaUrl": item.thumbnailUrl,
				"thumbnailMediaContentType": item.thumbnailContentType,
				materialFileType: item.materialFileType, //10.20新增设置文件后缀
			}

			for (var key in result) {
				item[key] = result[key]
			}
			item.mediaType = setMaterialType(item.materialType, 'value')
			item.materialType = item.mediaType

			item.materialFileProperty = result
			item.materialId = item.materialId || item.id //0820兼容旧的数据
			item.materialFileProperty.materialId = item.materialId  //新加上materialId

			//			item.auditStatus =  //这个是之前的素材状态

			//0820后台返回值是空,兼容csp这边
			if (item.auditStatus == 0) {
				item.auditStatus = 4
			}
		})

		this.page.$set(this.page.materialList, materialType + 'List', dataList)
		////			//0701设置权限
		//			this.page.materialList[materialType + 'Authority'] = true
	}

	//素材选择页面，上传视频选择封面
	getMaterialsByType(materialType, botId) {
		let dd = this;
		var that = this.page
		if (!botId) {
			return
		}
		var parmer = {
			materialType: materialType, //pic，voice，video
			botId: botId,  //兼容群发的接口
		}
		return new Promise((resolve, reject) => {
			this.requestMy('get', 'getMaterialsByType', parmer).then((res) => {
				this.dealRequest(materialType, res)
				resolve()
			})
		})
	}
	//获取所有的list
	getArrs() {
		if (!this.arrs) {
			var materialList = this.page.materialList || {}
			var picList = materialList.picList
			var voiceList = materialList.voiceList
			var videoList = materialList.videoList
			var fileList = materialList.fileList
			this.arrs = picList.concat(voiceList, videoList, fileList)
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
		//			reply.materialId = '' //设置成空  0716新增不清空
	}
	//处理媒体资源
	dealReply(reply) {
		var materialId = reply.materialId || ''  //素材id
		if (materialId) {
			var findIndex = this.findInArr(materialId)
			if (findIndex == -1) {
				//说明没找到id，清空数据
				this.clearMetarial(reply)

				this.clearMetarialNum = 1  //有清空数据
			}
		}
	}
	//判断是否有对应的id
	judgeMaterialId(finalReply) {
		//判断是否有，如果没有，就直接清空数据,再获取后直接修改
		var finalReply = finalReply || []
		finalReply.forEach((item) => {
			//处理图片，音频，视频
			var needEmpry = ['image', 'voice', 'video', 'file']
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
	judgePop() {
		//0701说明有清空，需要提示
		if (this.clearMetarialNum == 1) {
			this.clearMetarialNum = 2
			this.confirm()  //提示
		}
	}
	confirm() {
		var page = this.page
		// page.$root.eventBus.$emit("modal_visible_change_" + 'unavailable')
		page.unavailable = true
	}

	//请求方法
	requestMy(type, urlType, parmer = {}) {
		//			type:get或post方法， urlType请求的别称
		var that = this
		var acceptUrl = this.acceptUrl
		var url = acceptUrl[urlType]
		return new Promise((resolve, reject) => {
			//如果是get请求，拼接参数到链接后
			if (type == 'get' && stitchinParameters(parmer)) {
				url = url + '?' + stitchinParameters(parmer)
			} else {
			}
			that.page.$http[type](url, parmer).then(response => {
				if (!response) {
					this.page.$message.error('服务器未返回！');
				}
				//				var res = response.data
				var res = response
				if (res.code == '200') {
					resolve(res)
				} else if (res.status == '-99') {
					resolve(res)
				} else {
					try {
						res.message && that.page.$message.error(res.message);
					} catch (e) { }
					reject()
				}
			}, response => {
				try {
					var res = response.data
					res.message && that.page.$message.error(res.message);
				} catch (e) { }
				reject()
			})
		});
	}

	//0618画布不用请求数据，接口中有返回
	getMaterialsDraw(dataList) {
		//10.20发现直接请求素材的接口，画布中没有返回
//		return new Promise((resolve, reject) => {
//			dataList = dataList || []
//			var picList = []
//			var voiceList = []
//			var videoList = []
//			var fileList = []
//			dataList.forEach((item) => {
//				if (item.materialFileProperty && typeof item.materialFileProperty == 'string') {
//					var materialFileProperty = JSON.parse(item.materialFileProperty)
//					item.materialFileProperty = materialFileProperty
//					item.materialFileProperty.materialId = item.materialId  //新加上materialId
//					for (var key in materialFileProperty) {
//						item[key] = materialFileProperty[key]
//					}
//				}
//				if (item.materialType == 'pic') {
//					picList.push(item)
//				} else if (item.materialType == 'voice') {
//					voiceList.push(item)
//				} else if (item.materialType == 'video') {
//					videoList.push(item)
//				} else if (item.materialType == 'file') {
//					fileList.push(item)
//				}
//			})
//			this.page.materialList.picList = picList
//			this.page.materialList.voiceList = voiceList
//			this.page.materialList.videoList = videoList
//			this.page.materialList.fileList = fileList
//		});
	}
}

export {
	AboutMaterial,
}
