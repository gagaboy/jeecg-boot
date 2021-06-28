import abuotNode from './abuotNode.js' //卡片
import { AbuotQuote } from './abuotQuote.js' //卡片

import { getUUID} from './assets/js/util.js'

var isTest = false

//get请求时拼接参数
var stitchinParameters = (obj = {}) => {
	var result = []
	for(var key in obj) {
		if(obj[key]) {
			result.push(`${key}=${obj[key]}`)
		}
	}
	return result.join('&')
}
//对应的关系
var askmodels = {
	'不验证': 1,
	'电话号码': 2,
	'邮件地址': 3,
	'整数': 4,
	'正则表达式': 5,
	'图片': 6,
	'语音': 7,
	'视频': 8,
	'地理位置': 9,
}

//			不验证 1
//电话号码 2 regex.checkMobile($inPut)
//邮件地址 3 regex.checkEmail($inPut)
//整数  4  regex.checkInteger($inPut)
//正则表达式 5 $inPut=~/中间是用户输入的正则/
var answerRuleExprs = {
	1: '',
	2: 'regex.checkMobile($inPut)',
	3: 'regex.checkEmail($inPut)',
	4: 'regex.checkInteger($inPut)',
	6: 'regex.checkPicture($msgType)',
	7: 'regex.checkAudio($msgType)',
	8: 'regex.checkVideo($msgType)',
	9: 'regex.checkLocation($msgType)',
}

//对应关系
var points = {
	ask: 1,
//	send: 2,  //04.29修改，send换成6
	sendhttp: 2,
	judge: 3,
	exchange: 4,
	trigger: 5, //触发器
	send: 6, //发送http请求
	defaultReply: 7, //默认回复添加
//	joinUserGroup: 8, //加入用户组
//	removeUserGroup: 9, //移除用户出用户组
	
	manageVariables: 8, //10.10新增变量管理节点,不用管上面的
}

var replys = {
	1: '随机发送一条',
	2: '发送所有',
}

var dealRuleExpr = (ruleExpr, needAdd) => {
	if(!ruleExpr) {
		ruleExpr = ''
	}
	//替换成需要的格式，和回显时的处理
	if(needAdd) {
		return `$inPut=~/${ruleExpr}/`
	} else {
		return ruleExpr.substring(9, ruleExpr.length - 1)
	}
}

////1是askNode 2是eventNode 3是judgeNode 4是switchNode 5是trigger

