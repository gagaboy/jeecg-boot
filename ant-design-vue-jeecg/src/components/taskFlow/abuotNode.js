import { getUUID} from './assets/js/util.js'

//初始化节点
class Initialize {
	constructor() {
		this.nodeName = ''
		this.addEndpointAnchor = ['Left', 'Right']//显示端点左侧或右侧

		//设置端点的唯一值
		this.addEndpointUuids = {}
		this.addEndpointUuids.Left = getUUID()
		this.addEndpointUuids.Right = getUUID()
		//显示菜单
		this.todoMenus = {
			'deleteNode': true, //是否显示删除按钮
			'editNode': true, //是否显示编辑按钮
			'addNode': true, //是否显示添加按钮
		}

		//添加的可选项
		this.addNewMenus = {
			'ask': true, //是否显示提问
			'send': true, //是否显示发送
			'exchange': true, //是否显示切换动作
			'judge': true, //是否显示判断
			'defaultReply': true, //是否显示默认回复
			'sendhttp': true, //是否显示发送http节点
			'joinUserGroup': true, //是否显示添加用户组节点
			'removeUserGroup': true, //是否显示删除用户组
			'manageVariables': true, //是否显示变量管理
		}

		this.show = true  //是否显示
	}
}

//触发器
class trigger extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'trigger',
//	          nodeName: '', //用于引用
						//关键词触发
						inputContents: [], //数组
						//内容符合正则触发
						ruleExpr: '',

						addEndpointAnchor: ['Right'], //显示端点左侧或右侧
						todoMenus: {
							'deleteNode': false,
							'editNode': true,
							'addNode': true,
						}
				}

		this.left = '24px' //默认位置关系
		this.top = '25px' //默认位置关系

		//设置端点的唯一值
		this.addEndpointUuids = {}
		this.addEndpointUuids.Right = getUUID()

		for(var key in result) {
			this[key] = result[key]
		}


	}
}

//提问初始化数据
class ask extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'ask',

						nodeName: '',  //必填，25个字
						onceReplyModeLabel: '随机发送一条',
						onceReplyMode: 1,
						inputContents: [],
						askmodel: '不验证',
						askFailContent: [
							{
								originalMessage: '',
							}
						],  //非必填
						answerRuleExpr: '',  //正则的时候必填

						buttons: [],  //底部的快捷按钮
					}
		for(var key in result) {
			this[key] = result[key]
		}
	}
}

//发送初始化数据
class send extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'send',

						nodeName: '',
						onceReplyModeLabel: '随机发送一条',
						onceReplyMode: 1,
						inputContents: [],

						buttons: [],  //底部的快捷按钮
					}
		for(var key in result) {
			this[key] = result[key]
		}
	}
}

//切换
class exchange extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'exchange',
						nodeName: '',
						exchangeId: '',
						exchangeName: "",

						addEndpointAnchor: ['Left'], //显示端点左侧或右侧
						todoMenus: {
							'deleteNode': true,
							'editNode': true,
							'addNode': false,
						}
					}

			//设置端点的唯一值
		this.addEndpointUuids = {}
		this.addEndpointUuids.Left = getUUID()

		for(var key in result) {
			this[key] = result[key]
		}
	}
}

//新增发送http请求
class sendhttp extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'sendhttp',
						nodeName: '', //名字
						httpRequestMethod: 'get',  //http请求类型 get/post
						httpRequestUrl: '', //http请求地址
						httpRequestHeads: [
//							{
//								name: '',
//								value: '',
//								originalValue: '', //原来存替换前的值
//							}
						], //http请求头参数
						contentType: 'form-data', //显示的内容
						httpRequestContentType: 'form-data' , //0803设置默认值，后端取的这个值。如果默认是form-data，需设置httpRequestContentType
//						httpRequestContentType: 'text/plain' , //http请求contentType
//						httpRequestFormData: {}, //http请求数据（contentType为form-data）这里给后端的时候，需要去改值
						httpRequestFormData: [
//							{
//								name: '',
//								value: '',
//								originalValue: '', //原来存替换前的值
//							}
						], //给后端的时候，存成对象的形式
						httpRequestData: '', //http请求数据（contentType为其他，如json,text.xml）
						originalHttpRequestData: '', //http请求数据（contentType为其他，如json,text.xml）0804新增设置原始值
						needMonitor: false, //是否需要监听返回数据
						monitorDataList: [
//							{
//								monitorId: '', //保存之后会进行更新
//								monitorName: '',  //自定义名字
//								monitorExpr: '',  //后面的值
//							}
						], //监听取数据表达式

