import { getUUID, deepCloneCat } from './assets/js/util.js'

//设置占位符
var setPlaceholder = (node) => {
				var that = this
//				占位符样式
//触发内容引用：{触发{任务名称}的上行}
//回答引用：{{提问动作主题}的回答}
//判断引用：{{判断主题}的结果}
				var nodeName = node.nodeName
				//新增判断
				var result = {
					'trigger': `触发{${nodeName}}的上行`,
					'ask': `{${nodeName}}的回答`,
					'judge': `{${nodeName}}的结果`,
					'$now': `${nodeName}`,
					'$channelWay': `${nodeName}`,
					'$userMobile': `${nodeName}`, //0723新增当前用户手机号
					'$wechatChannelWay': `${nodeName}`,
					'$maapChannelWay': `${nodeName}`,

					'sendhttp': `{${nodeName}}的请求结果`,  //状态码
					'monitor': `${nodeName}`,  //

					'mediaResult': `{${nodeName}}的请求返回`,  //获取返回值
					
					'$quoteVariableSlot': `${nodeName}`, //10.10新增变量管理节点
				}
				nodeName = result[node.nodeType]
				return `{${nodeName}}`
			}

var functionAll = (text) => {
	let res = []
	var fun = {
		trigger: (res, text) => {
			var regex3=/{触发{([^{\}]*)}的上行}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				// 从第 0 个字符开始截取4个字符
				//取后5个字符串
				if(item.substr(0,4) == '{触发{' && item.substr(-5, 5) == '}的上行}') {
					res.push(item)
				}
			})
		},
		ask: (res, text) => {
			var regex3=/{{([^{\}]*)}的回答}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				// 从第 0 个字符开始截取4个字符
				//取后5个字符串
				if(item.substr(0,2) == '{{' && item.substr(-5, 5) == '}的回答}') {
					res.push(item)
				}
			})
		},
		judge: (res, text) => {
			var regex3=/{{([^{\}]*)}的结果}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				// 从第 0 个字符开始截取4个字符
				//取后5个字符串
				if(item.substr(0,2) == '{{' && item.substr(-5, 5) == '}的结果}') {
					res.push(item)
				}
			})
		},
		'$now': (res, text) => {
			var regex3=/{当前时间}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				res.push(item)
			})
		},
		'$channelWay': (res, text) => {
			var regex3=/{当前会话通道}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				res.push(item)
			})
		},
		'$userMobile': (res, text) => {
			var regex3=/{当前用户手机号}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				res.push(item)
			})
		},
		'$wechatChannelWay': (res, text) => {
			var regex3=/{微信通道}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				res.push(item)
			})
		},
		'$maapChannelWay': (res, text) => {
			var regex3=/{MaaP通道}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				res.push(item)
			})
		},
		//发送消息
		'sendhttp': (res, text) => {
//			{${nodeName}}的请求结果
			var regex3=/{{([^{\}]*)}的请求结果}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				// 从第 0 个字符开始截取4个字符
				//取后8个字符串
				if(item.substr(0,2) == '{{' && item.substr(-7, 7) == '}的请求结果}') {
					res.push(item)
				}
			})
		},
		//监听内容
		'monitor': (res, text) => {
			var regex3=/{([^{\}]*)}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				// 从第 0 个字符开始截取4个字符
				//取后5个字符串
				if(item.substr(0,1) == '{' && item.substr(-1, 1) == '}') {
					res.push(item)
				}
			})
		},
		//发送消息
		'mediaResult': (res, text) => {
//			{${nodeName}}的请求结果
			var regex3=/{{([^{\}]*)}的请求返回}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				// 从第 0 个字符开始截取4个字符
				//取后8个字符串
				if(item.substr(0,2) == '{{' && item.substr(-7, 7) == '}的请求返回}') {
					res.push(item)
				}
			})
		},
		//10.10新增变量管理节点
		'$quoteVariableSlot': (res, text) => {
			var regex3=/{([^{\}]*)}/g
			var result = text.match(regex3) || []
			result.forEach((item) => {
				// 从第 0 个字符开始截取4个字符
				//取后5个字符串
				if(item.substr(0,1) == '{' && item.substr(-1, 1) == '}') {
					res.push(item)
				}
			})
		},
	}
	for(var key in fun) {
		fun[key](res, text)
	}
	return res
}

/**
 * 取出花括号内的内容
 * @param text
 * @returns {string}
 */
