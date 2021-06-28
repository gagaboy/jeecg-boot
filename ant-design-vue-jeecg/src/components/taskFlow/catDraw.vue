<template>
	<div class="creat-material" v-bind:style="{height: clientSize.clientHeight,}">
		<catCardSurround>
			<template slot="catdrawTop">
				<div v-if="taskflowName" class="draw-flex-center creat-material-title">
					<div class="draw-flex-center creat-left" style="height: 100%;">
		        <!--<div @click="goReturn" class="draw-cursor-pointer" style="margin-right: 12px;margin-top: -10px;">
							<a-icon type="left" />
		        </div>-->
		        <div>
		          <!--<div v-if="chatbotName && taskflowName" class="creat-left-top">
		            {{chatbotName}}<span :class="[ catDrawstatus.chatbotStatus == 2 ? 'disable-status' : 'enable-status' ]">【{{catstatus(catDrawstatus.chatbotStatus)}}】</span>--{{taskflowName}}<span :class="[ catDrawstatus.taskflowStatus == 2 ? 'disable-status' : 'enable-status' ]">【{{catstatus(catDrawstatus.taskflowStatus)}}】</span>
		          </div>-->
		          <div v-if="taskflowName" class="creat-left-top">{{taskflowName}}<span :class="[ catDrawstatus.taskflowStatus == 2 ? 'disable-status' : 'enable-status' ]">【{{catstatus(catDrawstatus.taskflowStatus)}}】</span>
		          </div>

		          <div v-show="updateTime" class="creat-left-txt creat-left-bottom">
		            上次保存：{{updateTime}}
		          </div>
		        </div>
					</div>
					<div class="draw-flex-center creat-right">
						<div v-show="publishTime" class="creat-left-txt">
							上次发布：{{publishTime}}
						</div>
						<a-button v-dbClick @click="publishWorkFlowNode" icon="cloud-upload" type="primary" style="margin-left: 10px;">发布</a-button>

						<!-- <i-button v-dbClick @click="publishWorkFlowNode" class="creat-right-bottom" icon="upload" type="primary">发布</i-button> -->
					</div>
				</div>


    <a-drawer
			width="400"
			:bodyStyle="drawBodyStyle"
      placement="right"
      :closable="true"
      :visible="drawMenu"
			:maskClosable="false"
			@close="drawMenu=false"
			:destroyOnClose="true"
			wrapClassName="draw-drawer-content"
    >
			<component :is="currentView" @addEvent="addEvent" @save="save" @cancel="cancel" @sideBarEvent="sideBarEvent" :nowNode="nowNode" :nodeList="data.nodeList" :otherNodeList="otherNodeList" :workFlows="workFlows" :buttonNums="buttonNums" :acceptUrl="acceptUrl" :pageParameters="pageParameters" :showBackButton="showBackButton" @catBackButton="catBackButton" :groupList="groupList" :variableSlotList="variableSlotList" :messageConversionTemplates="messageConversionTemplates"></component>
    </a-drawer>
<!--
				<Drawer placement="left" :mask="false" :closable="true" v-model="drawMenu" width="400" :styles="styles" @on-visible-change="onDrawerVisibleChange">
					<component :is="currentView" @addEvent="addEvent" @save="save" @cancel="cancel" @sideBarEvent="sideBarEvent" :nowNode="nowNode" :nodeList="data.nodeList" :otherNodeList="otherNodeList" :workFlows="workFlows" :buttonNums="buttonNums" :acceptUrl="acceptUrl" :pageParameters="pageParameters" :showBackButton="showBackButton" @catBackButton="catBackButton" :groupList="groupList"></component>
				</Drawer> -->
			</template>

				<template slot="catdrawContainer">
					<div id="flowContainer"  v-bind:style="{ width: flowContainerStyle.width + 'px', height: flowContainerStyle.height + 'px', backgroundImage:`url(${backgroundPoint4})` }">
						<template v-for="node in data.nodeList">
								<flow-node v-show="node.show" :id="node.jsplumbNodeId" :node="node" @deleteNode="deleteNode" @nodeRightMenu="nodeRightMenu" @editNode="editNode" @addNode="addNode" @changeNodeSite="changeNodeSite">
							</flow-node>
						</template>
					</div>
				</template>
		</catCardSurround>

		<!--0609新增选择素材弹窗-->
		<catChoose ref="catChooseMedia" :id="catChooseId" :materialList="materialList"></catChoose>

		<!--弹窗提示不通过-->
		<a-modal  :maskClosable="false"   :visible="unavailable" :footer="null" @cancel="unavailable=false" :width="400" :height="300" >
			<div class="draw-flex-center" style="margin-top: 20px;margin-bottom: 20px;font-size: 14px;">
				画布中使用了不可用的素材，请进行修改。
			</div>
			<div class="draw-pop-footer">
					<a-button type="primary" @click="unavailable=false">确定</a-button>
				</div>
  </a-modal>

  		<catRobot v-if="botId" :botId="botId" ></catRobot>

  		<variableModalCreate :visible="visibleCreate" :botId="botId" @cancel="visibleCreate = false" @reload="addVariableSlotList" />
	</div>
