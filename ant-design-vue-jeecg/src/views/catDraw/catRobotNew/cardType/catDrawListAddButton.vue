<template>
	<div style="width: 100%;" ref="addbuttonref">
		<div v-for="(item, index) in buttons" :key="index">
			<div class="flex-center add-content" :class="[ addButtonType == 'menuButton' ? '' : 'add-fixed-button' ]">
				<div class="flex-center" style="width: 100%; justify-content: space-between;">
					<a-select
						v-model="item.type"
						style="width:120px"
						:class="[lineBreak ? 'line-break' : 'no-line-break' ]"
						@change="handleChange(...arguments, item, index)" 
						size="small">
						<a-select-option
							v-for="item in cityList"
							:key="item.value"
							:value="item.value"
						>{{item.label}}</a-select-option>
					</a-select>
					<template v-if="!lineBreak">
						<!--新增引用内容-->
						<div v-if="item.type == 'reply' " class="txt-limit-div" style="position: relative; padding-right: 10px; flex-grow: 1">
							<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalDescription' placeholder="按钮文案" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  size="small" :showQuote="pageParameters.showQuote" :showQuoteVarText="true"></roInputAboutQuoteOne>
						</div>
						<div v-else-if="item.type == 'url'" class="handle-text-blocking txt-limit-div" style="position: relative; flex-grow: 1">
							<a-select
								size="small"
								v-model="item.application"
							>
								<a-select-option value="webview">webview打开</a-select-option>
								<a-select-option value="browser">浏览器打开</a-select-option>
							</a-select>
						</div>
						<!--<div v-if="item.type == 'openApp' || item.type == 'sendAddress' || item.type == 'bringUp' || item.type == 'addressLocation' " class="txt-limit-div" style="position: relative; padding-right: 16px; flex-grow: 1">
							<Input v-model="item.description" @on-change="buttonInputOnChange($event, item)" :maxlength="10" placeholder="按钮文案" size="small" />
							<span class="txt-limit1" style="right: 21px;">{{item.description && item.description.length || 0}} / 10</span>
						</div>-->
						<div v-else class="handle-text-blocking txt-limit-div" style="position: relative; padding-right: 10px; flex-grow: 1">
							<a-input v-model="item.description" :id="'btnDescription' + index" @change="buttonInputOnChange(...arguments, item)" placeholder="按钮文案" size="small" />
							<!-- <span class="txt-limit1" style="right: 21px;">{{item.description && item.description.length || 0}} / 10</span> -->
						</div>
					</template>


					<!--<template v-if="item.type == 'url'">
						<div style="position: relative; margin-right: 8px; width: 30%; flex-shrink: 1; ">
							<Input v-model="item.description" :maxlength="10" class="button-txt" size="small" placeholder="按钮文案" />
						</div>
						<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalContent' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="链接需以http(s)://开头" class="button-content" style="margin-right: 16px; flex-shrink: 1;" :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
					</template>-->
					<!--打电话按钮-->
					<!--<template v-if="item.type == 'call'">
						<div style="position: relative; margin-right: 8px; ">
							<Input v-model="item.description" :maxlength="10" class="button-txt" size="small" placeholder="按钮文案" />
						</div>
						<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalCallPhone' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入电话号码" class="button-content" style="margin-right: 16px;" :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
					</template>-->
					<!--拍摄按钮-->
					<!--<template v-if="item.type == 'screen'">
						<div style="position: relative; margin-right: 8px;">
							<Input v-model="item.description" :maxlength="10" class="button-txt" size="small" placeholder="按钮文案" />
						</div>
						<Input v-model="item.targetContact" class="button-content" size="small" placeholder="目标联系人" style="margin-right: 16px;" />
					</template>-->

					<!--删除按钮-->
					<!-- <Icon @click="removeList(index)" class="cursor-pointer" type="trash-b" size="16" color="#515a6e"></Icon> -->
					<div v-if="item.type !== 'reply' && item.type !== 'url' " class="var" @click="addVar('btnDescription'+index)">
						<img class="var-img" src="@assets/img/var.png">
					</div>
					<a-icon @click="removeList(index)" class="cursor-pointer" type="delete" style="font-size:16px;color:#515a6e;padding: 0 10px;"/>
				</div>
				<!--换行展示-->
				<template v-if="lineBreak">
						<!--新增引用内容-->
						<div v-if="item.type == 'reply' " class="txt-limit-div line-break-one" :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
							<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalDescription' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  size="small" :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
						</div>
						<!--<div v-if="item.type == 'openApp' || item.type == 'sendAddress' || item.type == 'bringUp' || item.type == 'addressLocation' " class="txt-limit-div" style="position: relative; padding-right: 16px; flex-grow: 1">
							<Input v-model="item.description" @on-change="buttonInputOnChange($event, item)" :maxlength="10" placeholder="按钮文案" size="small" />
							<span class="txt-limit1" style="right: 21px;">{{item.description && item.description.length || 0}} / 10</span>
						</div>-->
						<div v-else class="handle-text-blocking txt-limit-div line-break-one" >
							<a-input v-model="item.description" @change="buttonInputOnChange(...arguments, item)" :maxLength="10" placeholder="按钮文案" size="small" />
							<!-- <span class="txt-limit1" style="right: 30px;">{{item.description && item.description.length || 0}} / 10</span> -->
						</div>
					</template>
				
				<!--新增把这里移动到下一行-->
				<template v-if="item.type == 'url'">
					<div class="txt-limit-div" style="width:100%;display: flex;margin-top: 6px;" :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<a-input v-model="item.description" :id="'btnDescription' + index" @change="buttonInputOnChange(...arguments, item)" placeholder="按钮文案" size="small" />
						<div class="var" style="margin-left: 10px;padding-right: 2px;" @click="addVar('btnDescription'+index)">
							<img class="var-img" src="@assets/img/var.png">
						</div>
					</div>
					<div class="txt-limit-div" style="width:100%"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalContent' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入链接"   :showQuote="pageParameters.showQuote" :showQuoteVarUrl="true"></roInputAboutQuoteOne>
					</div>
				</template>
				
				<!--打电话按钮-->
					<template v-if="item.type == 'call'">
						<div class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
							<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalCallPhone' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入电话号码"  :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
						</div>
					</template>
					
					<!--拍摄按钮-->
					<template v-if="item.type == 'screen'">
						<a-input v-model="item.targetContact" class="line-break-one" placeholder="请输入目标联系人联系方式" size="small" />
						<!-- <Input v-model="item.targetContact" class="line-break-one" size="small" placeholder="目标联系人"   /> -->
					</template>
				
				<!--打开app-->
				<template v-if="item.type == 'openApp'">
					<!-- <Input v-model="item.openAppAndroid" class="line-break-one" placeholder="[Android]请输入正确调起地址"  size="small" />
					<Input v-model="item.openAppIos" class="line-break-one" placeholder="[ios]请输入正确调起地址"  size="small" /> -->
					<a-input v-model="item.openAppAndroid" class="line-break-one" placeholder="[Android]请输入正确调起地址" size="small" />
					<a-input v-model="item.openAppIos" class="line-break-one" placeholder="[ios]请输入正确调起地址" size="small" />
				</template>
				
				<!--调起指定联系人-->
				<template v-if="item.type == 'bringUp'">
					<!-- <Input v-model="item.targetContact" class="handle-text-blocking1 line-break-one" placeholder="目标联系人" :maxlength="600" size="small" /> -->
					<a-input v-model="item.targetContact" class="handle-text-blocking1 line-break-one" placeholder="请输入目标联系人联系方式" :maxlength="600" size="small" />
					<div  class="handle-text-blocking1 presend-content line-break-one" >
							<!--<Input v-model="item.presendContent" placeholder="预发送内容" :maxlength="600" style="padding-right: 27px; width: 100%;" size="small" />-->
							<!-- <Input v-model="item.presendContent" type="textarea"  :rows="1"  placeholder="预发送内容" :maxlength="600"  size="small" /> -->
							<a-textarea v-model="item.presendContent" placeholder="预发送内容" :maxlength="600" size="small" />
							<!-- <span class="txt-limit1" style="right: 31px;">{{item.presendContent && item.presendContent.length || 0}} / 600</span> -->
					</div>
					<!--<Input v-model="item.presendContent" placeholder="预发送内容" style="margin-top: 8px; padding-right: 27px; width: 100%;" size="small" />-->
				</template>
				
				<!--地址定位-->
				<template v-if="item.type == 'addressLocation'">
					<!--<Input v-model="item.sendAddressPlaceName" placeholder="地点名称" :maxlength="10" style="margin-top: 8px; padding-right: 27px; width: 100%;" size="small" />-->
					<div class="handle-text-blocking line-break-one">
							<!-- <Input v-model="item.sendAddressPlaceName" placeholder="地点名称" :maxlength="10"  size="small" /> -->
							<a-input v-model="item.sendAddressPlaceName" placeholder="地点名称" :maxlength="10" size="small" />
							<!-- <span class="txt-limit1" style="right: 31px;">{{item.sendAddressPlaceName && item.sendAddressPlaceName.length || 0}} / 10</span> -->
					</div>
					<!-- <Input v-model="item.sendAddressLongitude" class="line-break-one" placeholder="经度"  size="small" />
					<Input v-model="item.sendAddressLatitude" class="line-break-one" placeholder="纬度"  size="small" /> -->
					<a-input v-model="item.sendAddressLongitude" class="line-break-one" placeholder="经度" size="small" />
					<a-input v-model="item.sendAddressLatitude" class="line-break-one" placeholder="纬度" size="small" />
				</template>
			</div>
		</div>
		<!--判断上限之后，需要修改按钮状态-->
		<template v-if="addButtonType == 'menuButton'">
			<div v-if="!showMaxCardsTishi"  @click="clickAll" data-type="addList" class="flex-center cursor-pointer add-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]">
					<!-- <Icon type="ios-plus-empty" size="20" style="margin-right: 6px;"></Icon> -->
					<a-icon type="plus" style="margin-right: 6px;font-size:20px;"/>
					添加菜单按钮
				</div>
				<div v-else class="flex-center add-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]" style="color:#A9AAB1">
					<!-- <Icon type="ios-plus-empty" size="20" style="margin-right: 6px;"></Icon> -->
					<a-icon type="plus" style="margin-right: 6px;font-size:20px;"/>
					按钮数量已达上限
				</div>
		</template>
		<template v-else>
			<!--<div @click="clickAll" data-type="addList" class="flex-center add-button add-fixed-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]">
				<Icon type="ios-plus-empty" size="20" style="margin-right: 6px;"></Icon>
				添加快捷按钮
			</div>-->
			<div  v-if="!showMaxCardsTishi"  @click="clickAll" data-type="addList" class="flex-center add-button add-fixed-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]">
				<!-- <Icon type="ios-plus-empty" size="20" style="margin-right: 6px;"></Icon> -->
				<a-icon type="plus" style="margin-right: 6px;font-size:20px;"/>
				添加快捷按钮
			</div>
			<!--0514新增-->
			<div v-else class="flex-center add-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]" style="color:#A9AAB1">
					<!-- <Icon type="ios-plus-empty" size="20" style="margin-right: 6px;"></Icon> -->
					<a-icon type="plus" style="margin-right: 6px;font-size:20px;"/>
					快捷按钮和设置中的固定按钮总和不能超过10个
				</div>
		</template>
	</div>
