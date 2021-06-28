import {
	checkURL,
	removeEmoji,
	removeEmojiHttpsChinese,
	calendarDate,
} from './assets/js/util.js' //时间戳转时间,用于排序

//添加不同的媒体类型
class CatDrawJudge {
	constructor(page) {
		this.page = page
	}
	warning(content) {
		this.page.$message.warning(content)
	}
	//新增判断回复内容不能为空--0821新增pageParameters参数，单卡多卡中URL不用判断以http(s)://开头
	judgeEmpty(inputContents, type, pageParameters={}) {
		//				type发送的类型
		var inputContents = inputContents || []
		var res = true
		//只有卡片消息是部分必填（标题），其他消息和按钮是全部必填
		//所有的按钮控件，新增了按钮之后，内容都需要填写
		var result = {
			text: '文本消息不能为空',
			image: '图片不能为空',
			voice: '音频不能为空',
			video: '视频不能为空',
			conversionTemplate: '转换模板不能为空',
		}
		//文案类型
		if(type == 'ask') {
			result.text = '提问内容不能为空'
		}
		for(let i = 0; i < inputContents.length; i++) {
			var addMedia = inputContents[i]
			var addMediaType = addMedia.replyType
			if(addMediaType == 'text') {
				if(!addMedia.originalMessage) {
					res = false
					this.warning(result[addMediaType])
					break
				}
			} else if(addMediaType == 'image' || addMediaType == 'voice' || addMediaType == 'video') {
				if(!addMedia.reply.mediaUrl) {
					res = false
					this.warning(result[addMediaType])
					break
				}
			} else if(addMediaType == 'singleCard') {
//				if(!addMedia.reply.card.title) {
				if(!addMedia.reply.card.originalTitle) {
					res = false
					this.warning('单卡标题不能为空')
					break
				} else if(!addMedia.reply.cardOrientation) {
					res = false
					//尺寸不能为空
					this.warning('布局不能为空')
					break
				} else if(!addMedia.reply.height) {
					res = false
					//尺寸不能为空
					this.warning('尺寸不能为空')
					break
				}
				if(!this.judgeEmptyButtons(addMedia.reply.card.buttons, pageParameters)) {
					//判断里面的按钮不能为空
					res = false
					break
				}
			} else if(addMediaType == 'manyCards') {
//				//判断尺寸不能为空
//				if(!addMedia.reply.cardWidth || !addMedia.reply.cardHeight) {
//					res = false
//					//尺寸不能为空
//					this.warning('尺寸不能为空')
//					break
//				}
				//判断尺寸不能为空
				if(!addMedia.reply.cardWidth) {
					res = false
					//尺寸不能为空
					this.warning('宽不能为空')
					break
				} else if (!addMedia.reply.cardHeight) {
					res = false
					//尺寸不能为空
					this.warning('高不能为空')
					break
				}

				var cards = addMedia.reply.cards
				for(let j = 0; j < cards.length; j++) {
//					if(!cards[j].title) {
					if(!cards[j].originalTitle) {
						res = false
						this.warning('多卡标题不能为空')
						break
					}
					if(!this.judgeEmptyButtons(cards[j].buttons, pageParameters)) {
						//判断里面的按钮不能为空
						res = false
						break
					}

					//新增需要取设尺寸的值
					cards[j].media.height = addMedia.reply.cardHeight  //设置到界面中去
				}
			} else if(addMediaType == 'conversionTemplate') {
				if(!addMedia.reply.conversionTemplateId) {
					res = false
					this.warning(result[addMediaType])
					break
				}
			}

			//0506新增_提示信息
			if(!res) {
				break
			}
		}
		return res
	}
	//判断buttons不能为空
	judgeEmptyButtons(buttons, pageParameters = {}) {
		var res = true

		//不能为空的提示信息
		var noEmpty = (needs) => {
			for(var key in needs) {
				if(!button[key]) {
					res = false
					this.warning(needs[key] + '不能为空')
					break
				} else if(!removeEmoji.test(button[key])) {
					res = false
					this.warning(needs[key] + '不能包含emoji')
					break
				} else if(button[key].match(/^\s*$/)) {
					res = false
					this.warning(needs[key] + '不能是空格')
					break
				}
			}
		}

		var buttons = buttons || []
		for(let i = 0; i < buttons.length; i++) {
			var button = buttons[i]
			//所有的按钮文案都是必填的
				var needs = {
					'description': '按钮文案',
				}

			if(button.type == 'reply') {
				//按钮的有引入，需要单独去判断
				needs = {
					'originalDescription': '按钮文案',
				}
			}
			noEmpty(needs)

			if(button.type == 'reply') {
			} else if(button.type == 'url') {
				var needs = {
					'originalContent': '跳转链接',
				}
				noEmpty(needs)
				
				//0821新增判断不能为http或https--//除了ask和send节点，单卡和多卡不用判断，其他都需要判断
				if(res && !pageParameters.showQuote) {
					if(button.originalContent && !removeEmojiHttpsChinese.test(button.originalContent)) {
							this.warning('链接需以http(s)://开头')
							res = false
							break
					}
				}	
			} else if(button.type == 'openApp') {
//				var needs = {
////					'openAppIos': 'ios调起地址',  //0615修改，去除这个必填的限制
//					'openAppAndroid': 'Android调起地址',
//				}
				//10.12新增引用
				var needs = {
					'originalOpenAppAndroid': 'Android调起地址',
				}
				noEmpty(needs)
			} else if(button.type == 'call') {
				//打电话按钮
				var needs = {
					'originalCallPhone': '电话号码',
				}
				noEmpty(needs)
			} else if(button.type == 'addressLocation') {
//				//地址定位按钮
//				var needs = {
//					'sendAddressPlaceName': '地点名称',
//					sendAddressLongitude: '经度',
//					sendAddressLatitude: '纬度'
//				}
				//地址定位按钮--//10.12新增引用
				var needs = {
					'originalSendAddressPlaceName': '地点名称',
					originalSendAddressLongitude: '经度',
					originalSendAddressLatitude: '纬度'
				}
				noEmpty(needs)
			} else if(button.type == 'screen' || button.type == 'bringUp') {
				//拍摄按钮--//10.12新增引用
				var needs = {
					'originalTargetContact': '目标联系人',
				}
				noEmpty(needs)
				
				//0821新增目标联系人不能为中文
				if(res && !pageParameters.showQuote) {
					let  check = /[\u4e00-\u9fa5]/g
					if(check.test(button.originalTargetContact)) {
						this.warning('目标联系人不能包含中文字符')
						res = false
						break
					}
				}				
			} 
//			else if(button.type == 'bringUp') {
//				//调起指定联系人
//				var needs = {
//					'targetContact': '目标联系人',
//				}
//				noEmpty(needs)
//				
//				//0821新增目标联系人不能为中文
//				if(res) {
//					let  check = /[\u4e00-\u9fa5]/g
//					if(check.test(button.targetContact)) {
//						this.warning('目标联系人不能包含中文字符')
//						res = false
//						break
//					}
//				}
//			} 
			else if(button.type == 'calendar') {
//				//0721新增日历选择器, 设置提示信息
				var startTime = button.chooseTime[0]
				var endTime = button.chooseTime[1]
				//判断开始日期不能小于结束日期
				if(calendarDate(startTime, endTime)) {
					this.warning('开始日期不能大于结束日期')
					res = false
					break
				}
				button.startTime = startTime && new Date(startTime).toISOString() || ''  //设置开始时间，转成utc日期
				button.endTime = endTime && new Date(endTime).toISOString() || '' //设置结束时间，转成utc日期

				var needs = {
					'startTime': '开始日期',
					'endTime': '结束日期',
					'title': '标题',
				}
				noEmpty(needs)
			}
			//0506新增_提示信息
			if(!res) {
				break
			}
		}
		return res
	}
//	//判断个数不能超过10个，需要给提示信息
//	limitButtonsNumber(buttons, buttonNums) {
//		var result = true
//		var buttonsLen = buttons.length
//		var maxNumber = 11 //固定按钮限制最多10个
//		var buttonNums = Number(buttonNums) || 0 //已有的固定按钮个数
//		if(buttonNums + buttonsLen > maxNumber) {
//			//不可以添加
//			result = false
//			this.warning(`快捷按钮和设置中的固定按钮总和不能超过${maxNumber}个`);
//		}
//		return result
//	}
}

export {
	CatDrawJudge
}