var getBracketStr = (text) => {
//  var regex3 = /\{(.+?)\}/g;  // {} 花括号，大括号
//		var regex3 = /{(.*?)}/g  //["{我的不明{触发任务的上行内容}", "{{1是否等于2}", "{{请问你多大年龄？}"]
		var regex3 = /[^{\}]+(?=})/g  //["触发任务的上行内容", "1是否等于2", "的结果", "请问你多大年龄？", "的回答"]
    var result = text.match(regex3) || []
    return result  //返回的数组
}

//引用：判断传nodeid_主键id，其他的传nodeid（匹配）--已改
var dealNode = (result, node) =>{
	var nodeName = node.nodeName
	if(node.nodeType == 'trigger') {
		result[`触发{${nodeName}}的上行`]  = setQuoteProtocol(node)
	} else if(node.nodeType == 'ask') {
		result[`{${nodeName}}的回答`]  = setQuoteProtocol(node)
	} else if(node.nodeType == 'judge') {
		result[`{${nodeName}}的结果`]  = setQuoteProtocol(node)
	}else if(node.nodeType == 'sendhttp') {
		result[`{${nodeName}}的请求结果`]  = setQuoteProtocol(node)
	}else if(node.nodeType == 'mediaResult') {
		result[`{${nodeName}}的请求返回`]  = setQuoteProtocol(node)
	} else if(node.nodeType == 'monitor') {
		result[`${nodeName}`]  = setQuoteProtocol(node)
	}else if(node.nodeType == '$quoteVariableSlot') {
		result[`${nodeName}`]  = setQuoteProtocol(node)
	}
	//04.27新增设置常量
	var constantcalue = ['$now', '$channelWay', '$userMobile', '$wechatChannelWay', '$maapChannelWay']
	if(constantcalue.indexOf(node.nodeType) > -1) {
		result[`${nodeName}`]  = setQuoteProtocol(node)
	}
	return result
}

////新增设置监听内容,加到对应的数组中去
//var setMonitors = (monitors, item) => {
//	var monitorDataList = item.monitorDataList
//	if(!monitorDataList) {
//			return
//	}
//
//	//注意这里会设置nodeName和nodeId
//	monitorDataList.forEach((monitorData) => {
//		if(monitorData.monitorId) {
//			//这里替换成需要的值
//				monitors.push({
//					monitorName: monitorData.monitorName,  //设置名字
//					monitorId: monitorData.monitorId,  //设置名字
//
//					nodeName: monitorData.monitorName,  //设置名字
//					nodeType: 'monitor',  //这里设置之后，方便去添加
//					nodeId: monitorData.monitorId,  //设置nodeId，方便后面去使用
//					taskflowId: item.taskflowId,  //设置，方便引用的使用
//					show: true,
//				})
//		}
//	})
//}
////把监听内容push到原数组中去，方便进行替换
//var nodeListAddMonitors = (nodeList) => {
////	var monitors = []
//	var mediaResults = []
//	nodeList.forEach((item) => {
//		if(item.show && item.nodeType == 'sendhttp') {
////			setMonitors(monitors, item)
//			if(item.needMediaResult) {
//				var newItem = deepCloneCat(item)
//				newItem.nodeType = 'mediaResult'
//				mediaResults.push(newItem)
//			}
//		}
//	})
////	return [...nodeList, ...monitors, ...mediaResults]
//	return [...nodeList, ...mediaResults]
//}

//字符串数组替换成nodeId数组
var stringToIdObj = (nodeList, inputs) => {
////	//04.30新增这里要手动去加上监听内容并设置
//	nodeList = nodeListAddMonitors(nodeList)
	var result = {}
	var  inputsArray =  functionAll(inputs)  //找到所有的内容
	//循环去取node的值到数组中去
	for(let i = 0; i < inputsArray.length; i++ ) {
		let find = false
		nodeList.forEach((item) => {
			var changeNodeName = setPlaceholder(item)
			if(item.show && inputsArray[i] == changeNodeName) {
				dealNode(result, item)
				find = true
			}
		})
		if(!find) {
//			result[inputsArray[i]] = ''
			result[inputsArray[i]] = inputsArray[i]  //还是设置成原来的值，不去修改了
		}
	}
	return result
}