</template>
<script>
	//ButtonReply对象
	import catDrawListData from './catDrawListData'
	
	// import roInputAboutQuoteOne from '../../roInputAboutQuoteOne/roInputAboutQuoteOne'  //新增带上引用和emoji输入的input输入框
	import roInputAboutQuoteOne from '@comp/taskFlow/roInputAboutQuoteOne/roInputAboutQuoteOne'
	export default {
		name: 'catDrawListAddButton', //图片，音频和视频
		props: {
			nodeList: Array, //数组
			otherNodeList: Array,
			nowNode: Object, //新增当前节点的数据，用于去除当前的节点
			
			addButtonType: {
				type: String,
				default: 'menuButton'
			}, //菜单按钮或快捷按钮fixedButton
			buttonStyle: {
				type: String,
				default: 'center'
			}, //底部按钮居中或居左显示left
			//按钮文案
			buttons: {
				type: Array,
				default: function() {
					return [
//						{
//							"type": "reply", //reply/url/openApp
//							"description": "",
//							"content": "",
//							openAppAndroid: "",
//							openAppIos: "",
//						}
					]
				},
			},
			buttonNums: Number, //固定按钮个数
			
			//新增页面传递过去的参数
			pageParameters: {
				type: Object,
				default: function() {
					return {}
				}, 
			},
		},
		components: {
			roInputAboutQuoteOne, //引用内容
		},
		data: function() {
			return {
				cityList: [
				{
						value: 'reply',
						label: '回复按钮'
					},
					{
						value: 'url',
						label: '打开URL按钮'
					},
					{
						value: 'openApp',
						label: '打开app按钮'
					},
					{
							value: 'call',
							label: '打电话按钮'
						},
						{
							value: 'sendAddress',
							label: '发送地址按钮'
						},
						{
							value: 'addressLocation',
							label: '地址定位按钮'
						},
						{
							value: 'screen',
							label: '拍摄按钮'
						},
						{
							value: 'bringUp',
							label: '调起指定联系人'
						},
				],
				showMaxCardsTishi: false, //是否显示最多的提示
				
				//是否需要换行显示
				lineBreak: false,
			}
		},
		watch:{
		  buttons: {
		      handler(newName, oldName) {
		      		if(this.addButtonType == 'menuButton') {
								var maxNumber = 4 //菜单按钮限制最多4个，buttonNums固定是0个
								if(newName && newName.length) {
								var len = newName.length
								if(len >= maxNumber) {
									this.showMaxCardsTishi = true
								} else {
									this.showMaxCardsTishi = false
								}
							}
						}	
						//0514修改
						var buttonsLen = newName.length
						if(this.addButtonType == 'fixedButton') {
							var maxNumber = 10 //固定按钮限制最多10个
							var buttonNums = Number(this.buttonNums) || 0 //已有的固定按钮个数
							if(buttonNums + buttonsLen >= maxNumber) {
								this.showMaxCardsTishi = true
							} else {
								this.showMaxCardsTishi = false
							}
						}
		      },
		      immediate: true,
		      deep: true
		  },
		},
		methods: {
			//清空数据
			handleChange(value, option, item, index) {
				item.type = value
				var obj = this.buttons[index]
				//不需要清空的key
				var noNeedClear = ['type']
				//重置默认值
				var ButtonReply = catDrawListData.ButtonReply
				var buttonReply = new ButtonReply()
				for(var key in buttonReply) {
					if(noNeedClear.indexOf(key) == -1) {
						obj[key] = buttonReply[key]
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
////			//限制按钮个数
//			limitButtonsNumber() {
//				var result = true
//				var buttonsLen = this.buttons.length
//				if(this.addButtonType == 'fixedButton') {
//					var maxNumber = 10 //固定按钮限制最多10个
//					var buttonNums = Number(this.buttonNums) || 0 //已有的固定按钮个数
//					if(buttonNums + buttonsLen > maxNumber) {
//						//不可以添加
//						result = false
//						this.$Message.warning(`消息的快捷按钮与固定按钮对总和不能超过${maxNumber}个。`);
//					}
//				} else if(this.addButtonType == 'menuButton') {
//					var maxNumber = 4 //菜单按钮限制最多4个，buttonNums固定是0个
//					if(buttonsLen > maxNumber) {
//						//不可以添加
//						result = false
//						this.$Message.warning(`菜单按钮不能超过${maxNumber}个。`);
//					}
//				}
//				return result
//			},
			addList() {
				var that = this
//				if(!this.limitButtonsNumber()) {
//					return
//				}

				var ButtonReply = catDrawListData.ButtonReply
				this.buttons.push(new ButtonReply())
			},
			removeList(index) {
				var that = this
				this.buttons.splice(index, 1)
			},
			//新增设置content值
			buttonInputOnChange(val, item) {
				if(item.type == 'reply') {
					item.content = item.description //reply的时候需要取设置相等的值
				}
			},
			addVar(index) {
				let addText
				addText = window.__VAR__.text.addText()
				if(addText) this.selectionStart(index, "{"+addText+"}")
			},
			selectionStart(index, quote) {
				var emojiInput = index //获取的id
				var elInput = document.getElementById(emojiInput); //根据id选择器选中对象
				var startPos = elInput.selectionStart; // input 第0个字符到选中的字符
				var endPos = elInput.selectionEnd; // 选中的字符到最后的字符
				if(startPos === undefined || endPos === undefined) return
				var txt = elInput.value;
				var result = txt.substring(0, startPos) + quote + txt.substring(endPos)
				elInput.value = result; // 赋值给input的value
				elInput.focus();
				elInput.selectionStart = startPos + quote.length;
				elInput.selectionEnd = startPos + quote.length;
				// this.eventList.inputContents[parseInt(index)].originalMessage = result // 赋值给表单中的的字段
				//新增需要手动触发onChange事件
				var event = new InputEvent('input');
				elInput.dispatchEvent(event)
			},
		},
		created() {
		},
		mounted() {
			let offsetWidth= this.$refs.addbuttonref.offsetWidth
			this.lineBreak = ((offsetWidth < 350) ? true : false)  //换行显示
		},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
		},
	}
</script>
<style lang='less' scoped>
	@import '../../asset/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	/*新增组件css*/
	/*新增文字长度提示限制*/
	
	.txt-limit-div {
		/deep/ .ivu-input {
			resize: none;
			/*padding-right: 43px;*/
		}
	}
	
	/*0508新增挡住文字的问题,如果有文字长度限制就加上这个*/
	.handle-text-blocking {
		/deep/ .ivu-input {
			padding-right: 43px !important;
		}
	}
	/*超过100的时候，需要增加*/
	.handle-text-blocking1 {
		/deep/ .ivu-input {
			padding-right: 55px !important;
		}
	}
	
	.presend-content {
		/deep/ .ivu-input {
			padding: 2px 7px;
	    height: 24px;
	    border-radius: 3px;
	    min-height: auto;
	    font-size: 12px;
	    resize: none;
	    /*用于不挡住显示的问题*/
	    /*padding-right: 55px;*/ 
		}
	}
	
	.txt-limit1 {
		position: absolute;
		top: 1px;
		right: 5px;
		background: #fff;
		height: 22px;
		line-height: 22px;
		color: #000;
		border-radius: 4px;
		opacity: 0.25;
	}
	/*单卡和多卡*/
	
	.add-button {
		height: 46px;
		background: rgba(0, 0, 0, 0.02);
		font-size: 12px;
		color: rgba(24, 144, 255, 1);
		line-height: 46px;
		margin: 0 auto;
		border-radius: 0 0 4px 4px;
		padding: 0 16px;
		cursor: pointer;
	}
	
	.add-content {
		height: inherit;
		padding: 16px;
		flex-direction: column;
		align-items: flex-start;
		border-bottom: 1px solid @defaultBorder;
		background: rgba(0, 0, 0, 0.02);
		font-size: 12px;
		/*color: rgba(24, 144, 255, 1);*/
		margin: 0 auto;
		border-radius: 4px 4px 0 0;
	}
	
	.add-fixed-button {
		background: #fff;
	}
	
	.add-fixed-left {
		justify-content: flex-start;
	}
	
	.add-content-icon {
		margin-right: 6px;
	}
	
	.add-fixed-button-max {
		color:#A9AAB1;
	}
	/*新增需要换行显示*/
	.line-break {
		margin-right: 15px; 
	}
	.no-line-break {
		width:120px; 
		margin-right: 15px; 
		flex-shrink: 0;
	}
	.line-break-one {
		margin-top: 6px; 
		// padding-right: 27px; 
		width: calc(100% - 27px);
		position: relative;
	}
	.line-break-one-new {
		padding-right: 0; 
		position: relative;
	}
	.var {
		display: inline-block;
		padding-right: 10px;
		.var-img {
			width: 24px;
			height: 24px;
		}
	}
	.var:hover {
		cursor: pointer;
	}
</style>