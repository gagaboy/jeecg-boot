class SetBackButton {
	constructor(page) {
		this.page = page //获取页面
		this.backMenuTypes = []  //默认是一个空数组
	}
	menuTypeRouter(obj) {
		var page = this.page
		//传入的值
		var menuType = obj.menuType
		var jsplumbNodeId = obj.jsplumbNodeId
		var isEdit = obj.isEdit
		
		//判断是否相等，相等就不去设置
		var len = this.backMenuTypes.length
		var last = this.backMenuTypes[len - 1]
		//如果是之前就不展示返回按钮
		if(last && last.menuType == menuType && last.jsplumbNodeId == jsplumbNodeId && last.isEdit == isEdit) {
			return
		}
		
		//如果是打开侧边就清空数据
		if(menuType == 'sideBar') {
			this.backMenuTypes = []  //设置成空数组
		}
		this.backMenuTypes.push(obj)  //设置数组，用户判断是否展示返回按钮
		//判断是否显示返回按钮
		this.setShowBackButton()
	}
	//判断是否显示返回按钮
	setShowBackButton() {
		var page = this.page
		var backMenuTypes = this.backMenuTypes
		//如果路由大于1，说明需要显示返回按钮，因为包含当前的。
		if(this.backMenuTypes.length > 1) {
			page.showBackButton = true  //展示按钮
		} else {
			page.showBackButton = false  //隐藏按钮
		}
	}
	//清空数组
	clearMenuTypes() {
		var page = this.page
		this.backMenuTypes = []
		this.setShowBackButton()  //设置是否显示返回按钮
	}
	catBackButton() {
		var page = this.page
		//设置成空的样式
		var backMenuTypes = this.backMenuTypes
		var len = backMenuTypes.length  //说明有长度
		if(len) {
			//说明要返回
			var previous = backMenuTypes[len - 2]
			this.backMenuTypes.pop()  //清空当前的侧边菜单
			if(!previous) {
				return
			}
			//设置当前的节点数据
			page.setMenuType(previous.menuType, previous.jsplumbNodeId, previous.isEdit)
		}
		this.setShowBackButton()  //判断是否显示返回按钮
	}
}

export {
	SetBackButton,
}