//////替换input成nodeId
var replaceStringToNodeId = (nodeList, inputs) => {
	inputs = inputs || ''
	var obj = stringToIdObj(nodeList, inputs)
	for(var key in obj) {
//		inputs = inputs.split(key).join(obj[key])
		inputs = inputs.split(`{${key}}`).join(`{${obj[key]}}`)  //0907修改替换加上大括号
	}
	return inputs
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//id转string
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var dealNodeNew = (result, node) =>{
	var nodeName = node.nodeName
	if(node.nodeType == 'trigger') {
		result[`${setQuoteProtocol(node)}`]  = `触发{${nodeName}}的上行`
	} else if(node.nodeType == 'ask') {
		result[`${setQuoteProtocol(node)}`]  = `{${nodeName}}的回答`
	} else if(node.nodeType == 'judge') {
		result[`${setQuoteProtocol(node)}`]  = `{${nodeName}}的结果`
	}else if(node.nodeType == 'sendhttp') {
		result[`${setQuoteProtocol(node)}`]  = `{${nodeName}}的请求结果`
	} else if(node.nodeType == 'mediaResult') {
		result[`${setQuoteProtocol(node)}`]  = `{${nodeName}}的请求返回`
	} else if(node.nodeType == 'monitor') {
		result[`${setQuoteProtocol(node)}`]  = `${nodeName}`
	} else if(node.nodeType == '$quoteVariableSlot') {
		result[`${setQuoteProtocol(node)}`]  = `${nodeName}`
	}
	//04.27新增设置常量
	var constantcalue = ['$now', '$channelWay', '$userMobile', '$wechatChannelWay', '$maapChannelWay']
	if(constantcalue.indexOf(node.nodeType) > -1) {
		result[`${setQuoteProtocol(node)}`]  = `${nodeName}`
	}
	return result
}

//字符串数组替换成nodeId数组
var stringToIdObjNew = (nodeList, inputs) => {
	var result = {}
	nodeList.forEach((item) => {
			if(item.show) {
				dealNodeNew(result, item)
			}
		})
	return result
}

//0729新增处理未替换到的值
var replaceEmpty = function(obj, inputs) {
		var inputsArray = getBracketStr(inputs)//匹配到的数组

		var keysArray = Object.keys(obj)  //取现有的对象
	//循环去取node的值到数组中去
	for(let i = 0; i < inputsArray.length; i++ ) {
		var item = inputsArray[i]
		//说明没有找到对应，需要替换
		if(keysArray.indexOf(item) == -1 ) {
			//还需要判断第二位和第三位是::，否则可能是用户输入的内容
			var sliceStr = item.slice(1, 3)
			if(sliceStr == '::') {
				obj[item] = '空'
			}
		}
	}
	return obj
}

var replaceNodeIdToString = (nodeList, nodedeInputs) => {
	nodedeInputs = nodedeInputs || ''
	//新增判断不是字符串，直接返回‘’，因为judge那里给的是true和false
	if(typeof(nodedeInputs)!='string') {
		return ''
	}
////	//新增这里要手动去加上监听内容并设置
//	nodeList = nodeListAddMonitors(nodeList)
	var obj = stringToIdObjNew(nodeList, nodedeInputs) //字符串数组替换成nodeId数组

	obj = replaceEmpty(obj, nodedeInputs) //0729新增处理未替换到的值
	for(var key in obj) {
		if(obj[key]) {
//			nodedeInputs = nodedeInputs.split(key).join(obj[key])
			nodedeInputs = nodedeInputs.split(`{${key}}`).join(`{${obj[key]}}`)  //0907修改替换加上大括号
		} else {
		}
	}
	return nodedeInputs
}

//新增引用新协议,节点的引用
var setQuoteProtocol = (node) => {
	var result = {
		'$now': '1::$now',
		'$channelWay': '1::$channelWay',
		'$userMobile': '1::$userMobile',
		'$wechatChannelWay': '1::$wechatChannelWay',
		'$maapChannelWay': '1::$maapChannelWay',
		trigger: `2::taskTrigger#${node.taskflowId}.${node.nodeId}.$info`,
		ask: `2::askNode#${node.taskflowId}.${node.nodeId}.$info`,
		judge: `2::judgeNode#${node.taskflowId}.${node.nodeId + '_' + node.id}.$info`,
		sendhttp: `2::eventNode#${node.taskflowId}.${node.nodeId}.$actionCode`,
		mediaResult: `2::eventNode#${node.taskflowId}.${node.nodeId}.$mediaResult`,
		monitor: `2::eventNode#${node.taskflowId}.${node.nodeId}.$actionResult`,
		'$quoteVariableSlot': `3::${node.botId}.${node.variableId}`,
	}
	var nodeType = node.nodeType
	return result[nodeType]
}

//初始化节点
class AbuotQuote {
	constructor(page) {
		this.page = page
		this.replaceStringToNodeId = replaceStringToNodeId  ////字符串转id，更新的时候使用--单独转字符串
		this.replaceNodeIdToString = replaceNodeIdToString  ////id转名字，获取信息的时候使用--单独转字符串
	}
	//字符串转id，更新的时候使用（数组）,是否需要替换掉
	replaceStringIntoIdArr(nodeList, arr, needReplace) {
//		needReplace是否需要替换，还是只是需要去换值
		arr.forEach((item) => {
			var replyType = item.replyType || 'text'
			//判断是文本才去设置
			if(replyType == 'text') {
				//新增修改传递的参数
				item.reply = {
					content: needReplace ? (replaceStringToNodeId(nodeList, item.originalMessage) || '') : item.originalMessage,
				}
			}	else if(replyType == 'singleCard') {
				item.reply.card.title = needReplace ? (replaceStringToNodeId(nodeList, item.reply.card.originalTitle) || '') : item.reply.card.originalTitle
				item.reply.card.description = needReplace ? (replaceStringToNodeId(nodeList, item.reply.card.originalDescription) || '') : item.reply.card.originalDescription
				//这里是否需要去替换buttons
				this.replaceStringIntoIdArrButtons(nodeList, item.reply.card.buttons, needReplace)
//				//0918新增素材引用类型
//				item.reply.card.revisionMedia = needReplace ? (replaceStringToNodeId(nodeList, item.reply.card.originalMedia) || '') : item.reply.card.originalMedia
			} else if(replyType == 'manyCards') {
				var cards = item.reply.cards
				for(let j = 0; j < cards.length; j++) {
					cards[j].title = needReplace ? (replaceStringToNodeId(nodeList, cards[j].originalTitle) || '') : cards[j].originalTitle
					cards[j].description = needReplace ? (replaceStringToNodeId(nodeList, cards[j].originalDescription) || '') : cards[j].originalDescription

					//这里是否需要去替换buttons
					this.replaceStringIntoIdArrButtons(nodeList, cards[j].buttons, needReplace)
				}
			}
		})
		return arr
	}
	//替换按钮里的内容
	replaceStringIntoIdArrButtons(nodeList, buttons, needReplace) {
//		needReplace是否需要替换对引用的值
		var buttons = buttons || []
		for(let i = 0; i < buttons.length; i++) {
			var button = buttons[i]

			//如果这样需要去替换掉
			if(button.type == 'reply') {
				button.description = needReplace ? (replaceStringToNodeId(nodeList, button.originalDescription) || '') : button.originalDescription
				button.content = button.description //赋值给content
			} else if(button.type == 'url') {
				button.content = needReplace ? (replaceStringToNodeId(nodeList, button.originalContent) || '') : button.originalContent
			} else if(button.type == 'openApp') {
				//10.12新增引用
				button.openAppAndroid = needReplace ? (replaceStringToNodeId(nodeList, button.originalOpenAppAndroid) || '') : button.originalOpenAppAndroid
			} else if(button.type == 'call') {
				button.callPhone = needReplace ? (replaceStringToNodeId(nodeList, button.originalCallPhone) || '') : button.originalCallPhone
			} else if(button.type == 'addressLocation') {
				//10.12新增引用
				button.sendAddressPlaceName = needReplace ? (replaceStringToNodeId(nodeList, button.originalSendAddressPlaceName) || '') : button.originalSendAddressPlaceName
				button.sendAddressLongitude = needReplace ? (replaceStringToNodeId(nodeList, button.originalSendAddressLongitude) || '') : button.originalSendAddressLongitude
				button.sendAddressLatitude = needReplace ? (replaceStringToNodeId(nodeList, button.originalSendAddressLatitude) || '') : button.originalSendAddressLatitude
			} else if(button.type == 'screen') {
				//10.12新增引用
				button.targetContact = needReplace ? (replaceStringToNodeId(nodeList, button.originalTargetContact) || '') : button.originalTargetContact
			} else if(button.type == 'bringUp') {
				button.targetContact = needReplace ? (replaceStringToNodeId(nodeList, button.originalTargetContact) || '') : button.originalTargetContact
			}
		}
		return buttons
	}
//字符串转id，更新的时候使用（数组）,是否需要替换掉
	replaceIdIntoStringArr(nodeList, arr = [], needReplace) {
//		needReplace是否需要替换，还是只是需要去换值
		arr.forEach((item) => {
			var replyType = item.replyType || 'text'
			//判断是文本才去设置
			if(replyType == 'text') {
				item.originalMessage = needReplace ? (replaceNodeIdToString(nodeList, item.reply.content) || '') : item.reply.content
			}	else if(replyType == 'singleCard') {
				item.reply.card.originalTitle = needReplace ? (replaceNodeIdToString(nodeList, item.reply.card.title) || '') : item.reply.card.title
				item.reply.card.originalDescription = needReplace ? (replaceNodeIdToString(nodeList, item.reply.card.description) || '') : item.reply.card.description
				//这里是否需要去替换buttons
				this.replaceIdIntoStringArrButtons(nodeList, item.reply.card.buttons, needReplace)

//				//0918新增素材引用类型
//				item.reply.card.chooseMediaStyle = item.reply.card.chooseMediaStyle || 'chooseMediasImg'  //设置默认值
//				item.reply.card.originalMedia = needReplace ? (replaceNodeIdToString(nodeList, item.reply.card.revisionMedia) || '') : item.reply.card.revisionMedia
			} else if(replyType == 'manyCards') {
				var cards = item.reply.cards
				for(let j = 0; j < cards.length; j++) {
					cards[j].originalTitle = needReplace ? (replaceNodeIdToString(nodeList, cards[j].title) || '') : cards[j].title
					cards[j].originalDescription = needReplace ? (replaceNodeIdToString(nodeList, cards[j].description) || '') : cards[j].description
					//这里是否需要去替换buttons
					this.replaceIdIntoStringArrButtons(nodeList, cards[j].buttons, needReplace)
				}
			}
		})
		return arr
	}
	//替换按钮里的内容
	replaceIdIntoStringArrButtons(nodeList, buttons, needReplace) {
//		needReplace是否需要替换对引用的值
		var buttons = buttons || []
		for(let i = 0; i < buttons.length; i++) {
			var button = buttons[i]
			//如果这样需要去替换掉
			if(button.type == 'reply') {
				button.originalDescription = needReplace ? (replaceNodeIdToString(nodeList, button.description) || '') : button.description
				button.content = button.originalDescription //赋值给content
			} else if(button.type == 'url') {
				button.originalContent = needReplace ? (replaceNodeIdToString(nodeList, button.content) || '') : button.content
				
				//11.13新增打开url的方式默认值
				button.application = button.application || 'webview'
			} else if(button.type == 'openApp') {
				button.originalOpenAppAndroid = needReplace ? (replaceNodeIdToString(nodeList, button.openAppAndroid) || '') : button.openAppAndroid
			} else if(button.type == 'call') {
				button.originalCallPhone = needReplace ? (replaceNodeIdToString(nodeList, button.callPhone) || '') : button.callPhone
			} else if(button.type == 'addressLocation') {
				button.originalSendAddressPlaceName = needReplace ? (replaceNodeIdToString(nodeList, button.sendAddressPlaceName) || '') : button.sendAddressPlaceName
				button.originalSendAddressLongitude = needReplace ? (replaceNodeIdToString(nodeList, button.sendAddressLongitude) || '') : button.sendAddressLongitude
				button.originalSendAddressLatitude = needReplace ? (replaceNodeIdToString(nodeList, button.sendAddressLatitude) || '') : button.sendAddressLatitude
			} else if(button.type == 'screen') {
				button.originalTargetContact = needReplace ? (replaceNodeIdToString(nodeList, button.targetContact) || '') : button.targetContact
			} else if(button.type == 'bringUp') {
				button.originalTargetContact = needReplace ? (replaceNodeIdToString(nodeList, button.targetContact) || '') : button.targetContact
			}
		}
		return buttons
	}

	//04.27新增默认的节点
	defaultQuote(arr) {
		var result = {
			'$now': '当前时间',
			'$channelWay': '当前会话通道',
			'$userMobile': '当前用户手机号', //0723新增当前用户手机号
			'$wechatChannelWay': '微信通道',
			'$maapChannelWay': 'MaaP通道',
		}
		for(var key in result) {
			arr.push({
				nodeType: key,
				show: true,
				jsplumbNodeId: getUUID(),
				nodeName: result[key],
			})
		}
		return arr
	}
}


export {
	setPlaceholder,

	AbuotQuote,
}