</template>
<script>
	import flowNode from './node' //节点信息

	//菜单节点
	import catDrawMenuSideBar from './menu/catDrawMenuSideBar'
	import catDrawMenuAddNew from './menu/catDrawMenuAddNew'
	import catDrawMenuAsk from './menu/catDrawMenuAsk'
	import catDrawMenuJudge from './menu/catDrawMenuJudge'
	import catDrawMenuSend from './menu/catDrawMenuSend'
	import catDrawMenuExchange from './menu/catDrawMenuExchange'
	import catDrawMenuTrigger from './menu/catDrawMenuTrigger'
	import catDrawMenuSendhttp from './menu/catDrawMenuSendhttp'
	import catDrawMenuJoinUserGroup from './menu/catDrawMenuJoinUserGroup'  //0721新增加入用户组节点
	import catDrawMenuRemoveUserGroup from './menu/catDrawMenuRemoveUserGroup'  //0721新增移除用户出用户组节点
	import catDrawMenuManageVariables from './menu/catDrawMenuManageVariables'  //0930新增变量管理节点
	import catCardSurround from './catCardSurround' //画布外层结构

	import catChoose from './catChoose/catChoose'  //选择素材的弹窗

	import catRobot from './catRobot/catRobot'  //0817新增引入调试机器人

	import variableModalCreate from './menuCommon/variableModalCreate' //10.12创建变量弹窗

	import { Draw } from './Draw' //绘制节点
	import abuotNode from './abuotNode.js' //节点对象
	import { AbuotApi } from './abuotApi.js' //接口请求
	import { getUUID, transformTime } from './assets/js/util.js'

	import { UploadQuote } from './abuotQuoteUpload.js' //0525新增刷新引用节点

	import { CatDrawAddLine } from './catDrawAddLine' //成环的判断

	import { SetBackButton } from './setBackButton' //0721设置返回按钮js

	var isTest = false

	import { AboutMaterial } from './catChoose/aboutMaterial.js' //选择素材的弹窗
	import { msgTemplateList } from '@/api/api' //10.10新增查询转换模板

	export default {
		name: 'cspDraw',
		components: {
			flowNode,
			catDrawMenuSideBar,
			catDrawMenuAddNew,
			catDrawMenuAsk,
			catDrawMenuJudge,
			catDrawMenuSend,
			catDrawMenuExchange,
			catDrawMenuTrigger,
			catDrawMenuSendhttp,
			catDrawMenuJoinUserGroup,
			catDrawMenuRemoveUserGroup,
			catDrawMenuManageVariables,

			catCardSurround,
			catChoose,
			catRobot,

			variableModalCreate,
		},
		props: {
			acceptUrl: {
				type: Object,
				default: function() {
					return {
//						'cancelBackUrl': '/coapps/TaskInfoManage?botId=100002', //放弃后返回地址
				    'getWorkFlowNode': '/chatbot/canvas/getWorkFlowNode',  //获取画布中所有节点信息
				    'editTrigger': '/chatbot/canvas/editTrigger',  //编辑触发器
				    'addAskNode': '/chatbot/canvas/addAskNode',  //新增询问节点
				    'editAskNode': '/chatbot/canvas/editAskNode', //编辑询问节点
				    'addEventNode': '/chatbot/canvas/addEventNode', //新增事件节点
				    'editEventNode': '/chatbot/canvas/editEventNode',  //编辑事件节点
				    'addJudgeNode': '/chatbot/canvas/addJudgeNode', //新增判断节点
				    'editJudgeNode': '/chatbot/canvas/editJudgeNode', //编辑判断节点
				    'addSwitchNode': '/chatbot/canvas/addSwitchNode', //新增任务切换节点
				    'editSwitchNode': '/chatbot/canvas/editSwitchNode',  //编辑任务切换节点
//				    'editPoint': '/chatbot/canvas/editPoint', //新增/编辑指向
						'editPoint': '/chatbot/canvas/addPoint', //新增/编辑指向
				    'delPoint': '/chatbot/canvas/delPoint',  //删除指向
				    'publishWorkFlowNode': '/chatbot/canvas/publishWorkFlowNode', //发布流程
				    'delNode': '/chatbot/canvas/delNode',  //删除节点
				    'getWorkFlow': '/chatbot/canvas/getWorkFlow',  //获取所有切换节点，用于切换任务
				    'getReferenceNodes': '/chatbot/canvas/getReferenceNodes',  //查询引用的节点
				    //	04.29修改,新增发送节点
						'addSendNode': '/chatbot/canvas/addSendNode', //新增添加发送节点
						'editSendNode': '/chatbot/canvas/editSendNode', //新增编辑发送节点

					//	10.10新增变量管理节点
						'addVariableNode': '/chatbot/canvas/addVariableNode', //新增变量管理节点
						'editVariableNode': '/chatbot/canvas/editVariableNode', //编辑变量管理节点

						uploadFiles: '/chatbot/canvas/uploadMedia', //上传的地址

						'queryMaterialsByType': '/material/listByMaterialType', //获取选择素材

						//0722新增加入用户组url
						addGroupNode: '/chatbot/canvas/addGroupNode', //添加用户组
						editGroupNode: '/chatbot/canvas/editGroupNode', //编辑用户组

						'needUpload': false, //是否需要上传
					}
				},
			},
			botId: {
				type: Number,
				default: '',
			}, //机器人id
			taskflowId: {
				type: String,
				default: '',
			}, //流程id
			templateId: {
				type: Number,
				default: '',
			}, //模板id
			id: {
				type: Number,
				default: '',
			}, //表的主键id
		},
		data: function() {
			return {
				switchTest: true,

				drawMenu: false, //是否展开侧边栏
				drawBodyStyle: {
					'padding': 0,
					'padding-bottom': "10px",
					'overflow-x':"hidden"
				},
				menuType: '', //显示侧边导航栏
				nowNode: {}, //当前的node的值
				currentView: '', //当前节点

				// jsPlumb 实例
				jsPlumb: null,
				easyFlowVisible: true,
				// 控制流程数据显示与隐藏
				flowInfoVisible: false,
				// 控制表单显示与隐藏
				nodeFormVisible: false,
				// 是否加载完毕
				loadEasyFlowFinish: false,
				// 数据
				data: {
					nodeList: [],
					lineList: [],
				},
				drawObj: null,

				inputContents: [], //输入的内容
				isEdit: false, //是否是编辑状态

				oldNodeId: '', //点击当时的节点

				workFlows: [], //所有切换节点列表数据
				chatbotName: '', //测试机器人名字
				taskflowName: '', //任务名字
				updateTime: '', //更新时间
				publishTime: '', //发布时间

				otherNodeList: [], //其他的节点数据，用于引用
				buttonNums: 0, //配置中已添加的按钮个数

				clientSize: {
					clientWidth: 0,
					clientHeight: 0,
				}, //设置宽高

				catDrawstatus: {
					chatbotStatus: 1, //1代表启用,2禁用
					taskflowStatus: 1, //1代表启用,2禁用
				},

				//0529新增宽高
				flowContainerStyle: {
					width: 5000,
					height: 5000,
				},

				//0608新增获取素材
				materialList: {
					picList: [],
					voiceList: [],
					videoList: [],
					fileList: [],
				},  //不能删
				//显示顶部的菜单栏
				catChooseShow: {
						showPic: true, //显示图片
						showVoice: true, //显示音频
						showVideo: true, //显示视频
					},
					catChooseId: getUUID(),

					pageParameters: {
						showQuote: true, //新增是否显示引用的内容
						needUpload: false, //是否需要上传
						showChooseMediaStyle: true, //0920新增素材是否可引用
					},

					showBackButton: false,  //显示返回按钮
					groupList: [], //0722新增用户组数组


					unavailable: false, //0812新增判断引用不可用素材

					 backgroundPoint4: "",//require('../assets/backgroundPoint4.jpg'), // 0814新增背景图

					 variableSlotList: [], //10.10新增变量列表
					 messageConversionTemplates: [], //10.10新增消息转换模板列表
					 visibleCreate: false,
			}
		},
		computed:{
		    catstatus:function () {
		       return function (type) {
		       	var result = '已启用'
		       	if(type == 2) {
		       		result = '已禁用'
		       	}
		       	return result
		       }
		    }
    },
		methods: {


			//初始化数据
			dealDataFirst() {
				this.data.nodeList.forEach((item) => {
					var menuType = item.nodeType
					var obj = new abuotNode[menuType]()
					for(let key in item) {
						obj[key] = item[key]
					}
				})
			},
			//			// 加载流程图
			dataReload(data) {
				this.easyFlowVisible = false
				this.data.nodeList = []
				this.data.lineList = []
				this.$nextTick(() => {
					//            data = lodash.cloneDeep(data)
					this.easyFlowVisible = true
					this.data = data
					//					//初始化数据
					this.dealDataFirst()

					this.$nextTick(() => {
						this.drawObj.jsPlumbInit(this.data)
					})
				})
			},
			//删除节点
			deleteNode(jsplumbNodeId) {
				var nodeObj = this.drawObj.findNode(jsplumbNodeId)
//				var nodeObj = this.drawObj.findNodeOld(jsplumbNodeId)
				//新建节点，编辑节点,先去请求，再去删除
					this.abuotApi.delNode(nodeObj).then(() => {
						//更新数据
						this.drawObj.deleteNode(jsplumbNodeId)

						//处理删除节点没有更新引用内容问题
						this.$nextTick(() => {
							//0729新增刷新机制，删除时也需要更新引用节点
	        			this.uploadQuote.uploadForEach(nodeObj)
						})
					})
			},
			//打开侧边导航栏
			nodeRightMenu(jsplumbNodeId) {
				this.setMenuType('sideBar', jsplumbNodeId, true)
			},
			//编辑节点
			editNode(jsplumbNodeId, sideBarEvent) {
				//0721新增清除数组
				if(!sideBarEvent) {
					this.setBackButton.clearMenuTypes()
				}

				this.nowNode = this.drawObj.findNode(jsplumbNodeId)
				this.setMenuType(this.nowNode.nodeType, jsplumbNodeId, true)
			},
			//添加节点
			addNode(jsplumbNodeId, sideBarEvent) {
				//0721新增清除数组
				if(!sideBarEvent) {
					this.setBackButton.clearMenuTypes()
				}

				this.oldNodeId = jsplumbNodeId //设置节点

				//连接新的线,处理数据，回调函数
				this.drawObj.addNodeSuccess = (newNode) => {
					//新增的时候，需要加上连线
					this.drawObj.addNodeLine(jsplumbNodeId, newNode.jsplumbNodeId) //添加到数组中去
				}

				this.setMenuType('addNew', jsplumbNodeId, true)
			},
			//更新位置数据
			changeNodeSite(obj) {
				var that = this
				//更新用户数据
				this.drawObj.changeNodeSite(obj).then((node) => {
					this.abuotApi.upData(node, 'changeNodeSite').then(() => {
							//更新数据
							that.drawObj.upData(node)
						})
				})
			},
			//0512新增方法
			repaintEverything() {
				this.$nextTick(() => {
						this.drawObj.jsPlumb.repaintEverything()
				})
			},
			//添加节点
			addEvent(obj) {
				//展开菜单,需要把上一个节点id传过去，便于拿到数值
				if(obj.name == 'defaultReply') {
					this.addDefaultReply(obj.name, obj.jsplumbNodeId)
				} else {
					this.setMenuType(obj.name, obj.jsplumbNodeId)
				}
			},
			//新增-默认回复，单独去设置
			addDefaultReply(menuType, jsplumbNodeId, ) {
				this.menuType = menuType
				if(!abuotNode[menuType]) {
						return
					}
					this.nowNode = new abuotNode[menuType]()
					//新增这里都带上taskflowId，方便引用的使用
					this.nowNode.taskflowId = this.taskflowId

					this.nowNode.initialNode = this.drawObj.findNode(jsplumbNodeId) //找到初始连线的node
					this.isEdit = false

					//新建节点，编辑节点
					this.abuotApi.addNode(this.nowNode).then(() => {
						//更新数据
						this.drawObj.addNode(this.nowNode)
						//成功之后再关闭
						this.drawMenu = false
						this.isEdit = false

						//设置滑动到右侧
						this.slideLeft(this.nowNode)
					})
			},
			//设置或新增节点
			setMenuType(menuType, jsplumbNodeId, isEdit) {
				this.drawMenu = true
				this.menuType = menuType
				this.currentView = 'catDrawMenu-' + menuType

				//0721新增设置侧边路由信息，需要保存之前的信息，方便倒退到上一个节点
				this.setBackButton.menuTypeRouter({
					menuType,
					jsplumbNodeId,
					isEdit
				})

				if(isEdit) {
					var node = this.drawObj.findNode(jsplumbNodeId)
					this.nowNode = JSON.parse(JSON.stringify(node))
					this.nowNode.initialNode = {}
					this.isEdit = true
				} else {
					if(!abuotNode[menuType]) {
						return
					}
					this.nowNode = new abuotNode[menuType]()
					//新增这里都带上taskflowId，方便引用的使用
					this.nowNode.taskflowId = this.taskflowId

					this.nowNode.initialNode = this.drawObj.findNode(jsplumbNodeId) //找到初始连线的node
					this.isEdit = false
				}
			},
			fineIndex(jsplumbNodeId) {
				var nodeList = this.data.nodeList
				nodeList.forEach((item, index) => {
					if(item.jsplumbNodeId == jsplumbNodeId) {
						return index
					}
				})
			},
			save(obj) {
				var that = this
				if(!this.isEdit) {
					//新建节点，编辑节点
						this.abuotApi.addNode(obj.eventObj).then(() => {
							//更新数据
							this.drawObj.addNode(obj.eventObj)
							//成功之后再关闭
							this.drawMenu = false
							this.isEdit = false

							//设置滑动到右侧
							this.slideLeft(obj.eventObj)
						})
				} else {
					this.abuotApi.upData(obj.eventObj).then(() => {
							//更新数据
							that.drawObj.upData(obj.eventObj)
							//成功之后再关闭
							that.drawMenu = false
							that.isEdit = false

							//0525新增刷新机制
	        			that.uploadQuote.uploadForEach(obj.eventObj)
					}).catch((err) => {})
				}
			},
			cancel() {
				this.drawMenu = false
				this.isEdit = false
			},

			sideBarEvent(obj) {
				var that = this
				var jsplumbNodeId = obj.jsplumbNodeId
				this.drawMenu = false
//				this[obj.clickType](jsplumbNodeId)
				this[obj.clickType](jsplumbNodeId, true)
			},
			//判断连线前。draw页面中需要使用
			judgeBeforeConnecting(fromId, toId) {
				var that = this
				return this.catDrawAddLine.judgeBeforeConnecting(fromId, toId)
			},
			//处理回调后的图标问题
			processingCallback() {
				//删除连线时的处理
				this.drawObj.deleteLineSuccess = (from, to) => {
					var oldNode = this.drawObj.findNode(from)
					var newNode = this.drawObj.findNode(to)

					//发送请求去删除
						this.abuotApi.delPoint(oldNode, newNode).then(() => {

						})

					this.drawObj.followedByNodes()

//						0511修改判断节点
						this.setTodoMenus(oldNode, true)
				}

				//连线后之后，需要处理菜单的显示
				this.drawObj.addNodeLineSuccess = (source, target, isFirst) => {
					//					isFirst是否是首次,不是首次才去连线
						if(!isFirst) {
							var sourceNode = this.drawObj.findNode(source)
							var targetNode = this.drawObj.findNode(target)
							//发送请求
							this.abuotApi.editPoint(sourceNode, targetNode)
						}

					var oldNode = this.drawObj.findNode(source)
					var newNode = this.drawObj.findNode(target)

					this.drawObj.followedByNodes()


					//	0511修改判断节点
					this.setTodoMenus(oldNode, false)
				}
			},
				//新增判断侧边的菜单
			setTodoMenus(oldNode, isJudge) {
				oldNode.todoMenus.addNode = isJudge //设置不显示添加按钮
			},
			dealTime(time) {
				var that = this
				return time ? time.split('.')[0] : ''
			},
			//0817修改返回时间
			setUpdateTime(data) {
				var updateTime = ''
				if(typeof data == 'string') {
					updateTime = this.dealTime(data)
				} else {
					updateTime = this.dealTime(data.outUpdateTime)
				}
				this.updateTime = updateTime
			},
			//初始化数据
			getWorkFlowNode() {
				var that = this
				return new Promise((resolve, reject) => {
					this.abuotApi.requestMy('get', 'getWorkFlowNode', {
						botId: this.botId,
						taskflowId: this.taskflowId,
					}).then((data) => {
						//新增设置状态
						this.catDrawstatus.chatbotStatus = data.chatbotStatus
						this.catDrawstatus.taskflowStatus = data.taskflowStatus

						this.chatbotName = data.chatbotName
						this.taskflowName = data.taskflowName
//						this.updateTime = this.dealTime(data.updateTime)
//						this.publishTime = this.dealTime(data.publishTime)
						this.updateTime = (data.updateTime)
						this.publishTime = (data.publishTime)

						this.buttonNums = data.buttonNums || 0 //配置中已添加的按钮个数

						//0722新增设置用户组
						this.groupList = data.groupList || []

						resolve(data)
					})
				})
			},
			//获取所有切换节点
			getWorkFlow() {
				var that = this
				return new Promise((resolve, reject) => {
					this.abuotApi.requestMy('get', 'getWorkFlow', {
						botId: this.botId,
						taskflowId: this.taskflowId,
					}).then((data) => {
						var result = []
						data.forEach((item) => {
							result.push({
								label: item.taskflowName,
								value: item.taskflowId
							})
						})
						this.workFlows = result
						resolve()
					})
				})
			},
			//发布流程
			publishWorkFlowNode() {
				var that = this
				return new Promise((resolve, reject) => {
					this.abuotApi.requestMy('post', 'publishWorkFlowNode', {
						botId: this.botId,
						taskflowId: this.taskflowId,
						chatbotTaskflowId: this.id,
					}).then((data) => {
						this.publishTime = (data.outUpdateTime)
						this.notice('发布成功')
						resolve()
					})
				})
			},
			notice(title) {
				this.$message.success({
					content: title,
					duration: 1.5,
				})
			},
			getReferenceNodes() {
				var that = this
				return new Promise((resolve, reject) => {
					var botId = this.botId
					var url = this.acceptUrl.getReferenceNodes + '?botId=' + botId
					that.$http.get(url).then(response => {
						// var res = response.data
            var res = response
						if(res.code == '200') {
							var result = res.result || {}
							this.setAllNodeList(res.result)

							this.variableSlotList = result.variableSlotList || [] //10.10新增变量列表
							resolve()
						} else {
							this.$message.error('获取引用节点失败！');
						}
					}, response => {
						this.$message.error('获取引用节点失败！');
					})
				})
			},
			setAllNodeList(allList) {
				var result = {
//					taskFlowList: 'trigger', //触发器 04.27新增，只有当前的触发器，其他的不用显示
					askNodeList: 'ask', //对应的type关系
//					eventNodeList: 'send', //对应的type关系
					eventNodeList: 'sendhttp', //对应的type关系
					judgeNodeList: 'judge', //对应的type关系
//					switchNodeList: 'exchange', //修改_切换任务的不用展示出来

					variableSlotList: '$quoteVariableSlot', //10.12新增引用的变量列表
				}

//			//04.30新增_添加默认的值
			var nodeList = this.abuotApi.abuotQuote.defaultQuote([])
				for(var key in allList) {
					var listArr = allList[key] || []
					listArr.forEach((item) => {
						//设置日期
						if(item.createTime) {
							item.createTime = transformTime(Number(item.createTime)) //时间戳转时间,用户排序
						}

						item.nodeType = result[key]
						//这里如果不是上面就不添加了
						if(!item.nodeType) {
							return
						}

						item.show = true //设置成显示的，否则不会出现
						item.jsplumbNodeId = getUUID() //设置jsplumbNodeId
						if(!item.nodeId) {
							item.nodeId = null //这里不设置，会匹配不到
						}
						//新增去设置监听内容
						if(key == 'eventNodeList') {
							//这里如果是其他任务的，返回的是一个httpRequestContext，需要从这个里面去取
							if(item.httpRequestContext) {
								var httpRequestContext = JSON.parse(item.httpRequestContext) //转成对象
								item.monitorDataList = (httpRequestContext.monitorDataList) //设置成对象

								item.needMonitor = httpRequestContext.needMonitor
							}
						} else if(key == 'variableSlotList') {
							this.setOneItem(item)
						}
						nodeList.push(item)
					})
				}
				this.otherNodeList = nodeList //其他的节点数据
			},
			setFlowContainerStyleFirst() {
				var nodeList = this.abuotApi.firstData
				var maxTopNode = {}
				var maxTop = 0
				var maxLeftNode = {}
				var maxLeft = 0
				nodeList.forEach((item) => {
					if(maxTop < this.getNodePosition(item.top)) {
						maxTop = this.getNodePosition(item.top)
						maxTopNode = item
					} else if(maxTop == this.getNodePosition(item.top)) {
						if(maxTopNode.nodeType != 'judge' && item.nodeType == 'judge') {
							maxTopNode = item
						}
					}
					//宽度都是固定的
					if(maxLeft < this.getNodePosition(item.left)) {
						maxLeft = this.getNodePosition(item.left)
						maxLeftNode = item || {}
					}
				})

					var left = this.getNodePosition(maxLeftNode.left)
					//0529新增，flowContainer设置宽高
				if(left + 350 > this.flowContainerStyle.width) {
					this.flowContainerStyle.width = left + 350
				}
				//设置
				var top = this.getNodePosition(maxTopNode.top)
				var lastTop = top + 250
				//判断节点单独去处理。需要加上多个高度
				if(maxTopNode.nodeType == 'judge') {
					var judgeModuleLen = maxTopNode.judgeModuleList.length
					this.$nextTick(() => {
//						var div = document.getElementById(maxTopNode.jsplumbNodeId);
						setTimeout(() => {
							var div1 = document.getElementById(maxTopNode.jsplumbNodeId);
							if(!div1) {
								return
							}
							lastTop = top + div1.offsetHeight
							if(lastTop > this.flowContainerStyle.height) {
								this.flowContainerStyle.height = lastTop
							}
						}, 0)
					})
				} else {
					if(lastTop > this.flowContainerStyle.height) {
								this.flowContainerStyle.height = lastTop
							}
				}
			},
			getNodePosition(position) {
				if(!position) {
					return 0
				}
				return Number(position.slice(0, -2))
			},
			//0529设置flowContainerStyle样式
			setFlowContainerStyle(node) {
				var left = this.getNodePosition(node.left)
				var top = this.getNodePosition(node.top)

				//0529新增，flowContainer设置宽高
				if(left + 350 > this.flowContainerStyle.width) {
					this.flowContainerStyle.width = left + 350
				}

				var lastTop = top + 250
				//判断节点单独去处理。需要加上多个高度
				if(node.nodeType == 'judge') {
//					var judgeModuleLen = node.judgeModuleList.length
//					lastTop = top + (judgeModuleLen * 150)
					var judgeModuleLen = node.judgeModuleList.length
					this.$nextTick(() => {
//						var div = document.getElementById(maxTopNode.jsplumbNodeId);
						setTimeout(() => {
							var div1 = document.getElementById(node.jsplumbNodeId);
							if(!div1) {
								return
							}
							lastTop = top + div1.offsetHeight
							if(lastTop > this.flowContainerStyle.height) {
								this.flowContainerStyle.height = lastTop
							}
						}, 0)
					})
				} else {
					if(lastTop > this.flowContainerStyle.height) {
						this.flowContainerStyle.height = lastTop
					}
				}
			},
			//新增之后滑到页面右侧
			slideLeft(node) {
				var left = this.getNodePosition(node.left)

				//0529设置flowContainerStyle样式
				this.setFlowContainerStyle(node)

				this.$nextTick(() => {
					var test_div = document.getElementById("_canvasWrap");
					test_div.scrollLeft = left - 350
				})
			},
      goReturn() {
        this.setUrl(this.acceptUrl.cancelBackUrl)
      },
      //页面跳转（公共方法）
      setUrl(href) {
        var that = this
        var linkHref = this.$root.getLinkPath(href)
        this.$root.setUrl(linkHref)
        //页面跳转，取消之前的请求
        this.$root.axiosRequest.map((ax, index) => {
          ax.cancel()
        })
        this.$root.axiosRequest = []
      },
      //设置画布总的高度
      calculatedHeight() {
      		var that = this
				var clientHeight = document.documentElement.clientHeight
				var lastClientHeight = ((clientHeight - 100) > 500) ? (clientHeight - 100) : 500  //设置最小值500
				this.clientSize.clientHeight = lastClientHeight + 'px'
      },
			listenResize(){
           this.calculatedHeight()  //设置高度
      },
      //0608新增获取所有的素材列表
			getAllMaterial() {
				var p1 = this.aboutMaterial.getMaterials('pic')
				var p2 =	this.aboutMaterial.getMaterials('video')
				var p3 =	this.aboutMaterial.getMaterials('voice')
				var p4 =	this.aboutMaterial.getMaterials('file')
				return new Promise((resolve, reject) => {
					Promise.all([p1, p2, p3, p4]).then((result) => {
							resolve()
						}).catch((error) => {
					})
				})
			},
			getFirst() {
				var p1 = this.getWorkFlowNode()
				var p2 = this.getReferenceNodes()
				this.getMsgTemplateList() //10.10新增获取转换模板列表
				Promise.all([p1, p2]).then((result) => {
					var data = result[0]

//					//0618新增处理素材列表
//					this.aboutMaterial && this.aboutMaterial.getMaterialsDraw(data.materialList)

					this.abuotApi.getWorkFlowNode(data) //处理用户数据
					this.$nextTick(() => {
						this.drawObj.jsPlumbInit(this.data)

						//0529新增设置画布的宽高，找到最大高和最大宽的节点
						this.setFlowContainerStyleFirst()

						//0701新增素材审核不通过的提示弹窗
						this.aboutMaterial && this.aboutMaterial.judgePop()
					})
				}).catch((error) => {})
			},
			//设置是否显示上传接口
			setNeedUpload() {
				var needUpload = this.acceptUrl.needUpload || false
				this.pageParameters.needUpload = needUpload //设置是否需要上传
			},
			onDrawerVisibleChange(style) {
				//关闭时清空数组
				if(!style) {
					this.setBackButton.clearMenuTypes()
				}
			},
			//判断是否重置成上一个菜单
			catBackButton() {
				this.setBackButton.catBackButton()
			},
			//10.10新增设置消息转换模板列表
			async getMsgTemplateList() {
				var botId = this.botId
				if(!botId) {
					return
				}
	          const { result, success, message } = await msgTemplateList({
	            botId: botId,
	          })
	          if(success) {
	          	this.messageConversionTemplates = result //设置消息转换模板列表
	          } else {
	          	this.$message.error(message)
	          }
	  	},
	  	addVariableSlotList(oneItem) {
			this.setOneItem(oneItem)

			//这里去设置默认值
			this.$root.eventBus.$emit("menu_common_search_variable", {
					searchVariableIndex: this.searchVariableIndex,
					...oneItem,
			})

	  		this.variableSlotList.unshift(oneItem);  //添加到顶部

			this.otherNodeList.push(oneItem)
	  	},
	  	setOneItem(oneItem) {
	  		oneItem.nodeType = '$quoteVariableSlot' //引用的type
			oneItem.show = true
			oneItem.jsplumbNodeId = getUUID()
			oneItem.nodeName = oneItem.variableName //用于引用时的显示，也方便添加数组
	  	},
    },
		created() {
			this.calculatedHeight()  //设置高度

			this.setNeedUpload()
//			//测试打开http链接
//			if(isTest) {
//				this.drawMenu = true
//				this.menuType = 'manageVariables'
//				this.currentView = 'catDrawMenu-' + 'manageVariables'
//			}

			this.drawObj = new Draw(this)
			this.abuotApi = new AbuotApi(this) //注册接口
			this.catDrawAddLine = new CatDrawAddLine(this)  //成环的判断处理


		//0522新增引用节点刷新机制
		this.uploadQuote = new UploadQuote(this)

		//0721设置返回按钮
		this.setBackButton = new SetBackButton(this)

			this.processingCallback() //回调函数，用于显示菜单

				//判断是否需要上传，如果是上传就请求接口，不上传就请求接口
				if(this.pageParameters.needUpload) {
					this.getFirst()
				} else {
					//0608新增获取所有的素材列表
					this.aboutMaterial = new AboutMaterial(this)
					this.getAllMaterial().then(() => {
						this.getFirst()
					})
			}
		},
		mounted() {
			window.addEventListener('resize',this.listenResize);
			 //0609新增弹窗
				this.$root.eventBus.$on("modal_material_modal", (obj) => {
					var mediaReply = obj.mediaReply
//					this.$root.eventBus.$emit("modal_visible_change_" + this.catChooseId)  //打开弹窗

					this.$refs.catChooseMedia.cspVisible = true  //0813新增打开弹窗

					this.$refs.catChooseMedia.setChooseStyle({
						mediaReply,
						catChooseShow: obj.catChooseShow || this.catChooseShow,
						modalId: obj.modalId,
					})
				})
				//10.12新增变量列表项
				this.$root.eventBus.$on("add_variable_slot_list", (obj) => {
					this.visibleCreate = true //创建变量弹窗
					this.searchVariableIndex = obj.searchVariableIndex
				})
		},
		beforeDestroy() {
        window.removeEventListener("resize",this.listenResize);
		},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug

			this.$root.eventBus.$off("modal_material_modal")
			this.$root.eventBus.$off("add_variable_slot_list")
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
	@import './assets/css/default.css';
	@default: #EBEEF5;
	.creat-material {
		width: 100%;
		margin: 0 auto;
	}

	.creat-material-title {
		width: 100%;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.85);
		padding: 10px 20px;
		background: #ffffff;
		border-bottom: 1px solid @default;
		justify-content: space-between;
	}

	.creat-left-top {
		color: rgba(0, 0, 0, 0.85);
	}

	.creat-left-txt {
		font-size: 12px;
		color: rgba(159, 154, 160, 1);
	}

	.creat-right {
		flex-direction: row;
	}

	.creat-left-bottom {
		margin-top: 4px;
	}

	.creat-right-bottom {
		width: 108px;
		height: 45px;
		background: rgba(71, 145, 251, 1);
		line-height: 45px;
		;
		border-radius: 4px;
		font-size: 16px;
		padding: 0;
		margin: 0;
		margin-left: 18px;
	}

	#flowContainer {
		 position: relative;
    user-select: none;
   overflow: auto;


		/deep/ .aLabel.jtk-hover,
		.jtk-source-hover,
		.jtk-target-hover {
			display: flex;
			cursor: pointer;
		}
		/deep/ .aLabel {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background: #fff;
			cursor: pointer;
			display: none;
		}
    /deep/ .jtk-endpoint {
      z-index: 2;
    }
	}

	.labelClass {
		background-color: white;
		padding: 5px;
		opacity: 0.7;
		border: 1px solid #346789;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	/*新增禁用和启用状态*/
	.disable-status {
		color:rgba(245,34,45,1);
	}
	.enable-status {
		color:rgba(24,144,255,1);
	}
</style>