class AbuotApi {
	constructor(page) {
		this.page = page //获取页面

		this.acceptUrl = page.acceptUrl //所有的地址请求
		this.data = page.data
		this.$http = page.$http

		//用来存原始数据
		this.firstData = [] // 原始数据

		this.defaultSendNodeNum = 0 //0528新增_当前机器人中其他画布中的默认回复节点个数

		//用来转换字符串和node
		this.abuotQuote = new AbuotQuote()
	}
	//处理判断节点的删除连线
	dealJudgeDelPoint(parmer, sourceNode, targetNode) {
		if(targetNode.nodeType == 'judge') {
			parmer.judgeNodeId = targetNode.id
			if(sourceNode.tos.length <= 1) {
				parmer.ifRemoveAll = true
			} else {
				parmer.ifRemoveAll = false
			}
		}
	}
	//删除连线
	delPoint(sourceNode, targetNode) {
		return new Promise((resolve, reject) => {

			var sourceId = sourceNode.id //这里给对应的值
			if(sourceNode.nodeType == 'trigger') {
				sourceId = this.page.id
			}

			var nodeType = points[sourceNode.nodeType] + "" //转成对应的值
			var parmer = {
				sourceId: Number(sourceId), //触发器给这个
				chatbotTaskflowId: Number(this.page.id), //表的主键
				nodeType, //对应5个关系，触发器的是5
			}

			this.requestMy('post', 'delPoint', parmer).then((data) => {
				this.page.setUpdateTime(data)
				resolve()

				//0515修改，这里需要去更新nextNode,不然会出现无法保存后消失问题
				if(sourceNode.nodeType == 'judge') {
					var neesJudgeNodeOne = this.dealNextNode(sourceNode)
					if(neesJudgeNodeOne) {
						neesJudgeNodeOne.nextNode = null
					}
				} else if(sourceNode.nodeType == 'trigger') {
					sourceNode.triggerNode = null //10.14清空后面的值，不然进入还是会连接
				}
			})
		})
	}
	//删除节点
	delNode(sourceNode) {
		return new Promise((resolve, reject) => {
			var nodeType = points[sourceNode.nodeType] + "" //转成对应的值
			var sourceId = sourceNode.id //这里给对应的值
			if(sourceNode.nodeType == 'trigger') {
				sourceId = this.page.id
			}

			var parmer = {
//				sourceId, //触发器才给这个
				nodeId: sourceNode.nodeId, //0509修改直接传这个值

				chatbotTaskflowId: Number(this.page.id), //表的主键
				nodeType: nodeType, //对应5个关系，触发器的是5
				botId: this.page.botId,
			}
			this.requestMy('post', 'delNode', parmer).then((data) => {
				this.page.setUpdateTime(data)
				resolve()
			})
		})
	}
	//处理判断节点的新建指向
	dealJudgeEditPoint(parmer, sourceNode, targetNode) {
		if(targetNode.nodeType == 'judge') {
			parmer.judgeNodeId = targetNode.id

			//这里取已经连过来的nodeId
			if(sourceNode.tos && sourceNode.tos[0]) {
				//找到其他判断节点，然后取nodeI的,传给后端
				var otherNode = this.page.drawObj.findNode(sourceNode.tos[0])
				if(otherNode.nodeType == 'judge') {
					parmer.nextNode = otherNode.nodeId
				}
			}
		}
	}
	//新建指向，连线的先不处理
	editPoint(sourceNode, targetNode) {
		var sourceId = sourceNode.id //这里给对应的值
		if(sourceNode.nodeType == 'trigger') {
			sourceId = this.page.id
		}
		var nodeType = points[sourceNode.nodeType] + "" //转成对应的值

		var parmer = {
//			sourceId, //触发器才给这个
			id: sourceId,
			chatbotTaskflowId: this.page.id, //表的主键
			nodeType, //对应5个关系，触发器的是5
			nextNode: targetNode.nodeId, //后接节点的id
		}

//		//处理判断节点的参数--需要单独去处理
		this.requestMy('post', 'editPoint', parmer).then((data) => {
			if(targetNode.nodeType == 'judge' && data.changedJudgeNodeId) {
				targetNode.nodeId = data.changedJudgeNodeId //更新上去
			}
			this.page.setUpdateTime(data)

			//0515修改，这里需要去更新nextNode,不然会出现无法保存后消失问题
			if(sourceNode.nodeType == 'judge') {
				var neesJudgeNodeOne = this.dealNextNode(sourceNode)
					if(neesJudgeNodeOne) {
						neesJudgeNodeOne.nextNode = targetNode.nodeId
					}
			} else if(sourceNode.nodeType == 'trigger') {
				sourceNode.triggerNode = targetNode.nodeId //10.14设置triggerNode，不然连线会掉
			}
		})
	}
	//0515更新nextNode值
	dealNextNode(sourceNode) {
		var judgeModuleList = sourceNode.judgeModuleList
		var result = null
		for(let j = 0; j < judgeModuleList.length; j++) {
					var judgeNodeOne = judgeModuleList[j]
					if(judgeNodeOne.id == sourceNode.id) {
						result = judgeNodeOne
					}
			}
		return result
	}
	//设置参数
	setParmer(node, isEdit) {
		var result = {}
		var nodeType = node.nodeType
		var nodeList = [...this.page.data.nodeList, ...this.page.otherNodeList]

		if(nodeType == 'trigger') {
			var ruleExpr = node.ruleExpr

			result = {
				templateId: this.page.templateId,
				id: this.page.id,
//				"keyWords": node.inputContents.join(','),
//				"ruleExpr": ruleExpr,
				//0706修改传参
				triggerJson: JSON.stringify({
					"keyWords": node.inputContents.join(','),
					"ruleExpr": ruleExpr,

					triggerNode: node.triggerNode, //0817新增设置后接节点
				}),
				position: {
					left: node.left,
					top: node.top,
				}
			}
		} else if(nodeType == 'ask') {
			var answerRuleExpr = node.answerRuleExpr
			//正则的时候需要单独去传这个
			var askmodelType = askmodels[node.askmodel] || 1
			if(askmodelType == '5') {
			} else {
				answerRuleExpr = answerRuleExprs[askmodelType]
			}

//			//字符串转nodeId
			this.abuotQuote.replaceStringIntoIdArr(nodeList, node.inputContents, true)
			//单独去设置
			node.askFailContent[0].reply = this.abuotQuote.replaceStringToNodeId(nodeList, node.askFailContent[0].originalMessage)

				//替换掉按钮
//			this.abuotQuote.replaceStringIntoIdArrButtons(nodeList, node.buttons, false)
			this.abuotQuote.replaceStringIntoIdArrButtons(nodeList, node.buttons, true) //10.13加入引用

			result = {
//				askNodeId: node.id, //编辑单独带上的参数
				id: node.id, //0706新增修改编辑单独带上的参数

				"templateId": this.page.templateId, //新增带上的参数
				"taskflowId": this.page.taskflowId, //新增带上的参数

				botId: this.page.botId,
				chatbotTaskflowId: this.page.id,
				nodeName: node.nodeName,
				askReply: {
					"onceReplyMode": node.onceReplyMode,
					"replyCollection": node.inputContents,
					buttons: node.buttons || [],  //新增设置buttons
				},
				position: {
					left: node.left,
					top: node.top,
				},
				ruleType: askmodels[node.askmodel],
				failedReply: node.askFailContent[0].reply, //这里去转换后的值传到后台去
				originalFailedReply: node.askFailContent[0].originalMessage,
				answerRuleExpr, //正则表达式
			}

			//0627新增设置成字符串
			this.jsonStringify(result, ['askReply'])
		} else if(nodeType == 'send' || nodeType == 'defaultReply') {
			//0506新增，这里去统一去设置默认节点的名字
			if(nodeType == 'defaultReply') {
				//找到所有的默认节点，然后去判断个数
				var len = this.defaultSendNodeNum
				this.page.data.nodeList.forEach((item) => {
					if(item.nodeType == 'defaultReply') {
						len += 1
					}
				})
				//如果不是编辑的状态，就去添加名字
				if(!isEdit) {
					node.nodeName = `发送默认回复(${len + 1})`
				}
			}

			result = {
//				sendNodeId: node.id, //编辑单独带上的参数
				id: node.id, //编辑单独带上的参数

				"templateId": this.page.templateId, //新增带上的参数
				"taskflowId": this.page.taskflowId, //新增带上的参数
				botId: this.page.botId,
				chatbotTaskflowId: this.page.id,
				nodeName: node.nodeName,
				replyContext: {},
				position: {
					left: node.left,
					top: node.top,
				},

				//04.29新增参数,默认回复的是true
        isFinalNode: ((nodeType == 'defaultReply') ? true : false),
//				//04.29新增参数,默认回复的是true
//				isFinalNode: ((nodeType == 'defaultReply') ? 'true' : 'false'),
			}
			//如果是发送节点，带上这2个
			if(nodeType == 'send') {
				//字符串转nodeId
				this.abuotQuote.replaceStringIntoIdArr(nodeList, node.inputContents, true)
				//替换掉按钮
//				this.abuotQuote.replaceStringIntoIdArrButtons(nodeList, node.buttons, false)
				this.abuotQuote.replaceStringIntoIdArrButtons(nodeList, node.buttons, true) //10.13加入引用
				result.replyContext = {
					"onceReplyMode": node.onceReplyMode,
					"replyCollection": node.inputContents,
					buttons: node.buttons || [],  //新增设置buttons
				}
			}

			//0627新增设置成字符串
			this.jsonStringify(result, ['replyContext'])
		} else if(nodeType == 'exchange') {
			result = {
//				switchNodeId: node.id, // "switchNodeId":"100020"
				id: node.id, //编辑单独带上的参数

				switchTask: node.exchangeId, //新增带上的参数,切换时的id

				"templateId": this.page.templateId, //新增带上的参数
				"taskflowId": this.page.taskflowId, //新增带上的参数
				botId: this.page.botId,
				chatbotTaskflowId: this.page.id,
				nodeName: node.nodeName,
				position: {
					left: node.left,
					top: node.top,
				}
			}
		} else if(nodeType == 'judge') {

			var judgeModuleList1 = []
			//0509修改判断节点
			var judgeModuleList = node.judgeModuleList
			judgeModuleList.forEach((item) => {
				if(!item.isDefaultBranch) {
					this.dealjudgeParmer(item) //设置参数
				}
				if(item.showJudgeModule) {
					judgeModuleList1.push(item)
				}
			})

			result = {
				nodeId: node.nodeId,  //传nodeId过去

				"templateId": this.page.templateId, //新增带上的参数
				"taskflowId": this.page.taskflowId, //新增带上的参数
				botId: this.page.botId,
				chatbotTaskflowId: this.page.id,
				nodeName: node.nodeName,
				position: {
					left: node.left,
					top: node.top,
				},
				judgeModuleList: judgeModuleList1, //0509新增判断节点
			}
		} else if(nodeType == 'sendhttp') {
			//替换引用的值
			var httpRequestHeads = node.httpRequestHeads
			httpRequestHeads.forEach((item) => {
				item.value = this.abuotQuote.replaceStringToNodeId(nodeList, item.originalValue)
			})
			//替换引用的值
			var httpRequestFormData = node.httpRequestFormData
			var httpRequestFormDataObj = {}  //后端需要对象
			httpRequestFormData.forEach((item) => {
				item.value = this.abuotQuote.replaceStringToNodeId(nodeList, item.originalValue)
				httpRequestFormDataObj[item.name] = item.value
			})

			//0804新增请求数据的引用值
			node.httpRequestData = this.abuotQuote.replaceStringToNodeId(nodeList, node.originalHttpRequestData)

			result = {
//				eventNodeId: node.id, //编辑单独带上的参数
				id: node.id, //编辑单独带上的参数

				"templateId": this.page.templateId, //新增带上的参数
				"taskflowId": this.page.taskflowId, //新增带上的参数
				botId: this.page.botId,
				chatbotTaskflowId: this.page.id,
				nodeName: node.nodeName,
				httpRequestContext: {
					httpRequestMethod: node.httpRequestMethod,  //http请求类型 get/post
					httpRequestUrl:  node.httpRequestUrl, //http请求地址
					httpRequestHeads: node.httpRequestHeads, //http请求头参数
					contentType: node.contentType, //显示的内容
					httpRequestContentType: node.httpRequestContentType , //http请求contentType
					httpRequestFormData: httpRequestFormDataObj, //这里需要单独去处理
					httpRequestData: node.httpRequestData, //http请求数据（contentType为其他，如json,text.xml）
					needMonitor: node.needMonitor, //是否需要监听返回数据
					monitorDataList: node.monitorDataList, //监听取数据表达式
					
//					needMediaResult: node.needMediaResult, //0918新增素材引用http的请求返回
					//10.13新增转换模板
					needMediaAudit: node.needMediaAudit,
					msgTemplate: node.msgTemplate,
				},
				position: {
					left: node.left,
					top: node.top,
				},
				
			}
			//0627新增设置成字符串
			this.jsonStringify(result, ['httpRequestContext'])
		} else if(nodeType == 'joinUserGroup' || nodeType == 'removeUserGroup') {
			var operateFlags = {
				'joinUserGroup': '1',
				'removeUserGroup': '2',
			}
			result = {
				groupId: node.groupId, //新增带上的参数，加入用户组的id
				operateFlag: operateFlags[nodeType], //1是新增，2是删除

//				groupNodeId: node.id, // "groupNodeId":"节点的主键"
				id: node.id, //编辑单独带上的参数

				"templateId": this.page.templateId, //新增带上的参数
				"taskflowId": this.page.taskflowId, //新增带上的参数
				botId: this.page.botId,
				chatbotTaskflowId: this.page.id,
				nodeName: node.nodeName,
				position: {
					left: node.left,
					top: node.top,
				}
			}
		} else if(nodeType == 'manageVariables') {
			var variableConfig = node.variableConfig
			//替换成id
			variableConfig.forEach((item) => {
				item.varSlotValue = this.abuotQuote.replaceStringToNodeId(nodeList, item.originalVarSlotValue)
			})
			variableConfig = JSON.stringify(variableConfig) //需转成string
			result = {
//				groupId: node.groupId, //新增带上的参数，加入用户组的id
//				operateFlag: operateFlags[nodeType], //1是新增，2是删除

//				groupNodeId: node.id, // "groupNodeId":"节点的主键"
				id: node.id, //编辑单独带上的参数

				"templateId": this.page.templateId, //新增带上的参数
				"taskflowId": this.page.taskflowId, //新增带上的参数
				botId: this.page.botId,
//				chatbotTaskflowId: this.page.id,
				variableConfig,
				nodeName: node.nodeName,
				position: {
					left: node.left,
					top: node.top,
				}
			}
		}
		this.jsonStringify(result, ['position'])
		return result
	}
	jsonStringify(result, needString) {
//		var needString = ['position']
		needString.forEach((item) => {
			result[item] = JSON.stringify(result[item])
		})
	}
	//判断节点的时候，需要通过上一个节点去找到已经连接的节点数组，然后取node
	judgeFindNodeId(node) {
		var initialNode = node.initialNode
		if(!initialNode) {
			return ''
		}
		var otherNodeId = initialNode.tos && initialNode.tos[0]
		if(!otherNodeId) {
			return ''
		}
		//找到其他判断节点，然后取nodeI的,传给后端
		var otherNode = this.page.drawObj.findNode(otherNodeId)
		return otherNode.nodeId
	}
	returnSymbol(parma1, parma2, equal) {
		var result = ''
		//		包含 str.contains(parma1,parma2)
		//不包含 str.notContains(parma1,parma2)
		//符合正则 regex.checkRegex(parma1,parma2)
		//不符合正则 !(regex.checkRegex(parma1,parma2))
		if(equal == '等于') {
			result = `${parma1}==${parma2}`
		} else if(equal == '不等于') {
			result = `${parma1}!=${parma2}`
		} else if(equal == '小于') {
			result = `${parma1}<${parma2}`
		} else if(equal == '大于') {
			result = `${parma1}>${parma2}`
		} else if(equal == '小于等于') {
			result = `${parma1}<=${parma2}`
		} else if(equal == '大于等于') {
			result = `${parma1}>=${parma2}`
		} else if(equal == '包含') {
			result = `str.contains(${parma1},${parma2})`
		} else if(equal == '不包含') {
			result = `str.notContains(${parma1},${parma2})`
		} else if(equal == '符合正则') {
			result = `regex.checkRegex(${parma1},${parma2})`
		} else if(equal == '不符合正则') {
			result = `!(regex.checkRegex(${parma1},${parma2}))`
		} else if(equal == '存在') {
			result = `str.ifExist(${parma1})`
		} else if(equal == '不存在') {
			result = `str.ifNotExist(${parma1})`
		} else if(equal == '判断成立') {
			result = `${parma1}==${parma2}`
		} else if(equal == '判断不成立') {
			result = `${parma1}==${parma2}`
		} else if(equal == 'http请求成功') {
//			result = `${parma1}==${parma2}`
			result = `str.ifExist(${parma1})&&${parma1}==${parma2}`
		} else if(equal == 'http请求失败') {
//			result = `${parma1}!=${parma2}`
			result = `str.ifExist(${parma1})&&${parma1}!=${parma2}`
		} else if(equal == '上行内容为文本') {
			result = `regex.checkText(${parma1})`
		} else if(equal == '上行内容为图片') {
			result = `regex.checkPicture(${parma1})`
		} else if(equal == '上行内容为音频') {
			result = `regex.checkAudio(${parma1})`
		} else if(equal == '上行内容为视频') {
			result = `regex.checkVideo(${parma1})`
		}
		return result
	}
	dealjudgeParmer(item = {}) {
		var judgeProject = item.judgeProject
		var judgeExprArr = []
		item.preInputs = []
		for(let i = 0; i < judgeProject.length; i++) {
			var judgeInputs = judgeProject[i]
			var parma1 = "param" + (2 * i + 1)
			var parma2 = "param" + (2 * i + 2)

			var operate = judgeInputs.equal
			var equal = operate

			var nodeList = [...this.page.data.nodeList, ...this.page.otherNodeList]

//			//字符串转nodeId
			judgeInputs.inputOne[0].reply = this.abuotQuote.replaceStringToNodeId(nodeList, judgeInputs.inputOne[0].originalMessage)  //替换后的值
			judgeInputs.inputTwo[0].reply = this.abuotQuote.replaceStringToNodeId(nodeList, judgeInputs.inputTwo[0].originalMessage)  //替换后的值

			var firstInput = {
				"originalMessage": judgeInputs.inputOne[0].originalMessage,
				"changedMessage": judgeInputs.inputOne[0].reply,
				"inputKey": parma1,
			}
			var lastInput = {
				"originalMessage": judgeInputs.inputTwo[0].originalMessage,
				"changedMessage": judgeInputs.inputTwo[0].reply,
				"inputKey": parma2,
			}

			if(equal == '判断成立') {
				lastInput.originalMessage = true
				lastInput.changedMessage = true
			} else if(equal == '判断不成立') {
				lastInput.originalMessage = false
				lastInput.changedMessage = false
			}
			//0515修改判断运算符号
			if(equal == 'http请求成功' || equal == 'http请求失败') {
				lastInput.originalMessage = 200
				lastInput.changedMessage = 200
			}

			var operate = judgeInputs.equal
			var concat = item.satisfy

			//0513修改传值，存在和不存在不传lastInput进去
			var pushObj = {
				firstInput,
				lastInput,
				operate,
				concat,
			}
			if(equal == '存在') {
				delete pushObj.lastInput
			} else if(equal == '不存在') {
				delete pushObj.lastInput
			}

			item.preInputs.push(pushObj)

			var str = this.returnSymbol(parma1, parma2, judgeInputs.equal)
			if(str) {
				judgeExprArr.push(str)
			}
		}
		
		//			//0629新增
		item.preInputs = JSON.stringify(item.preInputs)
		
		if(item.satisfy == '所有') {
			item.judgeExpr = encodeURIComponent(judgeExprArr.join('&&'))
		} else if(item.satisfy == '任意') {
			item.judgeExpr = encodeURIComponent(judgeExprArr.join('||'))
		}
	}
	dealButtons(node, data) {
		//新增返回了buttons的contentId，用于更新
		if(data.outReplyContext) {
			var outReplyContext = JSON.parse(data.outReplyContext)
			var replyCollection = outReplyContext.replyCollection || []
			node.inputContents = replyCollection
			node.buttons = outReplyContext.buttons || []
		}
	}
	//0825修改-判断节点的更新id
	setOutJudgeModuleList(node, data) {
		var outJudgeModuleList = data.outJudgeModuleList || []
		var oldJudgeModuleList = node.judgeModuleList || []
		//找到数组中没有id的数组去更新
		var findNoIdJudgeModuleList = []
		oldJudgeModuleList.forEach((oldItem, index) => {
				if(!oldItem.id) {
					findNoIdJudgeModuleList.push(oldItem)
				}
		})
		//循环新数组，然后去更新没有id值的数组
		outJudgeModuleList.forEach((item, index) => {
			findNoIdJudgeModuleList.forEach((oldItem, index) => {
					if(oldItem.jsplumbNodeId == item.jsplumbNodeId) {
						oldItem.id = item.id
					}
			})
		})
	}
	//更新节点数据
	upData(node, type) {
		var callBack = (data) => {
			this.page.setUpdateTime(data)
      if(type != 'changeNodeSite') {
        this.page.notice('操作成功')
      }
      //新增返回了buttons的contentId，用于更新
			this.dealButtons(node, data)

			//新增这里需要去更新监听内容的id
			if(node.nodeType == 'sendhttp') {
				var outHttpRequestContext = this.stringToObj(data.outHttpRequestContext)
				var monitorDataList = outHttpRequestContext.monitorDataList
				node.monitorDataList = (monitorDataList)  //会有更新
			} else if(node.nodeType == 'judge') {
				this.setOutJudgeModuleList(node, data) //0825修改-判断节点的更新id
			}
		}

		return new Promise((resolve, reject) => {
			var nodeType = node.nodeType
			var upDataCorrespond = {
				trigger: 'editTrigger',
				ask: 'editAskNode',
//				send: 'editEventNode',
				send: 'editSendNode',
				exchange: 'editSwitchNode',
				judge: 'editJudgeNode',
				sendhttp: 'editEventNode',

				defaultReply: 'editSendNode',//新增发送默认节点

				joinUserGroup: 'editGroupNode',//新增加入用户组
				removeUserGroup: 'editGroupNode',//新增移除出用户组
				
				manageVariables: 'editVariableNode',  //10.10新增变量管理节点
			}
			if(upDataCorrespond[nodeType]) {


				if(type != 'changeNodeSite') {
	        //0629新增loading
					this.showSpin(1)
	      }

				this.requestMy('post', upDataCorrespond[nodeType], this.setParmer(node, true)).then((data) => {
					callBack(data)
					resolve(data)
					if(type != 'changeNodeSite') {
						this.showSpin(0)
		      }
				}).catch(() => {
					reject()
					if(type != 'changeNodeSite') {
						this.showSpin(0)
		      }
				})
			}
		})
	}
	setPostion(node) {
		var initialNode = node.initialNode //前接节点
		var left = Number(initialNode.left.slice(0, -2)) + 278 //卡片默认大小278
		var top = Number(initialNode.top.slice(0, -2))
		if(initialNode.nodeType == 'judge') {
			var judgeModuleList = initialNode.judgeModuleList || []
			var len = 1
			judgeModuleList.forEach((item) => {
				if(item.tos && item.tos.length) {
					len+=1
				}
			})
			node.left = (left + 48 + 18 * len) + 'px'
			node.top = (top + 18 * len) + 'px'
		} else {
			node.left = (left + 48) + 'px'
			node.top = (top) + 'px'
		}
	}
//	0506新增判断不能为 发送默认回复()
	judgeDefaultReplyName(node) {
		var nodeName = node.nodeName
		var removeDefaultReplyName = /^发送默认回复\(\d\)$/i
		if(removeDefaultReplyName.test(nodeName)) {
			this.page.$message.warning('动作主题不能包含"发送默认回复"');
			//包含名字，需要返回false
			return true
		} else {
			return false
		}
	}
	//新增节点
	addNode(node) {
		//设置默认节点位置
		this.setPostion(node)

		var callBack = (data) => {
			node.id = data.outId
			node.nodeId = data.outNodeId
			node.createTime = data.outCreateTime //新增创建日期
			this.page.setUpdateTime(data)
			this.page.notice('添加成功')

			//新增这里需要去更新监听内容的id
			if(node.nodeType == 'sendhttp') {
				var outHttpRequestContext = this.stringToObj(data.outHttpRequestContext)
				var monitorDataList = outHttpRequestContext.monitorDataList
				node.monitorDataList = (monitorDataList)
			} else if (node.nodeType == 'defaultReply') {
					if(data.outReplyContext) {
						var outReplyContext = JSON.parse(data.outReplyContext)
						node.onceReplyModeLabel = outReplyContext.onceReplyMode == 1 ? '随机发送一条' : '发送所有'
						var replyCollection = outReplyContext.replyCollection || []
						var result = {
							'text': '文本',
							'image': '图片',
							'voice': '音频',
							'video': '视频',
							'singleCard': '单卡',
							'manyCards': '多卡',
						}
						replyCollection.forEach((item) => {
							var replyType = item.replyType
							item.replyNameMy = result[replyType]
						})
						node.replyCollection = replyCollection
					}
			} else if(node.nodeType == 'judge') {
				var judgeModuleList1 = data.outJudgeModuleList || []  //新的判断分支数组（带id）
				var oldJudgeModuleList = node.judgeModuleList  //之前的判断分支数组（不带id）
				//0915修改，先拿到旧的对象，然后循环数组，去找到对应的判断分支更新id
				var judgeModuleIds = {}
				judgeModuleList1.forEach((item, index) => {
					var jsplumbNodeId = item.jsplumbNodeId
					if(jsplumbNodeId) {
						judgeModuleIds[jsplumbNodeId] = item.id
					}
				})
				oldJudgeModuleList.forEach((item, index) => {
					var jsplumbNodeId = item.jsplumbNodeId
					if(jsplumbNodeId) {
						item.id = judgeModuleIds[jsplumbNodeId]
					}
				})
			}
		}
		return new Promise((resolve, reject) => {
			//	0506新增判断不能为 发送默认回复()
			if(this.judgeDefaultReplyName(node)) {
				reject()
				return
			}

			var nodeType = node.nodeType
			var addCorrespond = {
				ask: 'addAskNode',
//				send: 'addEventNode',
				send: 'addSendNode',
				exchange: 'addSwitchNode',
				judge: 'addJudgeNode',
				sendhttp: 'addEventNode',
				defaultReply: 'addSendNode',//新增发送默认节点

				joinUserGroup: 'addGroupNode',//新增加入用户组
				removeUserGroup: 'addGroupNode',//新增移除出用户组
				manageVariables: 'addVariableNode',  //10.10新增变量管理节点
			}

			if(addCorrespond[nodeType]) {
				//0629新增loading
				this.showSpin(1)
				this.requestMy('post', addCorrespond[nodeType], this.setParmer(node)).then((data) => {
					callBack(data) //处理当前的数据
					resolve(data)
					this.showSpin(0)
				}).catch(() => {
					reject()
					this.showSpin(0)
				})
			}
		})
	}
	//请求方法
	requestMy(type, urlType, parmer = {}) {
		//			type:get或post方法， urlType请求的别称
		var that = this
		var acceptUrl = this.acceptUrl
		var url = acceptUrl[urlType]
		return new Promise((resolve, reject) => {
			//如果是get请求，拼接参数到链接后
			if(type == 'get' && stitchinParameters(parmer)) {
				url = url + '?' + stitchinParameters(parmer)
			} else {
//				parmer = {
//					param: JSON.stringify(parmer)
//				}
			}

			that.page.$http[type](url, parmer).then(response => {
				if(!response) {
						this.page.$message.error('服务器未返回！');
				}
				// var res = response.data
        var res = response
				if(res.code == '200') {
					var data = res.result
					resolve(data)
				} else {
					try{
						res.message && that.page.$message.error(res.message);
					}catch(e){}
					reject()
				}
			}, response => {
				try{
						var res = response.data
						res.message && that.page.$message.error(res.message);
					}catch(e){}
				reject()
			})
		});
	}
	//字符串转对象
	stringToObj(data) {
		return JSON.parse(data)
	}
	//获取所有节点，用于下接节点和引用
	setAllNodeList(rawData) {
		//需要带上nodeType和show，方便去查询引用
		var askNodeList = rawData.askNodeList
		askNodeList.forEach((item) => {
			item.jsplumbNodeId = getUUID()
			item.nodeType = 'ask'
		})
		//04.29修改改成这个字段
		var sendNodeList = rawData.sendNodeList || []
		sendNodeList.forEach((item) => {
			item.jsplumbNodeId = getUUID()
			if(item.isFinalNode) {
				//说明是发送节点，否则说明是默认节点
				item.nodeType = 'defaultReply'
			} else {
				item.nodeType = 'send'
			}
		})
		//新增这里改成了发送节点
		var eventNodeList = rawData.eventNodeList
		eventNodeList.forEach((item) => {
			item.jsplumbNodeId = getUUID()
			item.nodeType = 'sendhttp'  //发送消息节点
			
			//0907处理没有引用到的问题
			var httpRequestContext = this.stringToObj(item.httpRequestContext) || {}
			item.monitorDataList = (httpRequestContext.monitorDataList)
			
//			item.needMediaResult = httpRequestContext.needMediaResult //0918新增素材引用http的请求返回
		})
		//0722新增这里改成了加入用户组
		var groupNodeList = rawData.groupNodeList || []
		groupNodeList.forEach((item) => {
			item.jsplumbNodeId = getUUID()
		})

		var judgeNodeList = rawData.judgeNodeList
		judgeNodeList.forEach((item) => {
			item.jsplumbNodeId = getUUID()
			item.nodeType = 'judge'
		})
		var switchNodeList = rawData.switchNodeList
		switchNodeList.forEach((item) => {
			item.jsplumbNodeId = getUUID()
			item.nodeType = 'exchange'
		})
		
		//10.10新增for循环变量管理节点
		var variableNodeList = rawData.variableNodeList || []
		variableNodeList.forEach((item) => {
			item.jsplumbNodeId = getUUID()
			item.nodeType = 'manageVariables'
		})
		
		this.allNodeList = askNodeList.concat(eventNodeList, judgeNodeList, switchNodeList, sendNodeList, groupNodeList, variableNodeList);
		this.allNodeList.forEach((item) => {
			item.show = true //设置成显示
		})
	}
	//找到下接节点,如果是判断节点，会有多个
	findNextNodeIdArray(nextNode) {
		var result = []
		if(!nextNode) {
			return result
		}
		var allNodeList = this.allNodeList
		for(var i = 0; i < allNodeList.length; i++) {
			var node = allNodeList[i]
			if(nextNode == node.nodeId) {
				result.push(node)
			}
		}
		return result
	}
	//引用的处理
	findNodeAndId() {
		var result = []
		var allNodeList = this.allNodeList
		for(var i = 0; i < allNodeList.length; i++) {
			var node = allNodeList[i]
			result.push(node.nodeId + '_' + node.id)
		}
		return result
	}
	removeOtherNodeList() {
		var otherNodeList = this.page.otherNodeList
		var result = []
		var findNodeAndId = this.findNodeAndId()
		otherNodeList.forEach((item) => {
			if(findNodeAndId.indexOf(item.nodeId + '_' + item.id) == -1) {
				result.push(item)
			} else {
				//设置创建时期
			}
		})

		this.page.otherNodeList = result //这里排除掉当前页面中，方便后面去使用
	}
	//设置触发器的创建日期，从节点数据中获取
	setTriggerCreateTime(node) {
		var otherNodeList = this.page.otherNodeList || []
		otherNodeList.forEach((item) => {
			if((item.nodeId + '_' + item.id) ==  (node.nodeId + '_' + node.id) ) {
				node.createTime = item.createTime
			}
		})
	}

