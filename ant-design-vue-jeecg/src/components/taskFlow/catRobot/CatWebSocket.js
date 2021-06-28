var isTest = false
class CatWebSocket {
	constructor(webSocketUrl) {
		this.webSocketUrl = webSocketUrl; //请求地址
		this.webSocketOnmessage = null //处理返回的数据
		this.activeShutdown = false //是否是用户主动关闭
		this.tryReopenCount = 0 //重连的次数
		this.maxTryReopenCount = 3 //断开重连最大次数，之前是6次
		
		if(!isTest) {
			this.initWebSocket() //初始化
		}
		
		//心跳机制
		this.heartCheck = {
			classObj: this,
			timeout: 20 * 1000, //20s发送心跳的时间
			timeoutObj: null,
			reset: function() {
				this.close()
				this.start();
			},
			start: function() {
				if(!this.classObj || !this.classObj.webSocket) {
					this.close()
					return
				}

				this.timeoutObj = setInterval(() => {
					this.classObj && this.classObj.webSocket && this.classObj.webSocket.send("HeartBeat");
				}, this.timeout)
			},
			close: function() {
				if(this.timeoutObj) {
					clearInterval(this.timeoutObj);
					this.timeoutObj = null
				}
			}
		}
	}
	initWebSocket() {
		let _self = this
		this.webSocket = new WebSocket(this.webSocketUrl);
		this.webSocket.onopen = (event) => {
//							console.log(event, "websocket打开", new Date());
			_self.heartCheck.start()
			this.tryReopenCount = 0
		};
		this.webSocket.onmessage = (event) => {
			//				_self.heartCheck.reset()
//			console.log(event, "websocket接受消息", event.data);
			if(typeof _self.webSocketOnmessage == 'function') {
				_self.webSocketOnmessage(event.data)
			}
		};
		this.webSocket.onclose = (event) => {
			_self.heartCheck.close() //关闭之后去关闭心跳机制
//							console.log(event, "websocket断开", new Date());
			//手动关闭的不去重连
			if(_self.activeShutdown) {
				return
			}
			
			//0501新增_判断重连机制
			if(this.tryReopenCount == 0) {
				_self.tryReopen() //第一次直接重连
			} else if(this.tryReopenCount < this.maxTryReopenCount)  {
				setTimeout(() => {
					_self.tryReopen()
				}, 5 * 1000); //断开后5s重连
			}
//			//重连机制
//			_self.tryReopen() //第一次直接重连
//			setTimeout(() => {
//				_self.tryReopen()
//			}, 20 * 1000); //断开后20s重连
		};
		this.webSocket.onerror = function(event) {
			_self.heartCheck.close() //关闭之后去关闭心跳机制
//							console.log(event, "websocket发生错误", new Date());
		};
	}
	closeWebSocket() {
		this.webSocket && this.webSocket.close()
	}
//	tryReopen() {
//		var clientObj = this
//		console.log(`-重连-${clientObj.tryReopenCount}次`, new Date())
//		if((!clientObj.webSocket || clientObj.webSocket.readyState === WebSocket.CLOSED || clientObj.webSocket.readyState === WebSocket.CLOSING) &&
//			(!clientObj.tryReopenCount || clientObj.tryReopenCount < this.maxTryReopenCount)) {
//			clientObj.tryReopenCount = (clientObj.tryReopenCount || 0) + 1;
//			clientObj.initWebSocket();
//		}
//	}
tryReopen() {
		var clientObj = this
//		console.log(`-重连-${clientObj.tryReopenCount}次`, new Date())
		if(!clientObj.webSocket || clientObj.webSocket.readyState === WebSocket.CLOSED || clientObj.webSocket.readyState === WebSocket.CLOSING) {
			if(!clientObj.tryReopenCount || clientObj.tryReopenCount < this.maxTryReopenCount) {
				clientObj.tryReopenCount = (clientObj.tryReopenCount || 0) + 1;
				clientObj.initWebSocket();
			} else {
				//提示重连失败
//				console.log('重连3次失败')
			}
		}
	}
	//0501新增发送消息前先判断是否有链接，如果没有先去链接再发送消息
	judgeWsReadyState() {
		var clientObj = this
		return new Promise((resolve, reject) => {
			if(!clientObj.webSocket || clientObj.webSocket.readyState === WebSocket.CLOSED || clientObj.webSocket.readyState === WebSocket.CLOSING) {
				clientObj.tryReopenCount = 0  //这里设置tryReopenCount为0，再去重连,否则可能不会去重连
				//需要重连下
				clientObj.tryReopen()
				reject()
			} else {
				resolve()
			}
		})
	}
}

export {
	CatWebSocket
}