import { AbuotQuote } from './abuotQuote.js' //卡片
//用于更新节点
class UploadQuote {
	constructor(page) {
		this.page = page //获取页面
		//用来转换字符串和node
		this.abuotQuote = new AbuotQuote()

		this.allNodeList = []
	}
	uploadForEach(node) {
		var nodeList =this.page.data.nodeList
			var allNodeList = [...nodeList, ...this.page.otherNodeList]
			this.allNodeList = allNodeList
		nodeList.forEach((item) => {
			//1.需要show。2不能是当前节点
			if(item.show && (item.jsplumbNodeId != node.jsplumbNodeId)) {
				var nodeType = item.nodeType
				if(nodeType == 'ask') {
//					//			//字符串转nodeId
					this.abuotQuote.replaceIdIntoStringArr(allNodeList, item.inputContents, true)
					item.askFailContent[0].originalMessage = this.abuotQuote.replaceNodeIdToString(allNodeList, item.askFailContent[0].reply)  //修改成去替换对应的值
					//10.13新增引用
					item.buttons = this.abuotQuote.replaceIdIntoStringArrButtons(allNodeList, item.buttons, true) || []
				} else if(nodeType == 'send') {
					this.abuotQuote.replaceIdIntoStringArr(allNodeList, item.inputContents, true)
					//10.13新增引用
					item.buttons = this.abuotQuote.replaceIdIntoStringArrButtons(allNodeList, item.buttons, true) || []
				} else if(nodeType == 'sendhttp') {
					var httpRequestFormDataArr = item.httpRequestFormData
					httpRequestFormDataArr.forEach((item1) => {
						item1.originalValue = this.abuotQuote.replaceNodeIdToString(allNodeList, item1.value)  //这里要进行替换,转换成原来的值
					})

					var httpRequestHeads = (item.httpRequestHeads)
					httpRequestHeads.forEach((item) => {
						item.originalValue = this.abuotQuote.replaceNodeIdToString(allNodeList, item.value)
					})

					//0804新增更新请求数据的引用值
					item.originalHttpRequestData = this.abuotQuote.replaceNodeIdToString(allNodeList, item.httpRequestData)

				} else if(nodeType == 'judge') {
					var judgeModuleList = item.judgeModuleList
					judgeModuleList.forEach((judgeProjectOne) => {
						//不是默认分支就去修改
						if(!judgeProjectOne.isDefaultBranch) {
							this.dealJudgeJudgeProject(judgeProjectOne)
						}
					})
				} else if(nodeType == 'manageVariables') {
					//10.13新增引用值
					var variableConfig = item.variableConfig
					variableConfig.forEach((variableConfigOne) => {
						variableConfigOne.originalVarSlotValue = this.abuotQuote.replaceNodeIdToString(allNodeList, variableConfigOne.varSlotValue)
					})
				}
			}

		})
	}
	//0509新增处理数组中引用内容
	dealJudgeJudgeProject(judgeProjectOne) {
		var judgeProject = judgeProjectOne.judgeProject || []
		judgeProject.forEach((item) => {
			//更新设置里的值
			item.inputOne[0].originalMessage = this.abuotQuote.replaceNodeIdToString(this.allNodeList, item.inputOne[0].reply)  //替换后的值
			item.inputTwo[0].originalMessage = this.abuotQuote.replaceNodeIdToString(this.allNodeList, item.inputTwo[0].reply)  //替换后的值
		})
	}
}

export {
	UploadQuote,
}
