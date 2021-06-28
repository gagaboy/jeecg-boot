//判断是否成环
class CatDrawAddLine {
	constructor(page) {
		this.page = page
		this.LoopArr = [] //用于保存所有的节点
	}
	findNodeById(id) {
		return this.page.drawObj.findNode(id) //找到连线的节点
	}
	//判断连线前。draw页面中需要使用
	judgeBeforeConnecting(fromId, toId) {
		var that = this

		this.LoopArr = [] //清空原来的数据

		var fromNode = this.findNodeById(fromId) //找到连线的节点
		var toNode = this.findNodeById(toId) //找到后接节点
		var result = false
		//找到前接节点的已连接数组，如果是没有，返回true，如果不是判断节点，返回false。如果是判断节点，后接节点必须是判断，才返回true
		var tos = fromNode.tos || []

		//0526新增判断节点不能连接自己
		if(toNode.nodeId == fromNode.nodeId) {
			that.page.$message.info('不能连接自己')
			return false
		}

		//说明没有下接节点，直接给默认值，直接可以连线
		if(tos.length == 0) {
			//0602修改-这块的循环提示不要了，可以这么搞，有200次的限制没事
			result = true
	} else {
			//判断是否有成环的
			var tosOne = this.findNodeById(tos[0]) //找到第一个节点
			//判断第一个是否是判断节点
			if(tosOne.nodeType == 'judge') {
				if(toNode.nodeType == 'judge') {
					result = true
				}
			}
		}
		return result
	}
	//判断中间是否有提问节点，如果是有的话，就可以继续连线
	judgeMiddle(findIndex) {
		var result = false

		//0526新增修改，只截取到需要的数组
		var LoopArr = this.LoopArr.slice(0, findIndex + 1)

		var len = LoopArr.length
		for(var i = 0; i < len; i++) {
			var node = this.findNodeById(LoopArr[i])
			if(node.nodeType == 'ask') {
				result = true
				break
			}
		}
		return result
	}
	//文案提示信息
	circularCopyInformation(findIndex) {
		var LoopArr = this.LoopArr
		var titles = []
		var findArr = LoopArr.slice(0, findIndex + 1)
		findArr.forEach((id) => {
			var item = this.findNodeById(id)
			titles.push(item.nodeName)
		})

		var title = `操作失败，${titles.join('-')}，形成死循环。`
		this.page.$message.warning({
			content: title,
			duration: 3, //设置延迟时间
		})
	}
	//判断是否有成环的
	judgeLoop(toId) {
		var toNode = this.findNodeById(toId) //找到将要后接的节点
		//直接push进去nodeId
		var toNodeTosArr = toNode.tos || []  //后接节点的所有后面节点
		var len = toNodeTosArr.length
		if(len) {
			//没有成环
			for(var i = 0; i < toNodeTosArr.length; i++) {
				var customId = toNodeTosArr[i] //找到一个id
				if(this.LoopArr.indexOf(customId) == -1) {
					//说明没有找到，push进去
					this.LoopArr.push(customId)
				} else {
					//说明已经找到了，就不走下面的了
					break
				}
				this.judgeLoop(customId)
			}
		} else {

		}
	}
}

export {
	CatDrawAddLine,
}
