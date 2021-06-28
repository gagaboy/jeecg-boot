<template>
	<div class="csp-robot-preview" >
		<!-- 机器人预览图标 -->
		<div v-if="!showRobot" @click="clickAll" data-type="openList" class="robot-open"><img class="robot-icon" src="../assets/robot.png" /></div>
		<div v-show="showRobot" class="csp-robot-chat" :style="{height: (screenHeight + 'px')}">
			<div class="robot-chat-header">
				<div class="draw-flex-center">
					<div class="draw-text-two chat-box-top-name">调试机器人</div>
				</div>
				<div class="draw-flex-center">
					<div v-if="!acceptUrl.noNeedShare" class="handle-box" data-type="shareUrl" @click="clickAll"><a-icon class="handle-icon" type="share-alt" /></div>
					<div class="handle-box" data-type="refreshList" @click="clickAll"><a-icon class="handle-icon" type="reload" /></div>
					<div class="handle-box" data-type="closeList" @click="clickAll"><a-icon class="handle-icon" type="close" /></div>
				</div>
			</div>
			<!--内容显示-->
			<div :id="catRobotContent" class='robot-chat-content' >
				<template v-if="list && list.length">
					<div v-for="(item, index) in list" :key="index" :class="[ item.type ? '' : 'chat-content-right' ]">
						<template v-for="(item1, index) in item.replyCollection">
							<!--0502新增_失败提示-->
							<div v-if="item1.fail" class="draw-flex-center" style="margin-bottom: 12px; margin-right: 10px;">
<!--								<Icon type="android-alert" size="18" color="red"></Icon>-->
                <a-icon type="exclamation-circle" style="color: red; font-size: 18px;"/>
							</div>
							<!--0502新增_Maap机器人发消息到微信通道，转链服务优化-->
							<catRobotMaapToWecat  v-if="item1.replyType == 'news'" :maapToWecatObj="item1"></catRobotMaapToWecat>
							<!--0514新增微信的系统消息-->
							<catRobotMsgmenu  v-if="item1.replyType == 'msgmenu'" :msgmenu="item1.reply.msgmenu" @sendInputValue="sendInputValue"></catRobotMsgmenu>
							<template v-if="item1.replyType == 'text'" >
								<!--是否是转链消息-->
								<div v-if="!item1.convertLink" >
									<pre v-if="item1.channelType == '1'" class="chat-detail chat-content-question" :class=" { 'chat-content-answer': item.type }">{{item1.reply.content}}</pre>
									<pre v-if="item1.channelType == '2'" class="chat-detail chat-detail1" :class=" { 'chat-content-answer1': item.type }">{{item1.reply.content}}</pre>
								</div>
								<!--转链的需要添加点击-->
								<div v-else >
									<div v-if="item1.channelType == '1'" @click="openConvertLink(item1)" class="chat-detail chat-content-question draw-cursor-pointer" :class=" { 'chat-content-answer': item.type }">{{item1.reply.content}}</div>
									<div v-if="item1.channelType == '2'" @click="openConvertLink(item1)" class="chat-detail chat-detail1 draw-cursor-pointer" :class=" { 'chat-content-answer1': item.type }">{{item1.reply.content}}</div>
								</div>
							</template>
							<!--图片，音频，视频-->
							<catRobotMedia v-if="item1.replyType == 'image' || item1.replyType == 'voice' || item1.replyType == 'video' || item1.replyType == 'file'" :mediaObject="item1"></catRobotMedia>

							<!--	v1.2.1新增需求============单卡多卡-->
							<catRobotMoreCard v-if="item1.replyType == 'singleCard' || item1.replyType == 'manyCards'" @buttonReply="buttonReply" @transferLongText="transferLongText" :response="item1.reply.cards" :layout="item1.reply" :msgType="item1.replyType" @noSupportedPrompt="noSupportedPrompt"></catRobotMoreCard>
						</template>
					</div>
				</template>
				<!--首次进入为空时的显示-->
				<!--<div v-else class="empty-prompt">你可以在这测试一下你的机器人～</div>-->
				<div v-if="!list.length && !isDisabled && !reconnecting" class="empty-prompt">你可以在这测试一下你的机器人～</div>

				<!--新增机器人禁用时的提示信息-->
				<div v-if="isDisabled" class="draw-flex-center disable-prompt">
					<div>机器人<span class="disable-status">(已禁用)</span>，若要调试请先启用机器人</div>
				</div>

				<!--0502新增发送前ws断开重连时的提示-->
				<div v-if="reconnecting" class="draw-flex-center disable-prompt">
					<div>ws重连中...</div>
				</div>
			</div>

			<!--顶部蒙层-视频播放界面-->
			<catRobotCover :coverObject="coverObject"></catRobotCover>

			<div class="bottom-area">

				<!--0720不支持的提示信息-->
				<div v-if="noSupportedPromptButton" class="prompt-no-supported">该类按钮当前环境无法操作</div>

				<!--底部快捷按钮-->
				<catRobotButtons v-if="buttons && buttons.length" :buttons="buttons" @buttonReply="buttonReply" @clearButtons="clearButtons" :showPrompt="isDisabled || reconnecting" @noSupportedPrompt="noSupportedPrompt"></catRobotButtons>
				<!--信息输入及发送按钮-->
				<div class="robot-chat-bottom ">
					<textarea v-model="inputValue" @keyup="onKeyup" type="textarea"  :rows="1" placeholder="请输入测试消息..." class="send-input"  />
					<button class="draw-flex-center draw-cursor-pointer send-btn disabled-button" @click="clickAll" data-type="addList" :style="{'background': buttonStyle}">
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
		</div>

		<!--弹窗提示复制-->
    <a-modal  :maskClosable="false"   title="分享机器人" :visible="copyModalShow" :footer="null" @cancel="copyModalShow=false">
			<div class="csp-robot-copy">
				<a-input v-model="copyNumber" placeholder="分享链接"  />
				<button  @click="copyUrl" ref="copyButton" :data-clipboard-text="copyNumber" id="areateanewnode" class="draw-cursor-pointer copy-btn">复制链接</button>
			</div>
			<div>链接15天内有效，过期后无法继续体验。</div>
    </a-modal>

	</div>
