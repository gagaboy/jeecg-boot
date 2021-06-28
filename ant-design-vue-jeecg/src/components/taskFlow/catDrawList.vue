<template>
	<div :style="listStyle">
		<div class="default-onceReplyModeLabel">
			<div v-if="!hiddenModeLabel" class="draw-flex-center onceReplyModeLabel-radio">
				<a-radio-group v-model="eventList.onceReplyModeLabel" @change="setOnceReplyMode" >
					<a-radio v-for="(val,key,index) in replys" :key="index" :label="val" :value="val" style="font-size:12px">{{val}}</a-radio>
				</a-radio-group>
			</div>

			<!--新增顶部的添加按钮-->
			<catDrawListAddMenu v-if="selectOnlyOne"  @addMenu="addMenu" :selectOnlyOne="selectOnlyOne" :selectOnlyOneObj="eventList.inputContents && eventList.inputContents[0]" :hideMenus="hideMenus"></catDrawListAddMenu>

			<draggable
        :list="eventList.inputContents"
        :disabled="!enabled"
        class="list-group"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
        handle=".handle"
        :forceFallback="true"
        fallbackClass="fallbackClass"
      >
				<div v-for="(item, index) in eventList.inputContents" :key="index" class="instance">
					<!--新增修改-->
					<catDrawListTop :item="item">
						<template slot="quote">
							<!--0721新增拖动的图标-->
							<i v-if="eventList.inputContents && eventList.inputContents.length > 1" aria-label="图标: delete" tabindex="-1" class="handle draw-cursor-pointer anticon anticon-delete" style="margin-right: 15px;"><svg viewBox="64 64 896 896" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M939.7248 519.4752l-153.6-153.6a25.6 25.6 0 0 0-36.1984 36.1984l109.8752 109.8752H512V164.1472l109.8752 109.8752a25.4976 25.4976 0 0 0 36.2496 0 25.6 25.6 0 0 0 0-36.1984l-153.6-153.6a25.6 25.6 0 0 0-36.1984 0l-153.6 153.6a25.6 25.6 0 0 0 36.1984 36.1984L460.8 164.1472v347.8016H112.9984l109.8752-109.8752a25.6 25.6 0 0 0-36.1984-36.1984l-153.6 153.6a25.6 25.6 0 0 0 0 36.1984l153.6 153.6a25.4976 25.4976 0 0 0 36.2496 0 25.6 25.6 0 0 0 0-36.1984L113.0496 563.2h347.8016v347.8016l-109.8752-109.8752a25.6 25.6 0 0 0-36.1984 36.1984l153.6 153.6a25.4976 25.4976 0 0 0 36.2496 0l153.6-153.6a25.6 25.6 0 0 0-36.1984-36.1984l-109.8752 109.8752V563.2h347.8016l-109.8752 109.8752a25.6 25.6 0 0 0 36.2496 36.1984l153.6-153.6a25.6 25.6 0 0 0 0-36.1984z" p-id="7821"></path></svg></i>

							<!--新增emoji输入-->
							<roEmoji v-if="item.replyType == 'text'" @addCatEmoji="addCatEmoji" :currentIndex="index" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="eventList" style="margin-right: 15px;"></roEmoji>
							<!--默认回复中去掉引用内容-->
							<!--<catDrawPoptip v-if="item.replyType == 'text' && pageParameters.showQuote"  @drawQuote="drawQuote" :currentIndex="index" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="eventList" style="margin-right: 15px;"></catDrawPoptip>-->
							<catDrawPoptip v-if="updateReferences && item.replyType == 'text' && pageParameters.showQuote"  @drawQuote="drawQuote" :currentIndex="index" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="eventList" style="margin-right: 15px;"></catDrawPoptip>
							<a-icon  @click="removeList(index)" class="draw-cursor-pointer" type="delete"  ></a-icon>
						</template>
					</catDrawListTop>

					<div v-if="item.replyType == 'text'" class="instance-input">
						<!--这里不使用自带的限制长度-->
						<a-textarea v-model="item.originalMessage" @change="onChangeInput($event, index)" :id="'emojiInputList' + index" class="instance-top-input" :rows="5" show-word-limit type="textarea" placeholder="请输入文字" />
					</div>

					<!--图片，音频和视频上传-->
					<catDrawListMedia :item="item" v-if="item.replyType == 'image' || item.replyType == 'voice' || item.replyType == 'video' || item.replyType == 'file'" :acceptUrl="acceptUrl" :pageParameters="pageParameters"></catDrawListMedia>
					<!--新增单卡-->
					<cat-draw-list-simple-card  :reply="item.reply" :listStyle="listStyle"  v-if="item.replyType == 'singleCard'" :currentIndex="index" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="eventList" :pageParameters="pageParameters" :acceptUrl="acceptUrl" ></cat-draw-list-simple-card>
					<!--新增多卡-->
					<cat-draw-list-multiple-card :reply="item.reply"  v-if="item.replyType == 'manyCards'" :currentIndex="index" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="eventList" :pageParameters="pageParameters" :acceptUrl="acceptUrl" ></cat-draw-list-multiple-card>

					<!--10.10新增消息转换模板-->
					<div v-if="item.replyType == 'conversionTemplate'" style="position: relative">
						<a-select v-model="item.reply.conversionTemplateId" :transfer="true" placeholder="选择消息转化模板" @change="onChangeConversionTemplate($event, index)" style="width:100%; padding: 16px;" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
				          <a-select-option v-for="item in messageConversionTemplates" :value="item.id" :key="item.id">{{ item.title }}</a-select-option>
				        </a-select>
					</div>
				</div>
			</draggable>

			<!--新增底部添加按钮-->
			<catDrawListAddMenu v-if="!hiddenAddMenuBottom" @addMenu="addMenu" :showMaxMenus="showMaxMenus" :hideMenus="hideMenus"></catDrawListAddMenu>
		</div>
	</div>
