<template>
	<a-popover :visible="visible" overlayClassName="cat-draw-poppip" placement="bottomRight" overlayStyle="width:184px; padding:8px 12px;">
	<!-- <Poptip v-model="visible" :transfer="true" popper-class="cat-draw-poppip" placement="bottom-end" width="184" padding="8px 12px"> -->
		<!-- <Icon v-if="showPoptip" class="cursor-pointer " :class="[ size == 'small' ? 'instance-top-link-small' : 'instance-top-link' ]" type="link" size="16"></Icon> -->
		<!-- <i v-if="showPoptip" class="el-icon-link cursor-pointer " :class="[ size == 'small' ? 'instance-top-link-small' : 'instance-top-link' ]" style="size: 16px;"></i> -->
		<a-icon v-if="showPoptip" type="link" class="cursor-pointer" :class="[ size == 'small' ? 'instance-top-link-small' : 'instance-top-link' ]" style="size: 16px;"/>
		<div class="instance-linkbox" slot="content">
			<div v-if="answers.length">
				<span class="instance-linkbox-title">回答</span>
				<ul>
					<li v-for="(answer, ind) in answers" :key="ind" @click="addQuote" data-quotetype="answers" :data-ind="ind" class="cursor-pointer">
						{{answer.nodeName}}
					</li>
				</ul>
			</div>

			<!--监听内容-->
			<div v-if="monitors.length">
				<span class="instance-linkbox-title">监听内容</span>
				<ul>
					<li v-for="(item, ind) in monitors" :key="ind" @click="addQuote" data-quotetype="monitors" :data-ind="ind" class="cursor-pointer">
						{{item.nodeName}}
					</li>
				</ul>
			</div>

			<!--返回的code-->
			<div v-if="nowNode.nodeType == 'judge' && respondsCodes && respondsCodes.length">
				<span class="instance-linkbox-title">http请求结果</span>
				<ul>
					<li v-for="(item, ind) in respondsCodes" :key="ind" @click="addQuote" data-quotetype="respondsCodes" :data-ind="ind" class="cursor-pointer">
						{{item.nodeName}}
					</li>
				</ul>
			</div>
			<!--变量-->
			<div v-if="variables.length">
				<span class="instance-linkbox-title">变量</span>
				<ul>
					<li v-for="(variable, ind) in variables" :key="ind" @click="addQuote" data-quotetype="variables" :data-ind="ind" class="cursor-pointer">
						{{variable.nodeType == 'trigger' ? '触发当前任务的上行' : variable.nodeName}}
					</li>
				</ul>
			</div>
			<!--固定值-->
			<div v-if="nowNode.nodeType == 'judge' && fixedValues && fixedValues.length">
				<span class="instance-linkbox-title">固定值</span>
				<ul>
					<li v-for="(fixedValue, ind) in fixedValues" :key="ind" @click="addQuote" data-quotetype="fixedValues" :data-ind="ind" class="cursor-pointer">
						{{fixedValue.nodeName}}
					</li>
				</ul>
			</div>

		</div>
	<!-- </Poptip> -->
	</a-popover>
