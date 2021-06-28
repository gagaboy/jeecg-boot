<template>
	<a-popover v-model="visible" trigger="click" :transfer="true" overlayClassName="cat-draw-poppip" :autoAdjustOverflow="true" placement="bottomRight"  :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
		<a-icon v-if="showPoptip" class="draw-cursor-pointer " :class="[ size == 'small' ? 'instance-top-link-small' : 'instance-top-link' ]" type="link"></a-icon>
		<div class="instance-linkbox" slot="content">
			<!--<template v-if="!mediaQuoteType">-->
				<div v-if="answers.length">
					<span class="instance-linkbox-title">回答</span>
					<ul>
						<li v-for="(answer, ind) in answers" :key="ind" @click="addQuote" data-quotetype="answers" :data-ind="ind" class="draw-cursor-pointer">
							{{answer.nodeName}}
						</li>
					</ul>
				</div>

				<!--10.10去掉监听内容-->
				<!--<div v-if="monitors.length">
					<span class="instance-linkbox-title">监听内容</span>
					<ul>
						<li v-for="(item, ind) in monitors" :key="ind" @click="addQuote" data-quotetype="monitors" :data-ind="ind" class="draw-cursor-pointer">
							{{item.nodeName}}
						</li>
					</ul>
				</div>-->

				<!--返回的code-->
				<div v-if="nowNode.nodeType == 'judge' && respondsCodes && respondsCodes.length">
					<span class="instance-linkbox-title">http请求结果</span>
					<ul>
						<li v-for="(item, ind) in respondsCodes" :key="ind" @click="addQuote" data-quotetype="respondsCodes" :data-ind="ind" class="draw-cursor-pointer">
							{{item.nodeName}}
						</li>
					</ul>
				</div>

				<!--10.10新加一个变量分类，原来的变量改成系统变量-->
				<div v-if="quoteVariableSlots.length">
					<span class="instance-linkbox-title">变量</span>
					<ul>
						<li v-for="(variable, ind) in quoteVariableSlots" :key="ind" @click="addQuote" data-quotetype="quoteVariableSlots" :data-ind="ind" class="draw-cursor-pointer">
							{{variable.nodeName}}
						</li>
					</ul>
				</div>

				<!--系统变量-->
				<div v-if="variables.length">
					<span class="instance-linkbox-title">系统变量</span>
					<ul>
						<li v-for="(variable, ind) in variables" :key="ind" @click="addQuote" data-quotetype="variables" :data-ind="ind" class="draw-cursor-pointer">
							{{variable.nodeType == 'trigger' ? '触发当前任务的上行' : variable.nodeName}}
						</li>
					</ul>
				</div>

				<!--固定值-->
				<!--<div v-if="nowNode.nodeType == 'judge' && fixedValues && fixedValues.length">
					<span class="instance-linkbox-title">固定值</span>
					<ul>
						<li v-for="(fixedValue, ind) in fixedValues" :key="ind" @click="addQuote" data-quotetype="fixedValues" :data-ind="ind" class="draw-cursor-pointer">
							{{fixedValue.nodeName}}
						</li>
					</ul>
				</div>-->
			<!--</template>-->

			<!--0918新增引用http的请求返回-->
			<!--<template v-else>
				<div>
					<span class="instance-linkbox-title">http请求返回</span>
					<ul v-if="mediaResults && mediaResults.length">
						<li v-for="(item, ind) in mediaResults" :key="ind" @click="addQuote" data-quotetype="mediaResults" :data-ind="ind" class="draw-cursor-pointer">
							{{item.nodeName}}
						</li>
					</ul>
				</div>
			</template>-->

		</div>
	</a-popover>
