<template>
	<div class="experience-robot">
		<div v-show="showRobot" class="chat-box" :style="{height: (screenHeight + 'px')}">
			<div class="draw-flex-center chat-box-top">
				<div class="draw-flex-center chatwith-icon-round">
					<img class="robot-icon1" src="../assets/robot.png" />
				</div>
				<div v-if="chatbotName" class="draw-text-two chat-box-top-name">{{chatbotName}}</div>
			</div>
			<!--内容显示-->
			<div :id="catRobotContent" class='chat-content'>
				<template v-if="list && list.length">
					<div v-for="(item, index) in list" :key="index" :class="[ item.type ? '' : 'chat-content-right' ]">
						<template v-for="(item1, index) in item.replyCollection">

							<!--0502新增_失败提示-->
							<div v-if="item1.fail" class="draw-flex-center" style="margin-bottom: 12px; margin-right: 10px;">
								<!--<Icon type="android-alert" size="18" color="red"></Icon>-->
								<a-icon type="exclamation-circle" style="color: red; font-size: 18px;" />
							</div>
							<template v-if="item1.replyType == 'text'">
								<!--是否是转链消息-->
								<div v-if="!item1.convertLink" class="surround-pre">
									<pre v-if="item1.channelType == '1'" class="chat-detail chat-content-question" :class=" { 'chat-content-answer': item.type }">{{item1.reply.content}}</pre>
									<pre v-if="item1.channelType == '2'" class="chat-detail chat-detail1" :class=" { 'chat-content-answer1': item.type }">{{item1.reply.content}}</pre>
								</div>
								<!--转链的需要添加点击-->
								<div v-else class="surround-pre">
									<div v-if="item1.channelType == '1'" @click="openConvertLink(item1)" class="chat-detail chat-content-question draw-cursor-pointer" :class=" { 'chat-content-answer': item.type }">{{item1.reply.content}}</div>
									<div v-if="item1.channelType == '2'" @click="openConvertLink(item1)" class="chat-detail chat-detail1 draw-cursor-pointer" :class=" { 'chat-content-answer1': item.type }">{{item1.reply.content}}</div>
								</div>
							</template>
							<!--图片，音频，视频-->
							<catRobotMedia v-if="item1.replyType == 'image' || item1.replyType == 'voice' || item1.replyType == 'video' || item1.replyType == 'file'" :mediaObject="item1"></catRobotMedia>

							<!--	v1.2.1新增需求============单卡多卡-->
							<catRobotMoreCard v-if="item1.replyType == 'singleCard' || item1.replyType == 'manyCards'" @buttonReply="buttonReply" @transferLongText="transferLongText" :response="item1.reply.cards" :layout="item1.reply" :msgType="item1.replyType" @noSupportedPrompt="noSupportedPrompt" chatbotType="H5"></catRobotMoreCard>
						</template>
					</div>
				</template>
				<!--首次进入为空时的显示-->
				<div v-if="!expired && !list.length && !isDisabled && !reconnecting" class="empty-prompt">你可以在这测试一下你的机器人～</div>

				<!--新增机器人禁用时的提示信息-->
				<div v-if="isDisabled" class="draw-flex-center disable-prompt">
					<div>机器人<span class="disable-status">(已禁用)</span>，若要调试请先启用机器人</div>
				</div>

				<!--0502新增发送前ws断开重连时的提示-->
				<div v-if="reconnecting" class="draw-flex-center disable-prompt">
					<div>ws重连中...</div>
				</div>

				<!--0611新增过期了-->
				<div v-if="expired" class="draw-flex-center disable-prompt">
					<div v-html="expiredTxt"></div>
				</div>
			</div>

			<!--顶部蒙层-视频播放界面-->
			<catRobotCover :coverObject="coverObject"></catRobotCover>

			<div class="bottom-area">

				<!--0720不支持的提示信息-->
				<div v-if="noSupportedPromptButton" class="prompt-no-supported">该类按钮当前环境无法操作</div>

				<catRobotButtons v-if="buttons && buttons.length" :buttons="buttons" @buttonReply="buttonReply" @clearButtons="clearButtons" :showPrompt="isDisabled || reconnecting || expired" @noSupportedPrompt="noSupportedPrompt" chatbotType="H5"></catRobotButtons>

				<div class="draw-flex-center chat-box-bottom">
					<!--<textarea v-model="inputValue" @keyup="onKeyup" type="textarea" :rows="1" placeholder="请输入测试消息..." class="send-input" />-->
					<a-input v-model="inputValue" type="textarea" :rows="1" placeholder="请输入测试消息..." class="chat-input" />
					<button class="draw-draw-flex-center draw-draw-cursor-pointer send-btn disabled-button" @click="clickAll" data-type="addList" :style="{'background': buttonStyle}">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 24 24" version="1.1">
								<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
										<rect x="0" y="0" width="24" height="24"/>
										<path d="M3,13.5 L19,12 L3,10.5 L3,3.7732928 C3,3.70255344 3.01501031,3.63261921 3.04403925,3.56811047 C3.15735832,3.3162903 3.45336217,3.20401298 3.70518234,3.31733205 L21.9867539,11.5440392 C22.098181,11.5941815 22.1873901,11.6833905 22.2375323,11.7948177 C22.3508514,12.0466378 22.2385741,12.3426417 21.9867539,12.4559608 L3.70518234,20.6826679 C3.64067359,20.7116969 3.57073936,20.7267072 3.5,20.7267072 C3.22385763,20.7267072 3,20.5028496 3,20.2267072 L3,13.5 Z" fill="#FFFFFF"/>
								</g>
						</svg>
						<span>发送</span>
					</button>
				</div>
			</div>

			<!--0610新增底部水印-->
			<!--<img class="watermark" src="../assets/watermark.png" />-->
		</div>
		<!--底部的icon-->
		<div v-if="!showRobot" @click="clickAll" data-type="openList" class="draw-cursor-pointer robot-open">
			<img class="robot-icon" src="../assets/robot.png" />
		</div>
	</div>