//						//<!--0918新增素材引用http的请求返回-->
//						needMediaResult: false,
						
						//10.13新增选择转换模板后是否需要送审
						needMediaAudit: true, //默认送审
						msgTemplate: {
							conversionTemplateId: undefined, //选择要转换的模板id
							conversionTemplateMsgType: '', //模板名字
						}
					}
		for(var key in result) {
			this[key] = result[key]
		}
	}
}

//04.27新增发送默认节点
class defaultReply extends send {
	constructor() {
		super()
			var result = {
	          nodeType: 'defaultReply',
						nodeName: '',  //默认回复多少条
						onceReplyModeLabel: '随机发送一条', //接口返回的时候，进行处理
						replyCollection: [],  //回复的内容

						addEndpointAnchor: ['Left'], //显示端点左侧或右侧
						todoMenus: {
							'deleteNode': true,
							'editNode': false,
							'addNode': false,
						}  //显示菜单的功能
					}

			//设置端点的唯一值
		this.addEndpointUuids = {}
		this.addEndpointUuids.Left = getUUID()

		for(var key in result) {
			this[key] = result[key]
		}
	}
}

//判断
class judgeOne  {
	constructor() {
			var result = {
	          nodeType: 'judge',  //这里方便去获取
						judgeName: '',  //名字
						isDefaultBranch: false, //是否是默认分支
						satisfy: '所有', //满足条件
						judgeProject: [
							{
								inputOne: [
									{
										originalMessage: '',
									}
								],
								equal: '等于',
								inputTwo: [
									{
										originalMessage: '',
									}
								],
							},
						],
						showJudgeModule: true,
					}
		for(var key in result) {
			this[key] = result[key]
		}
//		//这里设置一个节点数据
		this.jsplumbNodeId = getUUID()  //添加一个id

		this.todoMenus = {
//			'deleteNode': true, //是否显示删除按钮
//			'editNode': true, //是否显示编辑按钮
			'addNode': true, //是否显示添加按钮
		}
	}
}

//判断
class judge extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'judge',
						nodeName: '',  //名字
						satisfy: '所有', //满足条件
						judgeModuleList: [],
					}
		for(var key in result) {
			this[key] = result[key]
		}

		this.todoMenus.addNode = false
	}
}

//0721新增加入用户组
class joinUserGroup extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'joinUserGroup',
						nodeName: '',  //节点名
						groupId: '',  //用户组id
						groupName: "",  //用户组名
				}

		for(var key in result) {
			this[key] = result[key]
		}
	}
}

//0721新增移除用户出用户组
class removeUserGroup extends Initialize {
	constructor() {
		super()
			var result = {
	          nodeType: 'removeUserGroup',
						nodeName: '',  //节点名
						groupId: '',  //用户组id
						groupName: "",  //用户组名
				}

		for(var key in result) {
			this[key] = result[key]
		}
	}
}

//0930新增变量管理节点
class manageVariables extends Initialize {
	constructor() {
		super()
			var result = {
	          	nodeType: 'manageVariables',
				nodeName: '',  //节点名
				variableConfig: []
			}

		for(var key in result) {
			this[key] = result[key]
		}
	}
}
class manageVariablesOne  {
		constructor() {
			this.varSlot = undefined
			this.varSlotName = ''  //变量名字，用于卡片上展示，进去时需要修改
			this.varSlotValue = ''
			this.originalVarSlotValue = ''
		}
	}


export default{
	trigger, //触发器
	ask,  //提问动作
	send, //发送消息动作
	exchange, //任务切换动作
	judge,  //判断
	judgeOne,

	defaultReply, //04.27新增发送默认节点
	sendhttp, //新增发送http请求

	joinUserGroup, //0721新增加入用户组
	removeUserGroup, //0721新增移除用户出用户组

	manageVariables, //0930新增变量管理节点
	manageVariablesOne,
}