</template>
<script>
	import { setPlaceholder } from './abuotQuote'

	import { transformTime, deepCloneCat } from './assets/js/util.js'

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
				default: 'default', //设置input时的small
			},
			// //0918新增素材引用类型
			// mediaQuoteType: {
			// 	type: String,
			// 	default: '', //默认是空，就是之前的类型。新增的是mediaResult
			// },
		},
		components: {},
		data: function() {
			return {
				showPoptip: true, //是否显示图标

				visible: false,
				variables: [],
				fixedValues: [], //固定值
				respondsCodes: [], //http的code
//				monitors: [], //监听内容
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

//				mediaResults: [], //0918新增http请求返回

				quoteVariableSlots: [], ////10.10新增变量引用值数组
			}
		},
		watch: {
//			nodeList: {
//				handler(newName, oldName) {
//					if(!newName) {
//						return
//					}
//					//0918新增素材引用类型
//					if(!this.mediaQuoteType) {
//						this.setConformList(newName)
//					} else {
//						this.setMediaResults(newName)
//					}
//					//					this.setConformList(newName)
//				},
//				immediate: true,
//				deep: true
//			},
			//10.12修改打开引用弹窗时，去设置引用数组
			visible: {
				handler(newName, oldName) {
					if(!newName) {
						return
					}
					this.setConformList(this.nodeList)
				},
				immediate: true,
				deep: true
			},
		},
		methods: {
//			setMediaResults(nodeList = []) {
//				var nowNode = this.nowNode || {}
//				var jsplumbNodeId = nowNode.jsplumbNodeId || ''
//				//这里是防止没有数组引起的报错
//				if(this.otherNodeList && this.otherNodeList.length) {
//					var nodeListNew = [...nodeList, ...this.otherNodeList]
//				} else {
//					var nodeListNew = nodeList
//				}
//
//				var mediaResults = []
//
//				nodeListNew.forEach((item) => {
//					//发送http请求
//					if(item.show && item.nodeType == 'sendhttp') {
//						if(!item.createTime) {
//							item.createTime = transformTime(657907200000)
//						}
//						//0918新增是否需要监听
//						if(item.jsplumbNodeId != jsplumbNodeId && item.needMediaResult) {
//							var newItem = deepCloneCat(item)
//							newItem.nodeType = 'mediaResult'
//							mediaResults.push(newItem)
//						}
//					}
//				})
//				//按创建时间排序，这里因为要进行排序，所以这样处理
//				mediaResults.sort(function(a, b) {
//					return a.createTime > b.createTime ? -1 : 1
//				})
//				this.mediaResults = mediaResults //添加到数组中去
//			},
			setConformList(nodeList = []) {
//				this.monitors = [] //这里新增一个默认值

				var nowNode = this.nowNode || {}
				var jsplumbNodeId = nowNode.jsplumbNodeId || ''
				//这里是防止没有数组引起的报错
				if(this.otherNodeList && this.otherNodeList.length) {
					var nodeListNew = [...nodeList, ...this.otherNodeList]
				} else {
					var nodeListNew = nodeList
				}

				//系统变量
				var variables = []
				var variablesType = ['trigger', '$now', '$userMobile']
				//0821测试提出去除
				//				if(nowNode.nodeType == 'judge') {
				//					variablesType = ['trigger', '$now', '$userMobile', '$channelWay']
				//				}

				//				//固定值--//0821测试提出去除
				//				var fixedValues = []
				//				var fixedValuesType = [ '$wechatChannelWay', '$maapChannelWay']

				//				var upwards = []
				var answers = [] //回答内容
				//				var judgments = []  //判断内容
				var respondsCodes = [] //发送http请求

				//10.10新增变量引用值数组
				var quoteVariableSlots = []

				nodeListNew.forEach((item) => {
					//系统变量
					if(item.show && variablesType.indexOf(item.nodeType) > -1) {
						//新增这里加上taskflowId，方便引用去设置值
						if(item.nodeType == 'trigger') {
							item.taskflowId = item.nodeId //判断节点的需要加上
						}
						variables.push(item)
					}

					//					//04.30新增——判断才有这个
					//					if(nowNode.nodeType == 'judge') {
					//						//固定值
					//						if(item.show && fixedValuesType.indexOf(item.nodeType) > -1) {
					//							fixedValues.push(item)
					//						}
					//					}

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

//							//新增_设置监听内容的替换--10.13去掉监听内容分类
//							this.setMonitors(item) //这里排除掉自己的监听内容
						}
					}

					////10.10新增变量引用值数组
					if(item.show && item.nodeType == '$quoteVariableSlot') {
						if(!item.createTime) {
							item.createTime = transformTime(657907200000)
						}
						quoteVariableSlots.push(item)
					}
				})

				//				this.upwards = upwards  //触发器的
				this.answers = answers
				//				this.judgments = judgments
				this.variables = variables //系统变量
				//				this.fixedValues = fixedValues  //固定值
				this.respondsCodes = respondsCodes //添加到数组中去

				this.quoteVariableSlots = quoteVariableSlots

				//按创建时间排序，这里因为要进行排序，所以这样处理
				this.answers.sort(function(a, b) {
					return a.createTime > b.createTime ? -1 : 1
				})
				//按创建时间排序
				this.respondsCodes.sort(function(a, b) {
					return a.createTime > b.createTime ? -1 : 1
				})
				//按创建时间排序
				this.quoteVariableSlots.sort(function(a, b) {
					return a.createTime > b.createTime ? -1 : 1
				})
			},
//			//新增设置监听内容
//			setMonitors(item) {
//				var monitorDataList = item.monitorDataList //这里肯定是有的，不然无法进行下一步
//				//这里需要打开对应的监听开关，才去匹配
//				if(!monitorDataList || !item.needMonitor) {
//					return
//				}
//				//注意这里会设置nodeName和nodeId
//				monitorDataList.forEach((monitorData) => {
//					//如果有才去添加，因为接口返回的会有monitorId
//					if(monitorData.monitorId) {
//						//这里替换成需要的值
//						this.monitors.push({
//							monitorName: monitorData.monitorName, //设置名字
//							monitorId: monitorData.monitorId, //设置名字
//
//							nodeName: monitorData.monitorName, //设置名字
//							nodeType: 'monitor', //这里设置之后，方便去添加
//							nodeId: monitorData.monitorId, //设置nodeId，方便后面去使用
//							taskflowId: item.taskflowId, //设置，方便引用的使用
//							show: true,
//						})
//					}
//				})
//			},
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
		mounted() {},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
		},
	}
</script>
<style lang='less' scoped>
	@import './assets/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	.instance {
		border-bottom: 1px solid @defaultBorder;
	}

	.instance-top-link {
		transform: rotate(0deg);
	}
	/*小输入框时的样式*/

	.instance-top-link-small {
		transform: rotate(0deg);
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