</template>
<script>
	import { setPlaceholder } from './abuotQuote'

	import { transformTime} from './util'

	export default {
		name: 'catDrawPoptip',
		props: {
			currentIndex: {
				type: Number,
				default: 0, //请求的地址
			},
			aboutObj: Object, //需要传递过来的值
			nodeList: Array, //数组
			otherNodeList: Array,
			nowNode: Object, //新增当前节点的数据，用于去除当前的节点

			size: {
   			type: String,
        default: 'default',  //设置input时的small
   		},
		},
		components: {},
		data: function() {
			return {
				showPoptip: true, //是否显示图标

				visible: false,
				variables: [],
				fixedValues: [], //固定值
				respondsCodes: [],  //http的code
				monitors: [], //监听内容
				upwards: [
					//				{
					//					nodeName: '触发任务的上行',
					//					jsplumbNodeId: 'nodeA',
					//				}
				],
				answers: [
					//				{
					//						nodeName: '我没有了解您的意思，请...',
					//						jsplumbNodeId: 'nodeA',
					//					},
				],
				judgments: [
					//				{
					//						nodeName: '我没有了解您的意思，请...',
					//						jsplumbNodeId: 'nodeA',
					//					},
				],
			}
		},
		watch: {
			nodeList: {
				handler(newName, oldName) {
					if(!newName) {
						return
					}
					this.setConformList(newName)
				},
				immediate: true,
				deep: true
			},
		},
		methods: {
			setConformList(nodeList = []) {
				this.monitors = []  //这里新增一个默认值

				var nowNode = this.nowNode || {}
				var jsplumbNodeId = nowNode.jsplumbNodeId || ''
				//这里是防止没有数组引起的报错
				if(this.otherNodeList && this.otherNodeList.length) {
					var nodeListNew = [...nodeList, ...this.otherNodeList]
				} else {
					var nodeListNew = nodeList
				}

				//变量
				var variables = []
				var variablesType = ['trigger', '$now']
				if(nowNode.nodeType == 'judge') {
					variablesType = ['trigger', '$now', '$channelWay']
				}
				
				//固定值
				var fixedValues = []
				var fixedValuesType = [ '$wechatChannelWay', '$maapChannelWay']

//				var upwards = []
				var answers = []  //回答内容
//				var judgments = []  //判断内容
				var respondsCodes = []  //发送http请求

				nodeListNew.forEach((item) => {
					//变量
					if(item.show && variablesType.indexOf(item.nodeType) > -1) {
						//新增这里加上taskflowId，方便引用去设置值
						if(item.nodeType == 'trigger') {
							item.taskflowId = item.nodeId  //判断节点的需要加上
						}
						variables.push(item)
					}

					//04.30新增——判断才有这个
					if(nowNode.nodeType == 'judge') {
						//固定值
						if(item.show && fixedValuesType.indexOf(item.nodeType) > -1) {
							fixedValues.push(item)
						}
					}

					if(item.show && item.nodeType == 'ask') {
						if(!item.createTime) {
							item.createTime = transformTime(657907200000)
						}
						//新增排除当前的id
						if(item.jsplumbNodeId != jsplumbNodeId) {
							answers.push(item)
						}
					}

					//发送http请求
					if(item.show && item.nodeType == 'sendhttp') {
						if(!item.createTime) {
							item.createTime = transformTime(657907200000)
						}
						//新增排除当前的id
						if(item.jsplumbNodeId != jsplumbNodeId) {
							respondsCodes.push(item)

							//新增_设置监听内容的替换
							this.setMonitors(item)  //这里排除掉自己的监听内容
						}
					}
				})
//				this.upwards = upwards  //触发器的
				this.answers = answers
//				this.judgments = judgments
				this.variables = variables  //变量
				this.fixedValues = fixedValues  //固定值
				this.respondsCodes = respondsCodes  //添加到数组中去

//				this.isEmpty()  //判断是否为空就不显示图标，因为加入了默认值，所以不会有空的情况出现

//				//按创建时间排序
//				this.upwards.sort(function(a,b){
//		        return a.createTime > b.createTime ? -1 : 1
//		    })
				//按创建时间排序，这里因为要进行排序，所以这样处理
				this.answers.sort(function(a,b){
		        return a.createTime > b.createTime ? -1 : 1
		    })
//				//按创建时间排序
//				this.judgments.sort(function(a,b){
//		        return a.createTime > b.createTime ? -1 : 1
//		   })
				//按创建时间排序
				this.respondsCodes.sort(function(a,b){
		        return a.createTime > b.createTime ? -1 : 1
		   })


//				//04.30新增_汇总所有的数据,添加到节点上去，这里会造成死循环
//				nowNode.poppipList = [...answers, ...judgments, ...variables, ...fixedValues, ...respondsCodes, ...this.monitors]
		},
		//新增设置监听内容
			setMonitors(item) {
//				var monitors = this.monitors  //这里因为每次添加都会触发这个，所以就不去添加了
//				var monitorsIdArr = []
//				monitors.forEach((item) => {
//					if(monitorsIdArr.indexOf(item.monitorId) == -1) {
//						monitorsIdArr.push(item.monitorId)
//					}
//				})
				var monitorDataList = item.monitorDataList  //这里肯定是有的，不然无法进行下一步
				//这里需要打开对应的监听开关，才去匹配
				if(!monitorDataList || !item.needMonitor) {
					return
				}
				//注意这里会设置nodeName和nodeId
				monitorDataList.forEach((monitorData) => {
					//如果有才去添加，因为接口返回的会有monitorId
					if(monitorData.monitorId) {
						//这里替换成需要的值
							this.monitors.push({
								monitorName: monitorData.monitorName,  //设置名字
								monitorId: monitorData.monitorId,  //设置名字

								nodeName: monitorData.monitorName,  //设置名字
								nodeType: 'monitor',  //这里设置之后，方便去添加
								nodeId: monitorData.monitorId,  //设置nodeId，方便后面去使用
								taskflowId: item.taskflowId,  //设置，方便引用的使用
								show: true,
							})
					}
				})
		},
			//判断是否为空就不显示图标
			isEmpty() {
//				if(!this.upwards.length && !this.answers.length && !this.judgments.length) {
//					this.showPoptip = false
//				} else {
//					this.showPoptip = true
//				}
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
			addQuote(e) {
				var that = this
				var dataset = e.currentTarget.dataset
				var ind = dataset.ind

				var quotetype = dataset.quotetype
				var ind = dataset.ind
				var quote = this[quotetype][ind] //点击的内容
				//设置内容
				var nodeName = setPlaceholder(quote)

				//关闭弹窗
				this.visible = false

				this.$emit('drawQuote', {
					jsplumbNodeId: quote.jsplumbNodeId,
					currentIndex: this.currentIndex,
					nodeName: nodeName,
					aboutObj: this.aboutObj,
				})
			},
		},

		created() {},
		mounted() {
			console.log('popopop')
		},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
		},
	}