</template>
<script>
	import {Storage} from './Storage.js'
	import {CatWebSocket} from './CatWebSocket.js'
	import catRobotMoreCard from '../catRobotCard/catRobotMoreCard'//单卡和多卡的组件
	import catRobotMedia from '../catRobotCard/catRobotMedia' //图片，音频，视频
	import catRobotCover from '../catRobotCard/catRobotCover' //蒙层
	import catRobotButtons from '../catRobotCard/catRobotButtons' //底部快捷按钮
	import catRobotMaapToWecat from '../catRobotCard/catRobotMaapToWecat' //Maap机器人发消息到微信通道，转链服务优化
	import catRobotMsgmenu from '../catRobotCard/catRobotMsgmenu' //0514新增微信的系统消息

	import Clipboard from 'clipboard';
	var isTest = false

	import { querySelector, convertToJson, getUUID, setMediaType } from '../assets/js/util.js'

	import Vue from 'vue'  //0819新增引入token
	import {ACCESS_TOKEN} from "@/store/mutation-types"

	export default {
		name: 'catRobot',
		components: {
			catRobotMoreCard,
			catRobotMedia,
			catRobotCover,
			catRobotButtons,
			catRobotMaapToWecat,
			catRobotMsgmenu,
		},
		props: {
			acceptUrl: {
				type: Object,
				default: function() {
					return {
//						'chatbotAi': 'http://10.0.200.42:8391/rest/chatbotAi/callXiaoYuan',  //0825新增index.html配置
//						'wsuri': 'ws://10.0.200.42:8391/rest/chatbotAi',  //0825新增index.html配置
						'resetSession': '/chatbot/canvas/resetSession',
						'addChatbotExperience':'/chatbot/experience/add', //获取分享链接的接口
						'noNeedShare': false, ////不需要分享机器人
					}
				},
			},
//			identity: {
//				type: String,
//				default: '', //会话终端唯一标识（当前测试用户的sessionId）
//			},
			botId: {
				type: Number,
				default: 0,
			},  //机器人id
			chatbotName: {
				type: String,
				default: '',
			}, //机器人名字
			chatbotStatus: {
				type: String,
				default: '1',
			},
		},
		data: function() {
			return {
				inputValue: '',
				list: [],
				showRobot: false, //是否显示
				websock: null, //websock服务
				socketHost: '',
				channelType: '1',  //默认maap通道，channelType 1-maap  2-微信
				buttons: [],  //底部的按钮
				channelTypeColor: {
					1: '#1890FF',
					2: '#A9E97A',
				},
				coverObject: {
					longText: '',  //设置长文本
				},

				screenHeight: document.body.clientHeight, //网页可见区域高

				isDisabled: false, //是否被禁用

				reconnecting: false, //0502新增发送前ws断开重连时的提示
				waitingList: [], //待发送列表

				//0507新增_发送返回后的list
				parseMessageList: [],
				parseMessageIndex: 0, //当前的id

				copyModalShow: false,
				copyNumber: '', //复制的链接地址
				noSupportedPromptButton: false, //0720不支持的提示信息
				noSupportedPromptButtonTimer: null, //设置定时器id

				catRobotContent: 'catRobotContent' + getUUID(), //091新增设置唯一的id值，因为页面中可能有多个
			}
		},
		created: function() {
			//设置进入后页面overflow:auto
			document.body.style.overflow = 'auto'

			this.setAcceptUrl()  //0825新增统一设置请求地址

			//////////////////0720新增获取token
			const token = Vue.ls.get(ACCESS_TOKEN);
			this.identity = token
			////////////////

			//新增是否禁用
			this.isDisabled = (this.chatbotStatus == 2) ? true : false

//			this.storage = new Storage(this)
			this.storage = new Storage(this, 'catRobotStorage', 'list')
			this.storageButtons = new Storage(this, 'catRobotStorageButtons', 'buttons')

			this.websock = new CatWebSocket(this.acceptUrl.wsuri)
			this.websock.webSocketOnmessage = (redata) =>{
				this.judegAddress(redata)
			}

//			if(isTest) {
//				this.openList()
//			}
		},
		computed: {
	    buttonStyle: function () {
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
			//获取信息
			this.messageDetail()

			const that = this
			that.screenHeight = this.setScreenHeight(document.body.clientHeight)
		  window.onresize = () => {
		    return (() => {
		       window.screenHeight = document.body.clientHeight
					that.screenHeight = this.setScreenHeight(window.screenHeight)
		    })()
		  }
		},
		watch: {
      screenHeight (val) {
      		if(!val || val <= 500) {
      			return
      		}
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if (!this.timer) {
          // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
          this.screenHeight = val
          this.timer = true
          let that = this
          setTimeout(function () {
            // 打印screenWidth变化的值
            that.timer = false
          }, 400)
        }
      },
       copyModalShow: {
	      handler(newName, oldName) {
				if(!newName) {
					this.cbDestroy()
				}
	      },
//	      immediate: true
	  },
    },
		destroyed() {
			this.websock.activeShutdown = true  //自动关闭，不去链接了
			this.websock.closeWebSocket()
    },
		methods: {
			copyUrl() {
				if(!this.cb) {
					this.cb = new Clipboard("#areateanewnode")
					var cb = this.cb
					cb.on('success', (e) =>{
						this.copyModalShow = false
						this.$message.success('链接已复制到剪切板');

					});
					cb.on('error', (e) =>{});
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
				}	else {
					this.dealBackMessage(convertToJson(redata)) //处理返回的数据
				}
			},
			chatbotAi(inputValue) {
				var that = this
				return new Promise((resolve, reject) => {
					var url = this.acceptUrl.chatbotAi + `/${this.botId}`
//					var url = this.acceptUrl.chatbotAi
					that.$http.post(url, {
						inPut: inputValue,
						identity: this.identity,
						channelType: this.channelType,
						socketHost: this.socketHost,  //0507新增设置这个参数
					}, {
					//设置ip地址
          headers: {
            socketHost: this.socketHost,
          },
       }).then(response => {
       			//新增-如果没有，直接给提示信息
       			if(!response) {
       				this.$message.error('服务器未返回！');
       				this.sendMessageFail()
       			}
//						var res = response.data
						var res = response
						if(res.status == '1') {
							resolve(res.responseData)
						} else {
							reject('-res-', res)
							this.$message.error('服务器返回错误！');
							this.sendMessageFail()
						}
						this.setStorageList()  //新增，请求完后再保存在本地
					}, response => {
						reject('-res-')
						this.$message.error('发送失败！');

						this.sendMessageFail()
						this.setStorageList()  //新增，请求完后再保存在本地
					})
				})
			},
//			//新增发送失败提示
			sendMessageFail() {
				var list = this.list
				var len = this.list.length
				var obj = this.list[len - 1]
				var replyCollection = obj.replyCollection
				replyCollection.forEach((item) => {
					item.fail = true  //设置提示错误信息
				})
				//这里去设置失败的提示信息
				this.list.splice(len - 1, 1, obj)
			},
			setStorageList() {
				this.storage.setList() //保存当前的数据
			},
			parseMessage(responseData) {
				var that = this
				//0507新增顺序
				this.parseMessageIndex += 1

//				channelType 1-maap  2-微信
				return new Promise((resolve, reject) => {
					var url = this.acceptUrl.parseMessage + `/${this.channelType}/${this.botId}`

					that.$http.post(url, {
						identity: this.identity,
						responseData,

						parseMessageId: this.parseMessageIndex,
					}).then(response => {
						//新增-如果没有，直接给提示信息
       			if(!response) {
       				this.$message.error('服务器未返回！');
       				this.sendMessageFail()
       			}
						var res = response.data
						if(res.status == '1') {
							resolve(res.responseData)
						} else {
							reject('-res-', res)
							this.$message.error('服务器返回错误！');
							this.sendMessageFail()
						}
						this.setStorageList()  //新增，请求完后再保存在本地
					}, response => {
						reject('-res-')
						this.$message.error('发送失败！');
						this.sendMessageFail()
						this.setStorageList()   //新增，请求完后再保存在本地
					})
				})
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
                "reply":{
                    "content":inputValue
                },
                "replyType":"text",
                channelType: this.channelType,  //必须设置才可以显示
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
				 }).catch(() => {
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
				this.addListBeforeSend(inputValue)  //显示在页面上

				this.dealList(inputValue)
			},
//			0502新增_如果重连上,判断waitingList是否为空,如果不为空,就直接再次去发送
			sendAfterReconnect() {
				var waitingList = this.waitingList
				var len = waitingList.length
				for (var i = 0; i < len; i++) {
				   var needSendInput = this.waitingList.shift()
				   this.sendUserInput(needSendInput)
				}
			},
			addList() {
				var that = this
				//如果被禁用，不让去发送
				if(this.isDisabled) {
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
					item.reply = convertToJson(item.reply)  //0502修改，需要判断类型再去添加
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
						var buttons = result.buttons  //底部的快捷按钮和固定按钮
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
					var result = this.parseMessageList.splice(index,1)  //去除这个
					this.dealParseMessage(result[0]) //这里添加到用户数组中去
					this.findParseMessageId(needParseMessageId+1)
				}
//				return index
			},
			//获取数组中
			dealBackMessage(res) {
				//0404新增没有的话就不去请求
				if(!res) {
//					//清空底部的按钮
//					this.buttons = []
//					this.storageButtons.setList()
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
						item.replyType = 'manyCards'   //给一个默认值
					}
					if(item.replyType == 'singleCard') {
						var cards = []
						cards.push(item.reply.card)
						cards.forEach((item1) => {
							item1.media = item1.media || {}

							if(item1.media.mediaType == 'pic') {
								item1.media.thumbnailMediaUrl = item1.media.mediaUrl
							} else if(item1.media.mediaType == 'voice') {
								item1.media.thumbnailMediaUrl = require('../assets/audioIcon.png')
							}
							// 10.20新增设置播放的类型(显示不同的图标),兼容csp数据
							item1.media.mediaType = setMediaType(item1.media.mediaContentType)
						})
						item.reply.cards = cards
					} else if (item.replyType == 'manyCards') {
						var cards = item.reply.cards
						cards.forEach((item1) => {
							item1.media = item1.media || {}

							if(item1.media.mediaType == 'pic') {
								item1.media.thumbnailMediaUrl = item1.media.mediaUrl
							} else if(item1.media.mediaType == 'voice') {
								item1.media.thumbnailMediaUrl = require('../assets/audioIcon.png')
							}
							// 10.20新增设置播放的类型(显示不同的图标),兼容csp数据
							item1.media.mediaType = setMediaType(item1.media.mediaContentType)
						})
					}
				})
			},
			//重置机器人
			refreshList() {
				var that = this
				return new Promise((resolve, reject) => {
					var url = this.acceptUrl.resetSession + `?botId=${this.botId}&identity=${this.identity}`
					that.$http.get(url).then(response => {
						if(!response) {
							this.$message.error('服务器未返回！');
						}
						var res = response  //不同接口的状态码可能不同
						if(res.code == '200') {
							this.list = [] //清空对话
							this.storage.setList()

							this.buttons = [] //清空快捷按钮
							this.storageButtons.setList()
//							this.notice('重置成功')
							this.$message.success('重置成功');

							resolve(res.responseData)
//							0508新增重置消息
							this.clearParseMessageIndex()
////							0514新增关闭ws
//							this.websock.closeWebSocket()
						} else {
							reject('-res-', res)
							this.$message.error('服务器返回错误！');
						}
					}, response => {
						reject('-res-')
						this.$message.error('重置失败！');
					})
				})
			},
			//设置自动滑到底部
			scrollBottom() {
				this.$nextTick(() => {
					//改成使用原生的方法
					var div = querySelector('#' + this.catRobotContent);
					div.scrollTop = div && div.scrollHeight
				})
			},
			openList() {
				this.showRobot = !this.showRobot

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
				this.$message.success({
					content: title,
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
				window.open(url,"_blank");
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
								//	0618修改——输入框内的换行就还是shift+回车.按回车就发送
					if(e.keyCode == 13){
						if(!e.shiftKey) {
							var inputValue = this.inputValue
							inputValue = inputValue.substr(0, inputValue.length - 1)
							this.inputValue = inputValue
							this.addList()
						}
         	}
			},
			shareUrl() {
				var that = this
				return new Promise((resolve, reject) => {
					var url = this.acceptUrl.addChatbotExperience
					this.$http.post(url, {
						botId: this.botId,
					}).then(response => {
						if(!response) {
							this.$message.error('服务器未返回！');
						}
						var res = response  //不同接口的状态码可能不同
						if(res.code == '200') {
							var result = res.result
							this.copyNumber = window.location.origin + '/chatbotH5' + result.experienceUrl
							this.copyModalShow = true
						} else {
							this.$message.error(res.message);
							reject('-res-', response)
						}
					}, response => {
						reject('-res-')
						this.$message.error('服务器返回错误！');
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
				this.acceptUrl.chatbotAi = window._CONFIG['chatbotAi']
				this.acceptUrl.wsuri = window._CONFIG['wsuri']
			},
			cbDestroy() {
				if(this.cb) {
					this.cb.destroy()
					this.cb = null
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
		destroyed() {
			this.cbDestroy()
		},
	}
</script>

<style lang='less' scoped>
@default: #EBEEF5;
.csp-robot-preview {
	display: flex;
	position: fixed;
	bottom:20px;
	right:20px;
	flex-direction: column;
	align-items: flex-end;
	z-index: 1000;
	line-height: normal;
	.robot-open {
		width: 64px;
		height: 64px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 4px 4px 16px 0px rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		.robot-icon {
			width: 32px;
			height: 32px;
		}
	}
	.csp-robot-chat {
		width: 375px;
		height: 450px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.15);
		width:528px;
		min-height:500px;
		background:rgba(255,255,255,1);
		box-shadow:0px 0px 18px 0px rgba(0,0,0,0.12);
		border-radius:10px;
		position: relative;
		overflow: hidden;
		.robot-chat-header {
			display: flex;
			justify-content: space-between;
			padding-left:24px;
			height: 52px;
			line-height: 52px;
			border-bottom: 1px solid @default;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.85);
			.chat-name {
				max-width: 225px;
				-webkit-line-clamp: 1;
			}
			.handle-box {
				margin-right: 8px ;
				display: flex;
				padding: 8px;
				border-radius: 100%;
				cursor: pointer;
				&:hover {
					background-color: #f1f1f1;
				}
				.handle-icon {
					font-size: 16px;
				}
			}
		}
		.robot-chat-bottom {
			border-top: 1px solid @default;
			padding:10px;
			width: 100%;
			position: absolute;
			bottom: 0;
			background: #fff;
			/*border-radius: 0 0 24px 24px;*/
			display: flex;
			align-items: flex-start;
			.send-input {
				flex: 1;
				height:32px;
				line-height: 20px;
				background:rgba(0,0,0,0.03);
				border-radius:18px;
				outline: none;
				padding: 4px 7px;
				resize:none;
				border: 1px solid #ccc;
				overflow: hidden;
			}
			.send-btn {
				border:none;
				outline: none;
				width:72px;
				height:32px;
				background:rgba(24,144,255,1);
				border-radius:18px;
				font-size:14px;
				color:rgba(255,255,255,1);
				line-height:32px;
				margin-left: 10px;
			}
		}

		.robot-chat-content::after {
			display: block;
			height: 60px;
			content: '';
			visibility: hidden;
		}
		.robot-chat-content {
			padding: 20px;
			overflow-y: auto;
			/*height: calc(100% - 20px);*/

			/*0819处理挡住问题*/
			/*height: calc(100% - 80px);
			padding-bottom: 100px;*/
			height: calc(100% - 105px);
    		padding-bottom: 0;

			.chat-detail {
				background: rgba(24, 144, 255, 1);
				border-radius: 4px;
				font-size: 14px;
				color: rgba(255, 255, 255, 1);
				line-height: 20px;
				padding: 8px 16px;
				/*padding: 3px 16px 5px;*/
				margin-bottom: 12px;
				display: inline-block;
				word-break: break-all;
				padding: 8px 16px !important;
				max-width: 240px;
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
				/*background: rgba(245, 243, 248, 1);*/
				background: #f7f7f7;
				color: rgba(0, 0, 0, 0.85);
			}
			.chat-content-answer1 {
				background:rgba(255,255,255,1);
				box-shadow:0px 1px 2px 0px rgba(0,0,0,0.1);
				color:rgba(0,0,0,0.85);;
			}

		}
	}

	.draw-flex-center {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

}
.csp-robot-copy {
	display: flex;
	margin-bottom: 5px;
	.url {
		flex: 1;
		/*border: 1px solid #ccc;*/
	}
	.copy-btn {
		border:none;
		color: #fff;
		background-color: #2d8cf0;
		border-color: #2d8cf0;
		width: 80px;
		padding: 5px 0 6px;
		font-size: 12px;
		border-radius: 4px;
		margin-left: 15px;
	}
}


/*去除默认样式*/
pre {
	/*display: block;*/
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

	white-space: pre-wrap; /*css-3*/
	white-space: -moz-pre-wrap; /*Mozilla,since1999*/
	white-space: -pre-wrap; /*Opera4-6*/
	white-space: -o-pre-wrap; /*Opera7*/
	word-wrap: break-word; /*InternetExplorer5.5+*/

	/*处理32位电脑没有换行的问题*/
	display: table;
	table-layout: fixed;
}








	/*20200309新增///////////////////////////*/

	.chat-detail-img {
		width: 164px;
		height: 95px;
	}

	.chat-detail-cover {
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(169, 170, 177, 0.25);
		width: 100%;
		height: 100%;
	}

	.chat-detail-play {
		width: 42px;
		height: 42px;
		background: rgba(255, 255, 255, 1);
		opacity: 0.25;
		border-radius: 50%;
	}
	.chat-detail-audio {
		width: 237px;
		height: 64px;
		background: rgba(247, 247, 247, 1);
		border-radius: 4px;
	}

	.chat-detail-audioplay {
		width: 32px;
		height: 32px;
		background: rgba(214, 214, 214, 1);
		border-radius: 50%;
	}

	.chat-detail-slider {
		width: 96px;
		height: 20px;
		margin: 0 8px;
		/deep/ .ivu-slider-wrap {
			margin: 8px 0;
			height: 2px;
		}
		/deep/ .ivu-slider-bar {
			background: #4B4B4B;
			height: 2px;
		}
		/deep/ .ivu-slider-button {
			background: #4B4B4B;
			border: none;
			width: 8px;
			height: 8px;
		}
		/deep/ .ivu-slider-button-wrap {
			top: -6px;
		}
	}
	/*新增样式*/
	.video-play {
		/deep/ .ivu-slider-bar {
			background: #fff;
			height: 2px;
		}
		/deep/ .ivu-slider-button {
			background: #fff;
			border: none;
			width: 8px;
			height: 8px;
		}
		/deep/ .ivu-slider-wrap {
			background: rgba(255, 255, 255, 0.25);
		}
	}

	.top-cover {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow: auto;
	}

	.top-cover-player {
		width: 100%;
		height: 250px;
	}

	.top-cover-surround {
		width: 100%;
		height: 100%;
	}

	.top-cover-bottom {
		height: 398px;
		overflow: auto;
	}

	.full-screen-img {
		width: 100%;
		height: 200px;
	}

	/*新增切换聊天类型*/
	.switch-chat-li {
	width:48px;
	height:24px;
	background:rgba(255,255,255,1);
	border-radius:4px 0px 0px 4px;
	border:1px solid #D9D9D9;

	text-align: center;
	font-size:12px;
	line-height:22px;
	color:rgba(0,0,0,0.65);
	cursor: pointer;
}

.switch-chat-mapp {
	border:1px solid #1890FF;

	color: #1890FF;
}
.switch-chat-mapp1 {
	border-right: none;
}
.switch-chat-wecat {
	border-radius:0px 4px 4px 0px;
	border:1px solid #A9E97A;
	color: #A9E97A;
}
.switch-chat-wecat1 {
	border-radius:0px 4px 4px 0px;
	border-left: none;
}

.chat-icon-refresh {
		margin-left: 16px;
		cursor: pointer;
	}

	/*0402新增设置*/
.empty-prompt {
	font-size:18px;
	color:rgba(0,0,0,0.45);
	line-height:25px;
	text-align: center;

	width: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}


		/*新增禁用和启用状态*/
	.disable-status {
		font-size:16px;
		color:rgba(245,34,45,1);
	}
	.enable-status {
		font-size:16px;
		color:rgba(24,144,255,1);
	}
	/*新增禁用的浮层*/
	.disable-prompt {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		text-align: center;
		background:rgba(255,255,255,0.9);
		font-size:18px;
		color:rgba(0,0,0,0.45);
		line-height:25px;
	}

	/*0720新增不支持提示信息*/
	.prompt-no-supported {
 		position: absolute;
 		bottom: 85px;
 		z-index: 1;
 		left: 50%;
 		transform: translateX(-50%);

 		width: 210px;
		height: 36px;
		opacity: 0.6;
		background: #3e3e3e;
		border-radius: 18px;

		font-size: 14px;
		text-align: center;
		color: #ffffff;
		line-height: 36px;
  }
</style>