</template>
<script>
	import { querySelector, convertToJson, getUUID, getUUIDnew, } from '../assets/js/util.js'

	import { Storage } from '../catRobot/Storage.js'
	import { CatWebSocket } from '../catRobot/CatWebSocket.js'
	import { WebPage } from './WebPage.js' //0611新增获取token等请求

//	import catRobotMoreCard from './catRobotH5Card/catRobotMoreCard' //单卡和多卡的组件
//	import catRobotMedia from './catRobotH5Card/catRobotMedia' //图片，音频，视频
//	import catRobotCover from './catRobotH5Card/catRobotCover' //蒙层
//	import catRobotButtons from './catRobotH5Card/catRobotButtons' //底部快捷按钮

	import catRobotMoreCard from '../catRobotCard/catRobotMoreCard' //单卡和多卡的组件
	import catRobotMedia from '../catRobotCard/catRobotMedia' //图片，音频，视频
	import catRobotCover from '../catRobotCard/catRobotCover' //蒙层
	import catRobotButtons from '../catRobotCard/catRobotButtons' //底部快捷按钮

	import qs from  'qs'
	import axios from 'axios'

	var isTest = false

	export default {
		name: 'catRobotH5',
		components: {
			catRobotMoreCard,
			catRobotMedia,
			catRobotCover,
			catRobotButtons,
		},
		props: {
			acceptUrl: {
				type: Object,
				default: function() {
					return {
						//						'wsuri': 'ws://csp.5gimos.com/cspcbws/rest/chatbotAi',
						//						chatbotAi: 'http://csp.5gimos.com/cspcbws/rest/chatbotAi/out/callXiaoYuan', //发送消息接口 post
						//						checkExpire: 'http://csp.5gimos.com/cspcbws/rest/chatbotAi/checkExpire', //校验体验机器人链接是否有效 post
						//						getToken: 'http://csp.5gimos.com/cspcbws/rest/chatbotAi/getToken', //获取token接口 get
					}
				},
			},
		},
		data: function() {
			return {
				inputValue: '',
				list: [],
				showRobot: true, //是否显示

				websock: null, //websock服务
				socketHost: '',

				channelType: '1', //默认maap通道，channelType 1-maap  2-微信
				buttons: [], //底部的按钮
				channelTypeColor: {
					1: '#1890FF',
					2: '#A9E97A',
				},
				coverObject: {
					longText: '', //设置长文本
				},

				screenHeight: document.body.clientHeight, //网页可见区域高

				isDisabled: false, //是否被禁用

				reconnecting: false, //0502新增发送前ws断开重连时的提示
				waitingList: [], //待发送列表

				//0507新增_发送返回后的list
				parseMessageList: [],
				parseMessageIndex: 0, //当前的id

				//0610新增放到这里，不通过返回
				identity: '', //会话终端唯一标识（当前测试用户的sessionId）
				botId: '', //机器人id
				chatbotName: '', //机器人名字
				uuid: '',
				access_token: '', //token数据
				expired: false, //是否过期
				expiredTxt: '链接<span style="color: #FF8488;">已过期</span>',
				//				acceptUrl: {},

				noSupportedPromptButton: false, //0720是否显示 不支持的提示文案
				noSupportedPromptButtonTimer: null, //设置定时器id

				catRobotContent: 'catRobotH5' + getUUID(), //091新增设置唯一的id值，因为页面中可能有多个
			}
		},
		created: function() {
			document.title = '体验机器人' //10.22新增设置页面title
			this.getIdentity() ////0619新增设置本地identity
			this.setAcceptUrl() //0825新增统一设置请求地址
			//0619新增获取botid和uuid
			this.setBotid() //获取连接的botid和uuid
			if(!this.botId || !this.uuid) {
				this.expired = true //链接已过期
				this.$message.error('没有botId！');
				return
			}

			//设置进入后页面overflow:auto
			document.body.style.overflow = 'auto'
			//本地存储
			this.storage = new Storage(this, 'catRobotStorage', 'list')
			this.storageButtons = new Storage(this, 'catRobotStorageButtons', 'buttons')
			//链接websock
			this.websock = new CatWebSocket(this.acceptUrl.wsuri)
			this.websock.webSocketOnmessage = (redata) => {
				this.judegAddress(redata)
			}

			//直接打开弹窗
			this.openList()

			//0611新增获取token等请求
			this.webPage = new WebPage(this)
			//重新去请求
			this.webPage.init().then(() => {
				//				this.openList()
			})
		},
		computed: {
			buttonStyle: function() {
				if(this.isDisabled) {
					return 'rgba(0,0,0,0.45)'
				}
				var result = ''
				if(this.channelType == 1) {
					result = '#1890FF'
				} else if(this.channelType == 2) {
					result = '#A9E97A'
				}
				return result
			}
		},
		mounted() {
			//			//获取信息
			//			this.messageDetail()
		},
		watch: {},
		destroyed() {
			if(this.websock) {
				this.websock.activeShutdown = true //自动关闭，不去链接了
				this.websock.closeWebSocket()
			}
		},
		methods: {
			setBotid() {
				if(isTest) {
					this.botId = '102660'
					this.uuid = 'abdbb1a435674677bb74af25d0a4a956'
				} else {
					var query = this.$route.query || {}
					this.botId = query.botId || ''
					this.uuid = query.uuid || ''
				}
			},
			//动态设置聊天窗口的高度
			setScreenHeight(val) {
				val = val - 190 //间距顶部导航栏高度+最小间距134px
				if(val <= 500) {
					val = 500
				}
				return val
			},
			//判断是否是$address,设置socketHost，用于发送消息
			judegAddress(redata) {
				var before = redata.substring(0, 10)
				var behind = redata.substring(10)
				if(before == '$address::') {
					this.socketHost = behind || ''

					//0502新增发送用户输入内容
					this.sendAfterReconnect()
				} else {
					this.dealBackMessage(convertToJson(redata)) //处理返回的数据
				}
			},
			//			//新增发送失败提示
			sendMessageFail() {
				var list = this.list
				var len = this.list.length
				var obj = this.list[len - 1]
				var replyCollection = obj.replyCollection
				replyCollection.forEach((item) => {
					item.fail = true //设置提示错误信息
				})
				//这里去设置失败的提示信息
				this.list.splice(len - 1, 1, obj)
			},
			setStorageList() {
				this.storage.setList() //保存当前的数据
			},
			messageDetail() {
				var that = this
				this.scrollBottom()
			},
			clickAll(e) {
				var that = this
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				if(typeof this[clickType] == 'function') {
					this[clickType]()
					return
				}
			},
			addListBeforeSend(inputValue) {
				var replyCollection = []
				replyCollection.push({
					"reply": {
						"content": inputValue
					},
					"replyType": "text",
					channelType: this.channelType, //必须设置才可以显示
				})
				this.setList(0, replyCollection)
				this.inputValue = ''
			},
			//0502新增发送前去判断ws的状态，如果没有就去重连
			judgeBeforeSending(inputValue) {
				//这里如果是打开状态，就直接去发送
				this.websock.judgeWsReadyState().then(() => {
					this.reconnecting = false
					//直接去发送
					this.sendUserInput(inputValue)
				}).catch((res) => {
					//1.重连。2.把内容push到数组中。3.设置ws重连的提示
					this.reconnecting = true
					this.waitingList.push(inputValue)
				})
			},
			//0502新增_发送用户输入内容
			sendUserInput(inputValue) {
				//	0502新增设置不是重连状态
				this.reconnecting = false

				//新增发送前去设置
				this.addListBeforeSend(inputValue) //显示在页面上

				this.dealList(inputValue)
			},
			//			0502新增_如果重连上,判断waitingList是否为空,如果不为空,就直接再次去发送
			sendAfterReconnect() {
				var waitingList = this.waitingList
				var len = waitingList.length
				for(var i = 0; i < len; i++) {
					var needSendInput = this.waitingList.shift()
					this.sendUserInput(needSendInput)
				}
			},
			addList() {
				var that = this
				//如果被禁用，不让去发送
				if(this.isDisabled || this.reconnecting || this.expired) {
					return
				}

				var inputValue = this.inputValue
				if(!inputValue) {
					that.$message.warning('内容不能为空')
					return
				}
				//05.02新增_先去判断ws的状态
				this.judgeBeforeSending(inputValue)
			},
			//0502新增设置单卡和多卡--Maap机器人发消息到微信通道，转链服务优化
			setNews(item) {
				if(item.replyType == 'news') {
					var reply = convertToJson(item.reply)
					var content = convertToJson(reply.content) || {}
					var articles = content.news && content.news.articles && content.news.articles[0] || {}
					item.reply = articles
				} else {
					item.reply = convertToJson(item.reply) //0502修改，需要判断类型再去添加
				}
			},
			//0507新增_处理融合通道返回的数据
			dealParseMessage(result) {
				if(!result) {
					return
				}

				var replyCollection = result.replyCollection || []
				replyCollection.forEach((item) => {
					this.setNews(item)

					item.channelType = result.channelType || '1' //显示展示不用的样式，放到数组中去，每个都不同
				})
				//					0513修改， 不然会收不到信息/
				this.setList(1, replyCollection, result.parseMessageId)

				//设置底部快捷按钮
				if(result.buttons) {
					var buttons = result.buttons //底部的快捷按钮和固定按钮
					this.buttons = buttons
					this.storageButtons.setList()
				}
			},
			//获取数组中最大的id
			getMaxParseMessageId(result) {
				var list = this.list || []
				var maxParseMessageId = 0
				list.forEach((item) => {
					//说明是用户输入的
					if(item.type == 1) {
						if(maxParseMessageId < item.parseMessageId) {
							maxParseMessageId = item.parseMessageId //找到最大的值
						}
					}
				})
				return maxParseMessageId
			},
			//找到下一个id
			findParseMessageId(needParseMessageId) {
				var parseMessageList = this.parseMessageList
				var len = parseMessageList.length
				if(!len) {
					return
				}

				var index = -1
				for(let i = 0; i < len; i++) {
					var item = parseMessageList[i]
					if(item.parseMessageId == needParseMessageId) {
						index = i
						break
					}
				}
				if(index > -1) {
					//说明找到了，添加进去，如果没有不处理
					var result = this.parseMessageList.splice(index, 1) //去除这个
					this.dealParseMessage(result[0]) //这里添加到用户数组中去
					this.findParseMessageId(needParseMessageId + 1)
				}
				//				return index
			},
			//获取数组中
			dealBackMessage(res) {
				//0404新增没有的话就不去请求
				if(!res) {
					return
				}

				//新增判断如果为空，就不发送请求
				if((!res.buttons || !res.buttons.length) && (!res.replyCollection || !res.replyCollection.length)) {
					return
				}
				//0602修改-不用调融合通道
				this.dealParseMessage(res)
			},
			//处理回复消息
			dealList(inputValue) {
				//发送请求
				this.chatbotAi(inputValue).then((res) => {
					this.dealBackMessage(res)
				})
			},
			setList(type, content, parseMessageId) {
				this.setCards(content)
				var result = {
					type, //0是用户输入，1是接口返回
					//					content,
					replyCollection: content,
				}
				//0507新增设置id
				if(type == 1) {
					result.parseMessageId = parseMessageId
				}
				this.list.push(result)

				//0506修改，用户输入的需要看是否成功，所以再调用之前去判断是否成功
				if(type == 1) {
					this.storage.setList() //保存当前的数据
				}

				this.scrollBottom() //滑动到底部
			},
			setCards(content) {
				var that = this
				content.forEach((item) => {
					if(!item.replyType) {
						item.replyType = 'manyCards' //给一个默认值
					}

					if(item.replyType == 'singleCard') {
						var cards = []
						cards.push(item.reply.card)
						cards.forEach((item1) => {
							item1.media = item1.media || {} //10.20新增处理报错问题
							if(item1.media.mediaType == 'pic') {
								item1.media.thumbnailMediaUrl = item1.media.mediaUrl
							} else if(item1.media.mediaType == 'voice') {
								item1.media.thumbnailMediaUrl = require('../assets/audioIcon.png')
							}
						})
						item.reply.cards = cards
					} else if(item.replyType == 'manyCards') {
						var cards = item.reply.cards
						cards.forEach((item1) => {
							item1.media = item1.media || {} //10.20新增处理报错问题
							if(item1.media.mediaType == 'pic') {
								item1.media.thumbnailMediaUrl = item1.media.mediaUrl
							} else if(item1.media.mediaType == 'voice') {
								item1.media.thumbnailMediaUrl = require('../assets/audioIcon.png')
							}
						})
					}
				})
			},
			//设置自动滑到底部
			scrollBottom() {
				this.$nextTick(() => {
					//改成使用原生的方法
					var div = querySelector('#' + this.catRobotContent);
					div.scrollTop = div.scrollHeight
				})
			},
			openList() {
				this.storage.localList() //获取最新的list
				this.storageButtons.localList() //获取最新的buttons
				this.scrollBottom() //滑动到底部

				//				0507新增获取最大id值
				this.parseMessageIndex = this.getMaxParseMessageId()
			},
			closeList() {
				this.showRobot = false
			},
			notice(title) {
				this.$Notice.success({
					title: title,
					duration: 1.5,
				})
			},
			chooseSwitchChat(switchChat) {
				//如果相等不进行切换
				if(this.channelType == switchChat) {
					return
				}
				var result = {
					'1': '已切换为MaaP消息样式',
					'2': '已切换为微信消息样式',
				}
				this.$message.info(result[switchChat])
				this.channelType = switchChat
			},
			//打开转链的
			openConvertLink(item1) {
				var url = item1.reply.content
				if(url) {
					this.openUrl(url)
				}
			},
			// 点击按钮打开新页面
			openUrl(url) {
				window.open(url, "_blank");
			},
			transferLongText(obj) {
				this.coverObject.longText = obj.longText
			},
			buttonReply(button) {
				this.sendInputValue(button.description)
			},
			sendInputValue(content) {
				this.inputValue = content
				this.addList()
			},
			clearParseMessageIndex() {
				this.parseMessageList = []
				this.parseMessageIndex = 0
			},
			onKeyup(e) {
				//					0618修改——输入框内的换行就还是shift+回车.按回车就发送
				if(e.keyCode == 13) {
					if(!e.shiftKey) {
						var inputValue = this.inputValue
						inputValue = inputValue.substr(0, inputValue.length - 1) //去除最后的回车符
						this.inputValue = inputValue
						this.addList()
					}
				}
			},

			//0611修改请求
			chatbotAi(inputValue) {
				var page = this
				if(!this.botId) {
					return
				}

				var headers = this.webPage.setHeaders()

				return new Promise((resolve, reject) => {
					var url = page.acceptUrl.chatbotAi + '/' + this.botId
					var body = qs.stringify({
						inPut: inputValue,
						identity: page.identity,
						channelType: page.channelType,
						socketHost: page.socketHost, //0507新增设置这个参数
						...headers, //10.22新增传参，不设置header，防止移动端发送options请求
					})
//					var option = qs.stringify({
//						//设置ip地址
//						headers: headers,
//					})
					axios.post(url, body).then(res1 => {
						var res = res1.data
						//新增-如果没有，直接给提示信息
						if(!res) {
							page.$message.error('服务器未返回！');
							page.sendMessageFail()
						}
						//     			var res = response.data

						//0611新增发送失败前的判断
						if(!this.webPage.handleTokenInvalidation(res, inputValue)) {
							return
						}

						if(res.status == '1') {
							resolve(res.responseData)
						} else {
							reject('-res-', res)
							page.$message.error('服务器返回错误！');
							page.sendMessageFail()
						}
						page.setStorageList() //新增，请求完后再保存在本地
					}, response => {
						reject('-res-')
						page.$message.error('发送失败！');

						page.sendMessageFail()
						page.setStorageList() //新增，请求完后再保存在本地
					})
				})
			},
			//0628新增清空底部的悬浮按钮
			clearButtons() {
				this.buttons = [] //清空快捷按钮
				this.storageButtons.setList()
			},
			noSupportedPrompt() {
				this.noSupportedPromptButton = true

				if(this.noSupportedPromptButtonTimer) {
					clearTimeout(this.noSupportedPromptButtonTimer)
					this.noSupportedPromptButtonTimer = null
				}
				//延迟消失
				this.noSupportedPromptButtonTimer = setTimeout(() => {
					this.noSupportedPromptButton = false
				}, 1500)
			},
			//0825新增统一设置请求地址
			setAcceptUrl() {
				this.acceptUrl.wsuri = window._CONFIG['wsuri']
				this.acceptUrl.checkExpire = window._CONFIG['checkExpire']
				this.acceptUrl.getToken = window._CONFIG['getToken']
				this.acceptUrl.chatbotAi = window._CONFIG['chatbotAiH5']  //这个是H5需要校验token
			},
			getIdentity() {
				var that = this
				var catRobotIdentity = localStorage.getItem('catRobotIdentity') || ''
				this.identity = catRobotIdentity || getUUIDnew()
				if(!catRobotIdentity) {
					localStorage.setItem('catRobotIdentity', this.identity)
				}
			}
		},
		directives: {
			dbClick: {
				inserted(el, binding) {
					el.addEventListener('click', e => {
						if(!el.disabled) {
							el.disabled = true;
							let timer = setTimeout(() => {
								el.disabled = false;
							}, 1000)
						}
					})
				}
			}
		},
	}
