import {
	checkURL,
	removeEmoji,
	removeEmojiHttpsChinese,
} from './util.js' //时间戳转时间,用于排序

//添加不同的媒体类型
class CatDrawJudge {
	constructor(page) {
		this.page = page
	}
	warning(content) {
		this.page.$Message.warning(content)
	}
	//新增判断回复内容不能为空
	judgeEmpty(inputContents, type) {
		//				type发送的类型
		var inputContents = inputContents || []
		var res = true
		//只有卡片消息是部分必填（标题），其他消息和按钮是全部必填
		//所有的按钮控件，新增了按钮之后，内容都需要填写
		var result = {
			text: '文本消息不能为空',
			image: '请选择图片',
			audio: '请选择音频',
			video: '请选择视频',
			file: '请选择文件',
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
				if(addMedia.originalMessage.length>2000) {
					res = false
					this.warning('文字请小于等于2000个字符')
					break
				}
				
			} else if(addMediaType == 'image' || addMediaType == 'audio' || addMediaType == 'video' || addMediaType == 'file') {
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
				} else if( addMedia.reply.card.originalDescription.length > 200) {
					res = false
					//尺寸不能为空
					this.warning('描述请小于等于200个字符')
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
				if(!this.judgeEmptyButtons(addMedia.reply.card.buttons)) {
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
					if( cards[j].originalDescription.length > 200) {
						res = false
						//尺寸不能为空
						this.warning('描述请小于等于200个字符')
						break
					}
					if(!this.judgeEmptyButtons(cards[j].buttons)) {
						//判断里面的按钮不能为空
						res = false
						break
					}

					//新增需要取设尺寸的值
					cards[j].media.height = addMedia.reply.cardHeight  //设置到界面中去
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
	judgeEmptyButtons(buttons) {
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
			if(button.description.length>10) {
				res = false
				this.warning('按钮文案请小于10个字符')
				break
			}
			if(button.type == 'reply') {
				
			} else if(button.type == 'url') {
				var needs = {
					'originalContent': '跳转链接',
				}
				noEmpty(needs)
//      4.24去除这个限制，因为加上了引用，先不做这么麻烦
				if(!button.originalContent) {
					res = false
					this.warning('跳转链接不能为空')
					break
				} 
				// else if(!removeEmojiHttpsChinese.test(button.originalContent)) {
				// 	res = false
				// 	this.warning('跳转链接需以http(s)://开头，且不能包含空格或emoji或中文')
				// 	break
				// }
				if(!button.content) {
					res = false
					this.warning('跳转链接不能为空')
					break
				} 
				// else if(!removeEmojiHttpsChinese.test(button.content)) {
				// 	res = false
				// 	this.warning('跳转链接需以http(s)://开头，且不能包含空格或emoji或中文')
				// 	break
				// }
			} else if(button.type == 'openApp') {
				var needs = {
					'openAppIos': 'ios调起地址',  //0615修改，去除这个必填的限制
					'openAppAndroid': 'Android调起地址',
				}
				noEmpty(needs)
			} else if(button.type == 'call') {
//				//打电话按钮
				var needs = {
					'callPhone': '电话号码',
				}
				//打电话按钮
				var needs = {
					'originalCallPhone': '电话号码',
				}
				noEmpty(needs)
				if(!res) {
					break
				}
				//号码匹配规则，可以匹配到+号的--4.24去除这个限制，因为加上了引用，先不做这么麻烦
				// var verificationPhone = /(\d|\+)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d| 2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]| 4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/
				// var verificationPhone = /(^(\d{3,4}-)?\d{7,8})$|(^((\+86)|(86))?(1[0-9]{10}))/
				var verificationPhone = /^(\d+|-){5,15}$/
				if(!verificationPhone.test(button.callPhone)) {
					res = false
					this.warning('电话号码不正确')
					break
				}
			} else if (button.type == 'sendAddress') {
				if(button.description.length>10) {
					res = false
					this.warning('按钮文案请小于10个字符')
					break
				}
			} else if(button.type == 'addressLocation') {
				//地址定位按钮
				var needs = {
					'sendAddressPlaceName': '地点名称',
					sendAddressLongitude: '经度',
					sendAddressLatitude: '纬度'
				}
				noEmpty(needs)
				if(button.sendAddressPlaceName.length>10) {
					res = false
					this.warning('位置名称请小于10个字符')
					break
				}
			} else if(button.type == 'screen') {
				//拍摄按钮
				var needs = {
					'targetContact': '目标联系人联系方式',
				}
				noEmpty(needs)
				let  check = /[\u4e00-\u9fa5]/g
				if(check.test(button.targetContact)) {
					res = false
					this.warning('联系方式不能包含中文字符')
					break
				}
				if(button.targetContact.length>100) {
					res = false
					this.warning('联系方式不能超过100个字符')
					break
				}
			} else if(button.type == 'bringUp') {
				//调起指定联系人
				var needs = {
					'targetContact': '目标联系人联系方式',
				}
				noEmpty(needs)
				let  check = /[\u4e00-\u9fa5]/g
				if(check.test(button.targetContact)) {
					res = false
					this.warning('联系方式不能包含中文字符')
					break
				}
				if(button.targetContact.length>100) {
					res = false
					this.warning('联系方式不能超过100个字符')
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
	//判断个数不能超过10个，需要给提示信息
	limitButtonsNumber(buttons, buttonNums) {
		var result = true
		var buttonsLen = buttons.length
		var maxNumber = 10 //固定按钮限制最多10个
		var buttonNums = Number(buttonNums) || 0 //已有的固定按钮个数
		if(buttonNums + buttonsLen > maxNumber) {
			//不可以添加
			result = false
			this.warning(`快捷按钮和设置中的固定按钮总和不能超过${maxNumber}个`);
		}
		return result
	}
}

export {
	CatDrawJudge
}