</script>
<style lang='less' scoped>
	@import './asset/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	/*新增*/
	.form-tab-width {
		width: 150px;
		text-align: right;
		font-size: 14px;
		color: @default;
	}

	.form-tab-width-summary {
		font-size: 14px;
		color: @default;
	}

	.remove-button {
		width: 90px;
		height: 36px;
		line-height: 36px;
		border-radius: 4px;
		font-size: 14px;
		padding: 0;
		margin: 0;
		margin-right: 24px;
	}

	.information {
		font-size: 12px;
		color: @default;
		margin-left: 12px;
		margin-top: 12px;
	}

	.summary {
		flex-direction: column;
	}

	.summary-title {
		height: 22px;
		font-size: 16px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.85);
		line-height: 22px;
	}

	.summary-value {
		display: inline-block;
		width: 288px;
		font-size: 14px;
	}

	.chat-top {
		font-size: 14px;
		margin-top: 16px;
		margin-right: 24px;
		color: rgba(24, 144, 255, 1);
	}
	/*成功后的提示*/

	.success {
		flex-direction: column;
		justify-content: flex-start;
	}

	.success-txt {
		font-size: 24px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.85);
	}

	.success-txt1 {
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.85);
	}

	.success-button {
		width: 116px;
		height: 36px;
		background: rgba(24, 144, 255, 1);
		border-radius: 4px;
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
	}
	/*新增编辑页面*/

	.info-chatbot {
		display: flex;
	}

	.info-chatbot-title {
		font-size: 18px;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.85);
	}

	.chatbot-info-manage {
		/*width: 482px;*/
	}
	/*--------------*/

	.chatbot-info-txt {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.85);
		line-height: 17px;
		margin-top: 5px;
	}

	.default-reply {
		/*width: 480px;*/
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.09);
		border-radius: 4px;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.add-content {
		height: 46px;
		font-size: 14px;
		color: rgba(24, 144, 255, 1);
		line-height: 22px;
		justify-content: flex-start;
		padding: 0 16px;
		cursor: pointer;
	}

	.add-content-icon {
		margin-right: 6px;
	}

	.reply-radio {
		padding-left: 12px;
		height: 46px;
		border-bottom: 1px solid @defaultBorder;
		justify-content: flex-start;
	}

	.instance {
		border-bottom: 1px solid @defaultBorder;
	}

	.instance-input {
		/deep/ .ivu-input {
			border: none !important;
			height: 112px !important;
			padding: 12px 16px !important;
		}
	}

	.instance-top {
		height: 36px;
		line-height: 36px;
		justify-content: space-between;
		background: #FAFAFA;
		padding: 0 16px;
	}

	.instance-top-link {
		/*margin-right: 15px;*/
		transform: rotate(-45deg);
	}
	/*小输入框时的样式*/
	.instance-top-link-small {
		/*margin-right: 5px;*/
		transform: rotate(-45deg);
	}

	.instance-linkbox {
		font-size: 12px;
		line-height: 22px;
	}

	.instance-linkbox-title {
		color: rgba(174, 173, 177, 1);
		margin-top: 4px;
		display: inline-block;
	}

	.instance-linkbox-input {
		margin-bottom: 8px;
	}
</style>