	//初始化用户数据
	getWorkFlowNode(data) {
		this.setAllNodeList(data) //设置所有nodeList

		data.triggerJson = this.stringToObj(data.triggerJson) //字符串转对象,触发器
		data.triggerJson.taskflowName = data.taskflowName

		data.triggerPosition = this.stringToObj(data.triggerPosition) //字符串转对象,触发器--发现不是对象
		this.dealTrigger(data.triggerJson, data.triggerPosition) //处理触发器

		//for循环询问节点
		data.askNodeList.forEach((askNode) => {
			this.dealAsk(askNode) //处理询问节点
		})
		//		////for循环发送消息
		var sendNodeList = data.sendNodeList || []
		sendNodeList.forEach((nodeItem) => {
			this.dealSend(nodeItem) //处理询问节点
		})

		////for循环发送消息
		data.eventNodeList.forEach((nodeItem) => {
			this.dealSendhttp(nodeItem) //处理询问节点
		})

		////for循环切换消息
		if(data.switchNodeList.length) {
			data.switchNodeList.forEach((nodeItem) => {
				this.dealExchange(nodeItem) //处理询问节点
			})
		} else {
			//设置值
			this.page.getWorkFlow().then(() => {})
		}

		////for循环判断节点
		data.judgeNodeList.forEach((nodeItem) => {
			this.dealJudge(nodeItem) //处理询问节点
		})

		//0722新增for循环用户组节点
		data.groupNodeList && data.groupNodeList.forEach((nodeItem) => {
			this.dealGroupNodeList(nodeItem)
		})
		
		///10.10新增for循环变量管理节点
		data.variableNodeList.forEach((nodeItem) => {
			this.dealManageVariables(nodeItem) //处理变量管理节点
		})

		//04.30修改这里去删除重复的节点
		this.removeOtherNodeList()

		this.defaultSendNodeNum = data.defaultSendNodeNum || 0
	}
	addFirstData(obj) {
		//新增这里都带上taskflowId，方便引用的使用
		obj.taskflowId = this.page.taskflowId

		this.firstData.push(obj)
	}
	//处理触发器
	dealTrigger(triggerJson, triggerPosition) {
		var obj = new abuotNode['trigger']() //初始化触发器
		obj.jsplumbNodeId = getUUID() //这里设置一个节点,这里给一个默认的值
		if(triggerJson.keyWords && triggerJson.keyWords.length) {
			obj.inputContents = triggerJson.keyWords.split(',') //转成数组
			obj.inputName = obj.inputContents.join('\n')
		}

		obj.nodeName = triggerJson.taskflowName //设置名字，用于引用匹配

		//转换成对应的格式
		var ruleExpr = triggerJson.ruleExpr || ''
//		ruleExpr = dealRuleExpr(ruleExpr, 0)

		obj.ruleExpr = ruleExpr
		if(triggerPosition.left) {
			obj.left = triggerPosition.left
		}
		if(triggerPosition.top) {
			obj.top = triggerPosition.top
		}

		obj.nodeId = this.page.taskflowId //设置node去查引用的内容（引用）
		obj.id = this.page.id //设置node去查引用的内容（引用）

		this.addFirstData(obj)

		//////////////////////
		this.setTriggerCreateTime(obj)  //设置创建日期
		this.allNodeList.unshift(obj) //这里添加到所有的对象里去。用于查找下接节点
		//////////////////////

		//处理节点
		if(triggerJson.triggerNode) {
			var nextNodeIdArray = this.findNextNodeIdArray(triggerJson.triggerNode)
			if(nextNodeIdArray.length) {
				nextNodeIdArray.forEach((node) => {
					var line = {
						from: obj.jsplumbNodeId, //上一个节点
						to: node.jsplumbNodeId, //下一个节点
					}
					this.page.data.lineList.push(line)
				})
			}
		}
		//0817新增设置后接节点
		obj.triggerNode = triggerJson.triggerNode
	}
	//处理询问节点
	dealAsk(askNode) {
		var obj = new abuotNode['ask']() //初始化触发器
		obj.nodeId = askNode.nodeId
		obj.id = askNode.id
		obj.jsplumbNodeId = askNode.jsplumbNodeId //这里设置一个节点,这里给一个默认的值

		obj.nodeName = askNode.nodeName //提问主题
		var askReply = this.stringToObj(askNode.askReply) //转成对象
		obj.onceReplyMode = askReply.onceReplyMode //设置值
		obj.onceReplyModeLabel = replys[obj.onceReplyMode]
		obj.createTime = askNode.createTime //创建日期，用于引用排序

//		//		//字符串转nodeId
		var nodeList = [...this.allNodeList, ...this.page.otherNodeList]
		//			//字符串转nodeId
			this.abuotQuote.replaceIdIntoStringArr(nodeList, askReply.replyCollection, true)


		//0609新增设置是否需要清空之前的id
		if(!this.page.pageParameters.needUpload) {
			this.page.aboutMaterial && this.page.aboutMaterial.judgeMaterialId(askReply.replyCollection)
		}

		obj.inputContents = askReply.replyCollection //回复内容
//		obj.buttons = askReply.buttons || [] //新增返回buttons的数组
		obj.askmodelType = askNode.ruleType || 1 //给一个默认值

		//设置对应的值
		for(var key in askmodels) {
			if(askmodels[key] == obj.askmodelType) {
				obj.askmodel = key
			}
		}
		askNode.failedReply = askNode.failedReply || ''

		obj.askFailContent[0].originalMessage = this.abuotQuote.replaceNodeIdToString([...this.allNodeList, ...this.page.otherNodeList], askNode.failedReply)  //修改成去替换对应的值
		obj.askFailContent[0].reply = askNode.failedReply  //0525设置初始值，方便去替换
		//10.13新增引用替换值
		obj.buttons = this.abuotQuote.replaceIdIntoStringArrButtons([...this.allNodeList, ...this.page.otherNodeList], askReply.buttons, true) || []

		//转换成对应的格式
		var answerRuleExpr = askNode.answerRuleExpr
		if(obj.askmodelType == '5') {
		} else {
			answerRuleExpr = ''
		}
		obj.answerRuleExpr = answerRuleExpr

		//设置坐标
		var position = this.stringToObj(askNode.position) //转成对象
		obj.left = position.left
		obj.top = position.top

		this.addFirstData(obj)

		//		//连线的处理
		if(askNode.nextNode) {
			var nextNodeIdArray = this.findNextNodeIdArray(askNode.nextNode)
			if(nextNodeIdArray.length) {
				nextNodeIdArray.forEach((node) => {
					var line = {
						from: obj.jsplumbNodeId, //上一个节点
						to: node.jsplumbNodeId, //下一个节点
					}
					this.page.data.lineList.push(line)
				})
			}
		}
	}
		//处理发送消息
	dealSend(nodeItem) {
//		var nodeType = (nodeItem.isFinalNode == 'true') ? 'defaultReply' : 'send'
		var nodeType = (nodeItem.isFinalNode) ? 'defaultReply' : 'send'
		var obj = new abuotNode[nodeType]() //初始化触发器

		obj.nodeId = nodeItem.nodeId
		obj.id = nodeItem.id
		obj.jsplumbNodeId = nodeItem.jsplumbNodeId //这里设置一个节点,这里给一个默认的值

		obj.nodeName = nodeItem.nodeName //提问主题

		if(nodeType == 'send') {
			var replyContext = this.stringToObj(nodeItem.replyContext) //转成对象
			obj.onceReplyMode = replyContext.onceReplyMode //设置值
			obj.onceReplyModeLabel = replys[obj.onceReplyMode]
			obj.createTime = nodeItem.createTime //创建日期，用于引用排序

//			//		//字符串转nodeId
			var nodeList = [...this.allNodeList, ...this.page.otherNodeList]
		//			//字符串转nodeId
			this.abuotQuote.replaceIdIntoStringArr(nodeList, replyContext.replyCollection, true)
			//10.13新增引用替换值
			obj.buttons = this.abuotQuote.replaceIdIntoStringArrButtons(nodeList, replyContext.buttons, true) || []

			//0609新增设置是否需要清空之前的id
			if(!this.page.pageParameters.needUpload) {
				this.page.aboutMaterial && this.page.aboutMaterial.judgeMaterialId(replyContext.replyCollection)
			}

			obj.inputContents = replyContext.replyCollection //回复内容
//			obj.buttons = replyContext.buttons || [] //新增返回buttons的数组
		} else if(nodeType == 'defaultReply') {

			//设置默认回复内容
			if(nodeItem.replyContext) {
					var outReplyContext = JSON.parse(nodeItem.replyContext)
					obj.onceReplyModeLabel = (outReplyContext.onceReplyMode == 1) ? '随机发送一条' : '发送所有'
					var replyCollection = outReplyContext.replyCollection || []
					var result = {
						'text': '文本',
						'image': '图片',
						'voice': '音频',
						'video': '视频',
						'singleCard': '单卡',
						'manyCards': '多卡',
					}
					replyCollection.forEach((item) => {
						var replyType = item.replyType
						item.replyNameMy = result[replyType]
					})

					//0609新增设置是否需要清空之前的id
					if(!this.page.pageParameters.needUpload) {
						this.page.aboutMaterial && this.page.aboutMaterial.judgeMaterialId(replyCollection)
					}

					obj.replyCollection = replyCollection
				}
		}

		//		//设置坐标
		var position = this.stringToObj(nodeItem.position) //转成对象
		obj.left = position.left
		obj.top = position.top
		this.addFirstData(obj)

		//连线的处理
		if(nodeItem.nextNode) {
			var nextNodeIdArray = this.findNextNodeIdArray(nodeItem.nextNode)
			if(nextNodeIdArray.length) {
				nextNodeIdArray.forEach((node) => {
					var line = {
						from: obj.jsplumbNodeId, //上一个节点
						to: node.jsplumbNodeId, //下一个节点
					}
					this.page.data.lineList.push(line)
				})
			}
		}
	}
	//处理发送消息
	dealSendhttp(nodeItem) {
		var obj = new abuotNode['sendhttp']() //初始化触发器
		obj.nodeId = nodeItem.nodeId
		obj.id = nodeItem.id
		obj.jsplumbNodeId = nodeItem.jsplumbNodeId //这里设置一个节点,这里给一个默认的值

		obj.nodeName = nodeItem.nodeName //提问主题
		var httpRequestContext = this.stringToObj(nodeItem.httpRequestContext) //转成对象
		var httpRequestContext1 = JSON.parse(JSON.stringify(httpRequestContext))
		for(var key in httpRequestContext1) {
			obj[key] = httpRequestContext1[key]  //设置页面
		}

		//0804新增请求数据的引用值
		obj.originalHttpRequestData = this.abuotQuote.replaceNodeIdToString([...this.allNodeList, ...this.page.otherNodeList], obj.httpRequestData)

		//这里需要把后端对象转成一个数组然后展示在页面中
		var httpRequestFormDataArr = []
//		var httpRequestFormDataObj = this.stringToObj(httpRequestContext.httpRequestFormData)
		var httpRequestFormDataObj = (httpRequestContext.httpRequestFormData)
		for(var key in httpRequestFormDataObj) {
			httpRequestFormDataArr.push({
				name: key,
				value: httpRequestFormDataObj[key],
				originalValue: this.abuotQuote.replaceNodeIdToString([...this.allNodeList, ...this.page.otherNodeList], httpRequestFormDataObj[key]),  //这里要进行替换,转换成原来的值
			})
		}
		obj.httpRequestFormData = httpRequestFormDataArr

		//新增设置httpRequestHeads，需要进行反替换id
		var httpRequestHeads = (httpRequestContext.httpRequestHeads)
		httpRequestHeads.forEach((item) => {
			item.originalValue = this.abuotQuote.replaceNodeIdToString([...this.allNodeList, ...this.page.otherNodeList], item.value)
			item.value = item.value  //0525新增设置初始值
		})

		obj.httpRequestHeads = httpRequestHeads
		obj.monitorDataList = (httpRequestContext.monitorDataList)

//		obj.needMonitor = httpRequestContext.needMonitor == 'true' ? true : false  //这里返回的是字符串，需要替换成true或false
		obj.needMonitor = httpRequestContext.needMonitor  //这里返回的是字符串，需要替换成true或false
		
//		obj.needMediaResult = httpRequestContext.needMediaResult //0918新增素材引用http的请求返回
		
		//10.13新增转换模板
		obj.needMediaAudit= httpRequestContext.needMediaAudit
		obj.msgTemplate= httpRequestContext.msgTemplate || {}

		obj.createTime = nodeItem.createTime //创建日期，用于引用排序
		//		//设置坐标
		var position = this.stringToObj(nodeItem.position) //转成对象
		obj.left = position.left
		obj.top = position.top
		this.addFirstData(obj)

		//连线的处理
		if(nodeItem.nextNode) {
			var nextNodeIdArray = this.findNextNodeIdArray(nodeItem.nextNode)
			if(nextNodeIdArray.length) {
				nextNodeIdArray.forEach((node) => {
					var line = {
						from: obj.jsplumbNodeId, //上一个节点
						to: node.jsplumbNodeId, //下一个节点
					}
					this.page.data.lineList.push(line)
				})
			}
		}
	}
	//0509新增处理数组中引用内容
	dealJudgeJudgeProject(judgeProjectOne) {
		var judgeProject = []
		var preInputs = this.stringToObj(judgeProjectOne.preInputs) //转成对象
		preInputs.forEach((item) => {
			var judgeProjectItem = {
				inputOne: [{
					originalMessage: '',
				}],
				inputTwo: [{
					originalMessage: '',
				}],
			}

//			//字符串转nodeId
			judgeProjectItem.inputOne[0].originalMessage = this.abuotQuote.replaceNodeIdToString([...this.allNodeList,...this.page.otherNodeList], item.firstInput.changedMessage)  //替换后的值
			judgeProjectItem.inputOne[0].reply = item.firstInput.changedMessage  //0525新增设置初始值
			var lastInput = item.lastInput || {}
			judgeProjectItem.inputTwo[0].originalMessage = this.abuotQuote.replaceNodeIdToString([...this.allNodeList,...this.page.otherNodeList], lastInput.changedMessage)  //替换后的值
			judgeProjectItem.inputTwo[0].reply = lastInput.changedMessage  //0525新增设置初始值

			judgeProjectItem.equal = item.operate
			judgeProject.push(judgeProjectItem)
			judgeProjectOne.satisfy = item.concat
		})
		judgeProjectOne.judgeProject = judgeProject
	}
	//找到对应的节点信息
			findJudgeByType(arr, type) {
				var res = []
				arr.forEach((item) => {
					if(item.isDefaultBranch == type) {
						res.push(item)
					}
				})
				return res
			}
		//排序判断节点
	     filterJudge(judgeModuleList){
	     			var result = []
	     			var judgeModuleList = judgeModuleList || []
//          		var isnotDefaultBranch = this.findJudgeByType(judgeModuleList, 'false')
//          		var isDefaultBranch = this.findJudgeByType(judgeModuleList, 'true')
							var isnotDefaultBranch = this.findJudgeByType(judgeModuleList, false)
            		var isDefaultBranch = this.findJudgeByType(judgeModuleList, true)
            		result = [...isnotDefaultBranch, ...isDefaultBranch]
           	return result
        }
	//处理判断任务
	dealJudge(nodeItem) {
		var obj = new abuotNode['judge']() //初始化触发器

		obj.nodeId = nodeItem.nodeId
		obj.id = nodeItem.id
		obj.jsplumbNodeId = nodeItem.jsplumbNodeId

		obj.nodeName = nodeItem.nodeName //提问主题
		obj.createTime = nodeItem.createTime //创建日期，用于引用排序


	var judgeModuleList = nodeItem.judgeModuleList
	judgeModuleList.forEach((judgeProjectOne) => {
		//不是默认分支就去修改
		if(!judgeProjectOne.isDefaultBranch) {
			this.dealJudgeJudgeProject(judgeProjectOne)
		}

		judgeProjectOne.jsplumbNodeId = getUUID()

		judgeProjectOne.showJudgeModule = true //是否显示节点
	})
	//0514新增排序直接加到最后前一个去
	obj.judgeModuleList = this.filterJudge(judgeModuleList)

		//		//设置坐标
		var position = this.stringToObj(nodeItem.position) //转成对象
		obj.left = position.left
		obj.top = position.top
		this.addFirstData(obj)

		//0511修改处理连线
		judgeModuleList.forEach((nodeItem) => {
			nodeItem.todoMenus = {
				'addNode': true, //是否显示添加按钮
			}

			//		//连线的处理
		if(nodeItem.nextNode) {
			var nextNodeIdArray = this.findNextNodeIdArray(nodeItem.nextNode)

			if(nextNodeIdArray.length) {
				nextNodeIdArray.forEach((node) => {
					var line = {
						from: nodeItem.jsplumbNodeId, //上一个节点
						to: node.jsplumbNodeId, //下一个节点
					}
					this.page.data.lineList.push(line)
				})
			}
			//0511设置不显示添加按钮
			nodeItem.todoMenus.addNode = false
		}
	})
	}
	//处理切换任务
	dealExchange(nodeItem) {
		var obj = new abuotNode['exchange']() //初始化触发器

		obj.nodeId = nodeItem.nodeId
		obj.id = nodeItem.id
		obj.jsplumbNodeId = nodeItem.jsplumbNodeId

		obj.nodeName = nodeItem.nodeName //提问主题
		obj.createTime = nodeItem.createTime //创建日期，用于引用排序

		obj.exchangeId = nodeItem.switchTask //提问
		//设置值
		this.page.getWorkFlow().then(() => {
			var workFlows = this.page.workFlows
			workFlows.forEach((item) => {
				if(item.value == obj.exchangeId) {
					obj.exchangeName = item.label //提问
				}
			})
		})

		//		//设置坐标
		var position = this.stringToObj(nodeItem.position) //转成对象
		obj.left = position.left
		obj.top = position.top
		this.addFirstData(obj)
	}
	//0722新增处理加入用户组和删除出用户组
	dealGroupNodeList(nodeItem) {
		var operateFlag = nodeItem.operateFlag
		var operateFlags = {
			'1': 'joinUserGroup',
			'2': 'removeUserGroup'
		}
		var type = operateFlags[operateFlag]
		var obj = new abuotNode[type]() //初始化触发器

		obj.nodeId = nodeItem.nodeId
		obj.id = nodeItem.id
		obj.jsplumbNodeId = nodeItem.jsplumbNodeId

		obj.nodeName = nodeItem.nodeName //提问主题
		obj.createTime = nodeItem.createTime //创建日期，用于引用排序

		obj.groupId = nodeItem.groupId //提问


		var groupList = this.page.groupList
		groupList.forEach((item) => {
				if(item.id == obj.groupId) {
					obj.groupName = item.groupName //提问
				}
		})
		//		//设置坐标
		var position = this.stringToObj(nodeItem.position) //转成对象
		obj.left = position.left
		obj.top = position.top
		this.addFirstData(obj)

		//		//连线的处理
		if(nodeItem.nextNode) {
			var nextNodeIdArray = this.findNextNodeIdArray(nodeItem.nextNode)
			if(nextNodeIdArray.length) {
				nextNodeIdArray.forEach((node) => {
					var line = {
						from: obj.jsplumbNodeId, //上一个节点
						to: node.jsplumbNodeId, //下一个节点
					}
					this.page.data.lineList.push(line)
				})
			}
		}
	}
	///10.10新增for循环变量管理节点
	dealManageVariables(nodeItem) {
		var obj = new abuotNode['manageVariables']() //初始化触发器
		obj.nodeId = nodeItem.nodeId
		obj.id = nodeItem.id
		obj.jsplumbNodeId = nodeItem.jsplumbNodeId //这里设置一个节点,这里给一个默认的值

		obj.nodeName = nodeItem.nodeName //提问主题
		
		var variableConfig = this.stringToObj(nodeItem.variableConfig) //转成对象
		var varSlotNames = this.setVarSlotNames()
		variableConfig.forEach((item) => {
			item.originalVarSlotValue = this.abuotQuote.replaceNodeIdToString([...this.allNodeList, ...this.page.otherNodeList], item.varSlotValue)
			//这里设置变量名字
			item.varSlotName = varSlotNames[item.varSlot] //id转成名字
		})
		obj.variableConfig = variableConfig

		obj.createTime = nodeItem.createTime //创建日期，用于引用排序
		//		//设置坐标
		var position = this.stringToObj(nodeItem.position) //转成对象
		obj.left = position.left
		obj.top = position.top
		this.addFirstData(obj)

//		//连线的处理
		if(nodeItem.nextNode) {
			var nextNodeIdArray = this.findNextNodeIdArray(nodeItem.nextNode)
			if(nextNodeIdArray.length) {
				nextNodeIdArray.forEach((node) => {
					var line = {
						from: obj.jsplumbNodeId, //上一个节点
						to: node.jsplumbNodeId, //下一个节点
					}
					this.page.data.lineList.push(line)
				})
			}
		}
	}
	setVarSlotNames() {
		var res = {}
		var variableSlotList = this.page.variableSlotList || []
		variableSlotList.forEach((item) => {
			res[item.variableId] = item.variableName
		})
		return res
	}
		//0629新增loading,防止快速点击
	showSpin(type) {
		var page = this.page
//		if(type == 1) {
//			page.$Spin.show();
//		} else {
//			page.$Spin.hide();
//		}
	}
}

export {
	AbuotApi
}