</template>
<script>
	import catDrawPoptip from './catDrawPoptip'

	import catDrawListTop from './cardType/catDrawListTop'  //顶部菜单
	import catDrawListMedia from './cardType/catDrawListMedia'  //图片，音频和视频
	import catDrawListSimpleCard from './cardType/catDrawListSimpleCard'  //单卡
	import catDrawListMultipleCard from './cardType/catDrawListMultipleCard'  //多卡
	import catDrawListAddMenu from './cardType/catDrawListAddMenu'  //底部菜单

	//0720新增拖拽的组件
	import draggable from "vuedraggable";

	import roEmoji from './roEmoji/roEmoji'  //emoji输入框

	import catDrawListData from './cardType/catDrawListData.js' //添加节点对象

	import {emojiCharStringLen, emojiCharStringSubstr} from './assets/js/util'  //新增处理emoji表情等

	//初始化数据
	class Reply {
		constructor() {
			this.replyType = 'text'
			this.originalMessage = ''
		}
	}

	export default {
		name: 'catDrawList',
		props: {
			//0528修改上传的地址
			acceptUrl: {
				type: Object,
				default: function() {
					return {
						uploadFiles: '/apps/Canvas/uploadMedia', //上传的地址
					}
				},
			},
			//样式
			listStyle: {
				width: '350px'
			},
			//node节点数据
			eventList: {
				type: Object,
				default: function() {
					return {
						onceReplyModeLabel: '随机发送一条',
						onceReplyMode: 1,
						inputContents: [{
							"replyType": "text",
							originalMessage: '',
						}]
					}
				},
			},
			nodeList: Array, //新增nodeList，画布中的所有节点数组
			otherNodeList: Array,  //同个机器人下其他任务下的节点数组

			//页面传递过去的参数
			pageParameters: {
				type: Object,
				default: function() {
					return {
//						showQuote: true, //新增是否显示引用的内容
//						needUpload: false, //是否需要上传
					}
				},
			},
			//0515新增_是否隐藏顶部的发送默认方式
			hiddenModeLabel: {
				type: Boolean,
				default: false,  //默认值是false
			},
			//上传素材的个数上限
			drawListMaxNumber: {
				type: Number,
				default: 10,  //上限一般是10个
			},
			//0527新增_是否隐藏顶部的新增按钮
			hiddenAddMenuBottom: {
				type: Boolean,
				default: false,  //默认值是false
			},
			//0527新增是否值选择一个，默认是可以选择多个的
			selectOnlyOne: {
				type: Boolean,
				default: false,  //默认值是false
			},

			messageConversionTemplates: Array, // 10.10新增转换模板列表
			//10.13新增隐藏转换模板选项--需要隐藏的数组
			hideMenus: {
				type: Array,
				default: function() {
					return []
				},
			},
		},
		components: {
			catDrawPoptip,
			roEmoji,

			catDrawListTop,
			catDrawListMedia,
			catDrawListSimpleCard,
			catDrawListMultipleCard,
			catDrawListAddMenu,

			draggable,
		},
		data: function() {
			return {
				replys: {
					1: '随机发送一条',
					2: '发送所有',
				},
				maxlength: 600,

				showMaxMenus: false, //不显示上限

				enabled: true,
				dragging: false,

				updateReferences: false,  //0720新增处理，切换节点时引用未更新的bug
			}
		},
		computed:{
		  //改变备注的长度，长度大于14位就用...代替剩余内容
		  calculateStringActualLength(){
		      //text就是所传参数
		      return function (text) {
		      		var len = 0
		      		if(text) {
		      			len = emojiCharStringLen(text)
		      		}
		    			return len
		      }
		  }
		},
		watch:{
			//监听可添加的最多10个
		  eventList: {
		      handler(newName, oldName) {
		      			var maxNumber = this.drawListMaxNumber
							if(newName && newName.inputContents) {
								var inputContents = newName.inputContents || []
								var len = inputContents.length
								if(len >= maxNumber) {
									this.showMaxMenus = true  //显示上限按钮
								} else {
									this.showMaxMenus = false  //显示上限按钮
								}
							}
							//0720新增处理，切换节点时引用未更新的bug
							this.updateReferencesFun(newName, oldName)
		      },
		      immediate: true,
		      deep: true
		  },
		},
		methods: {
			//0720新增处理，切换节点时引用未更新的bug
			updateReferencesFun(newName, oldName) {
				var that = this
				var oldName = oldName || {}
				var newName = newName || {}
				if(newName.jsplumbNodeId != oldName.jsplumbNodeId) {
					this.updateReferences = false
					setTimeout(() => {
						this.updateReferences = true
					}, 0)
				} else {
					this.updateReferences = true
				}
			},
			setOnceReplyMode(e) {
			  var lable = e.target.value
				var replys = this.replys
				for(var key in replys) {
					if(replys[key] == lable) {
						this.eventList.onceReplyMode = Number(key)
					}
				}
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
			addList() {
				var that = this
				this.eventList.inputContents.push(new Reply())
			},
			removeList(index) {
				var that = this
				this.eventList.inputContents.splice(index, 1)
			},
			drawQuote(data) {
				this.selectionStart(data.currentIndex, data.nodeName) //添加到原来的input里面去
			},
			selectionStart(index, quote) {
				var emojiInput = 'emojiInputList' + index //获取的id
//				var elInput = document.getElementById(emojiInput).getElementsByClassName('ant-input')[0]; //根据id选择器选中对象
				var elInput = document.getElementById(emojiInput) //根据id选择器选中对象
				var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
				var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
				if(startPos === undefined || endPos === undefined) return
				var txt = elInput.value;
				//		      // 将表情添加到选中的光标位置
				var result = txt.substring(0, startPos) + quote + txt.substring(endPos)

//				限制长度
				result = emojiCharStringSubstr(result, 0, this.maxlength) //截取实际的长度

				elInput.value = result; // 赋值给input的value
				// 重新定义光标位置
				elInput.focus();
				elInput.selectionStart = startPos + quote.length;
				elInput.selectionEnd = startPos + quote.length;
				this.eventList.inputContents[index].originalMessage = result // 赋值给表单中的的字段

				//新增需要手动触发onChange事件
				var event = new InputEvent('input');
				elInput.dispatchEvent(event)
			},
			//添加菜单
			addMenu(obj) {
				var that = this
				var type = obj.addMenuType
				if(this.selectOnlyOne) {

					//0720新增，如果是相同的，不去置空数据
					var oldObj = this.eventList.inputContents[0] || {}
					if(type == oldObj.replyType) {
						return
					}

					this.eventList.inputContents.splice(0,1,new catDrawListData[type]())
				} else {
					//添加到数组里去
					this.eventList.inputContents.push(new catDrawListData[type]())
				}
			},
			//新增监听input改变值
			onChangeInput(event, index) {
				var value = event.target.value
				var result = emojiCharStringSubstr(value, 0, this.maxlength) //截取实际的长度

				//延时去设置,否则不能设置成功
				setTimeout(() => {
					this.eventList.inputContents[index].originalMessage = result // 赋值给表单中的的字段
		    }, 0)
			},
			//新增添加emoji表情
			addCatEmoji(data) {
				this.selectionStart(data.currentIndex, data.emoji) //添加到原来的input里面去
			},

			checkMove: function(e) {},
			//新增转换模板设置
			onChangeConversionTemplate(value, index) {
				var messageConversionTemplates = this.messageConversionTemplates || []
				var res = {}
				messageConversionTemplates.forEach((item) => {
					res[item.id] = item
				})
				var reply = this.eventList.inputContents[index].reply || {}
				reply.conversionTemplateName = res[value].title //设置转换模板名
				reply.conversionTemplateMsgType = res[value].msgType  //设置转换模板类型
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
	.default-onceReplyModeLabel {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.09);
		border-radius: 4px;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.onceReplyModeLabel-radio {
		padding-left: 12px;
		height: 46px;
		border-bottom: 1px solid @defaultBorder;
		justify-content: flex-start;

		font-size: 12px;
	}

	.instance {
		border-bottom: 1px solid @defaultBorder;

		background: #fff;
	}

	.instance-input {
		/deep/ .ant-input {
			border: none !important;
			height: 112px !important;
			padding: 12px 16px !important;
			/*设置不可拉伸*/
			resize: none;
		}
	}

	.instance-top {
		height: 36px;
		line-height: 36px;
		justify-content: space-between;
		background: #FAFAFA;
		padding: 0 16px;
	}

	/*0721新增vuedraggable设置拖拽*/
	.handle {
		cursor:move;
	}
	/*设置拖拽时样式*/
	.fallbackClass {
		.handle {
			color: #1890FF;
			font-size: 16px;
		}
	}

	.instance-top-input {
		font-size: 12px;
	}
</style>
