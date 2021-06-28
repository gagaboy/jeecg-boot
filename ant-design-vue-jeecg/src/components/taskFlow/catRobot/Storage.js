class Storage {
	constructor(page, name, type) {
		this.page = page
//		this.name = 'catRobotStorage'  //存储名
		this.identity = page.identity  //用户登录信息
		this.botId = page.botId  //机器人id

		this.name = name
		this.type = type
	}
	//本地数据
	localList() {
		if(!this.identity) {
			return
		}
		if(!this.botId) {
			return
		}
		var chatbotStorage = this.getStorage(this.name) || {
			[this.identity]: {
				[this.botId]: [],
			}
		}
		var identity = chatbotStorage[this.identity] || {
				[this.botId]: [],
			}
		this.chatbotStorage = chatbotStorage
//		//设置本地数据
		if(identity[this.botId]) {
			this.page[this.type] = identity[this.botId]
		} else {
			this.page[this.type] = [] 
			this.setList()  //更新空数据
		}
	}
	//设置列表数据
	setList() {
		if(!this.identity) {
			return
		}
		if(!this.botId) {
			return
		}
		var chatbotStorage = this.chatbotStorage || {
			[this.identity]: {
				[this.botId]: []
			}
		}
		var identity = chatbotStorage[this.identity] || {}
		identity[this.botId] = this.page[this.type]
		chatbotStorage[this.identity] = identity
		this.setStorage(this.name, chatbotStorage)
	}
	//存在本地
	getStorage(name) {
		return JSON.parse(localStorage.getItem(name))
	}
	//设置存储
	setStorage(name, val) {
		localStorage.setItem(name, JSON.stringify(val))
	}
}

export {
	Storage
}