</script>
<style lang='less' scoped>
	/*@rem: 1/40rem;*/
	@rem: 1px;
	@small: 117*@rem;
	@middle: 175*@rem;
	@big: 275*@rem;
	@default: #EBEEF5;
	.experience-robot {
		max-width: 750px;
		margin: 0 auto;

		/*去除默认样式*/
		pre {
			font-family: inherit;
			padding: 0;
			margin: 0;
			font-size: 15px;
			line-height: inherit;
			color: inherit;
			word-break: break-all;
			background-color: transparent;
			border: none;
			border-radius: 0;
			white-space: pre-wrap;
			/*css-3*/
			white-space: -moz-pre-wrap;
			/*Mozilla,since1999*/
			white-space: -pre-wrap;
			/*Opera4-6*/
			white-space: -o-pre-wrap;
			/*Opera7*/
			word-wrap: break-word;
			/*InternetExplorer5.5+*/
			/*处理32位电脑没有换行的问题*/
			display: table;
			table-layout: fixed;
		}
		.chat-box {
			background: rgba(255, 255, 255, 1);
			box-shadow: 2*@rem 2*@rem 8*@rem 0*@rem rgba(0, 0, 0, 0.15);
			//      border-radius: 4*@rem;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0*@rem 0*@rem 18*@rem 0*@rem rgba(0, 0, 0, 0.12);
			position: relative;
			overflow: hidden;
			width: 100%;
			height: 100%;
		}
		.chat-box-top {
			justify-content: flex-start;
			padding: 0 15*@rem;
			height: 52*@rem;
			line-height: 52*@rem;
			border-bottom: 1*@rem solid @default;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.85);
			/*新增顶部样式*/
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: #fff;
			z-index: 1;
		}
		.chat-box-top-name {
			max-width: 250*@rem;
			-webkit-line-clamp: 1;
		}
		.chat-input {
			resize: none;
				background: rgb(245, 245, 245);
				border-radius: 32px;

				/*max-width: 100%;*/
			    height: auto;
			    min-height: 32px;
			    vertical-align: bottom;
			    font-size: 14px;
			    flex-shrink: 1;
		}
		.chat-box-bottom {
			border-top: 1*@rem solid @default;
			height: 60px;
			width: 100%;
			position: absolute;
			bottom: 0;
			background: #fff;
			//border-radius: 0 0 24*@rem 24*@rem;
			z-index: 1;
			padding: 0 12*@rem;
		}
		.chat-content {
			padding: 0 24*@rem;
			overflow-y: auto;
			/*新增修改*/
			height: 100%;
			padding-top: 76*@rem;
			padding-bottom: 120*@rem;
			
			/*10.23新增设置背景图*/
			background-image: url(../assets/watermark.png);
            background-size: 141px 23px;
            background-repeat: no-repeat;
            background-attachment: absolute;
            background-position: right 17*@rem bottom 90*@rem;
		}
		.chat-detail {
			background: rgba(24, 144, 255, 1);
			border-radius: 4*@rem;
			font-size: 14px;
			color: rgba(255, 255, 255, 1);
			line-height: 20*@rem;
			padding: 8*@rem 16*@rem;
			/*padding: 3*@rem 16*@rem 5*@rem;*/
			margin-bottom: 12*@rem;
			display: inline-block;
			word-break: break-all;
			padding: 8*@rem 16*@rem !important;
			max-width: 240*@rem;
		}
		.chat-detail1 {
			background: #A9E97A;
			color: #000000;
		}
		.chat-content-right {
			display: flex;
			justify-content: flex-end;
		}
		.chat-content-answer {
			background: #f7f7f7;
			color: rgba(0, 0, 0, 0.85);
		}
		.chat-content-answer1 {
			background: rgba(255, 255, 255, 1);
			box-shadow: 0*@rem 1*@rem 2*@rem 0*@rem rgba(0, 0, 0, 0.1);
			color: rgba(0, 0, 0, 0.85);
		}
		.robot-open {
			width: 90*@rem;
			height: 90*@rem;
			background: rgba(255, 255, 255, 1);
			box-shadow: 4*@rem 4*@rem 16*@rem 0*@rem rgba(0, 0, 0, 0.1);
			border-radius: 50%;
			position: relative;
			margin-top: 12*@rem;
		}
		.robot-icon {
			width: 45*@rem;
			height: 45*@rem;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 20*@rem;
		}
		/*0402新增设置*/
		.empty-prompt {
			font-size: 18px;
			color: rgba(0, 0, 0, 0.45);
			line-height: 25*@rem;
			text-align: center;
			width: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		/*新增禁用和启用状态*/
		.disable-status {
			font-size: 16px;
			color: rgba(245, 34, 45, 1);
		}
		/*新增禁用的浮层*/
		.disable-prompt {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			text-align: center;
			background: rgba(255, 255, 255, 0.9);
			font-size: 18px;
			color: rgba(0, 0, 0, 0.45);
			line-height: 25*@rem;
		}
		.robot-icon1 {
			width: 18*@rem;
			height: 18*@rem;
		}
		.chatwith-icon-round {
			width: 36*@rem;
			height: 36*@rem;
			background: rgba(255, 255, 255, 1);
			border: 2*@rem solid rgba(0, 0, 0, 0.05);
			border-radius: 50%;
			margin-right: 10*@rem;
		}

		/*添加水印*/
		.watermark {
			position: absolute;
			right: 17*@rem;
			bottom: 90*@rem;
			z-index: 0;
			width: 141px;
			height: 23px;
		}
		/*0720新增不支持提示信息*/
		.prompt-no-supported {
			position: absolute;
			bottom: 85*@rem;
			z-index: 1;
			left: 50%;
			transform: translateX(-50%);
			width: 250*@rem;
			height: 36*@rem;
			opacity: 0.6;
			background: #3e3e3e;
			border-radius: 18*@rem;
			text-align: center;
			color: #ffffff;
			line-height: 36*@rem;
		}

		.send-btn {
				border:none;
				outline: none;
				height:32px;
				background:rgba(24,144,255,1);
				border-radius:16px;
				font-size:14px;
				color:rgba(255,255,255,1);
				line-height:32px;
				margin-left: 10px;

				flex-shrink: 0;
			}
	}
</style>