<template>
	<div style="width: 100%;" ref="addbuttonref">
		<div v-for="(item, index) in buttons" :key="index">
			<div class="draw-flex-center add-content" :class="[ addButtonType == 'menuButton' ? '' : 'add-fixed-button' ]">
				<div class="draw-flex-center" style="width: 100%; justify-content: space-between; position: relative;">
					<a-select v-model="item.type" @change="handleChange($event, index)" :transfer="true" :class="[lineBreak ? 'line-break' : 'no-line-break' ]" :dropdownClassName="dropdownClassName"  size="small" :dropdownMatchSelectWidth="false" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
						<a-select-option v-for="item in cityList" :value="item.value" :key="item.value" >{{ item.label }}</a-select-option>
					</a-select>

					<template v-if="!lineBreak">
						<a-select v-if="item.type == 'url'" v-model="item.application"  :transfer="true" :class="[lineBreak ? 'line-break' : 'no-line-break' ]" :dropdownClassName="dropdownClassName"  size="small" :dropdownMatchSelectWidth="false" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
							<a-select-option v-for="item in openUrlList" :value="item.value" :key="item.value" >{{ item.label }}</a-select-option>
						</a-select>
						
						<!--新增引用内容-->
						<div v-if="item.type == 'reply' " class="txt-limit-div" style="position: relative; padding-right: 16px; flex-grow: 1">
							<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalDescription' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  size="small" :showQuote="pageParameters.showQuote" placeholder="请输入按钮文案"></roInputAboutQuoteOne>
						</div>
						<div v-else class="handle-text-blocking txt-limit-div" style="position: relative; padding-right: 16px; flex-grow: 1">
							<a-input v-model="item.description" @change="buttonInputOnChange($event, item)" :maxLength="10" placeholder="请输入按钮文案" size="small" />
							<span class="txt-limit1" style="right: 21px;">{{item.description && item.description.length || 0}} / 10</span>
						</div>
					</template>

					<!--删除按钮-->
					<a-icon @click="removeList(index)" class="draw-cursor-pointer" type="delete" size="16" color="#515a6e" style="color: #515a6e; font-size: 14px;"></a-icon>
				</div>
				<!--换行展示-->
				<template v-if="lineBreak">
					<a-select v-if="item.type == 'url'" v-model="item.application" :transfer="true" class="line-break-one" :class="[lineBreak ? 'line-break' : 'no-line-break' ]" :dropdownClassName="dropdownClassName"  size="small" :dropdownMatchSelectWidth="false" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
							<a-select-option v-for="item in openUrlList" :value="item.value" :key="item.value" >{{ item.label }}</a-select-option>
						</a-select>
					
						<!--新增引用内容-->
						<div v-if="item.type == 'reply' " class="txt-limit-div line-break-one" :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
							<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalDescription' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  size="small" :showQuote="pageParameters.showQuote" placeholder="请输入按钮文案"></roInputAboutQuoteOne>
						</div>
						<div v-else class="handle-text-blocking txt-limit-div line-break-one" >
							<a-input v-model="item.description" @change="buttonInputOnChange($event, item)" :maxLength="10" placeholder="请输入按钮文案" size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.description && item.description.length || 0}} / 10</span>
						</div>
					</template>

				<!--新增把这里移动到下一行-->
				<template v-if="item.type == 'url'">
					<div class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalContent' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入链接，需以http(s)://开头"   :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
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
						<!--<div class="line-break-one">
							<a-input v-model="item.targetContact" class="line-break-one" size="small" placeholder="目标联系人"  />
						</div>-->
						<!--0821新增100长度限制-->
						<!--<div  class="handle-text-blocking1 presend-content line-break-one" >
							<a-input v-model="item.targetContact"   placeholder="请输入目标联系人" :maxLength="100"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.targetContact && item.targetContact.length || 0}} / 100</span>
						</div>-->
						<!--10.12新增加入引用-->
						<div v-if="!pageParameters.showQuote" class="handle-text-blocking1 presend-content line-break-one" >
							<a-input v-model="item.originalTargetContact"   placeholder="请输入目标联系人" :maxLength="100"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.originalTargetContact && item.originalTargetContact.length || 0}} / 100</span>
						</div>
						<div v-else class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
							<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalTargetContact' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入目标联系人"  :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
						</div>
					</template>

				<!--打开app-->
				<template v-if="item.type == 'openApp'" >
					<!--<div class="line-break-one">
						<a-input  v-model="item.openAppAndroid" placeholder="[Android]请输入正确调起地址"  size="small" />
					</div>-->
					<div class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalOpenAppAndroid' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="[Android]请输入正确调起地址"  :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
					</div>
				</template>

				<!--调起指定联系人-->
				<template v-if="item.type == 'bringUp'">
					<!--<div class="line-break-one">
						<a-input v-model="item.targetContact" class="handle-text-blocking1 " placeholder="目标联系人" :maxLength="600" size="small" />
					</div>-->
					<!--0821修改长度从600限制成100-->
					<!--<div  class="handle-text-blocking1 presend-content line-break-one" >
							<a-input v-model="item.targetContact"   placeholder="请输入目标联系人" :maxLength="100"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.targetContact && item.targetContact.length || 0}} / 100</span>
					</div>-->
					<!--10.12新增加入引用-->
					<div v-if="!pageParameters.showQuote" class="handle-text-blocking1 presend-content line-break-one" >
							<a-input v-model="item.originalTargetContact"   placeholder="请输入目标联系人" :maxLength="100"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.originalTargetContact && item.originalTargetContact.length || 0}} / 100</span>
					</div>
					<div v-else class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalTargetContact' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入目标联系人"  :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
					</div>
					<div  class="handle-text-blocking1 presend-content line-break-one" >
							<a-input v-model="item.presendContent" type="textarea"  :rows="1"  placeholder="请输入预发送内容" :maxLength="600"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.presendContent && item.presendContent.length || 0}} / 600</span>
					</div>
				</template>

				<!--地址定位-->
				<template v-if="item.type == 'addressLocation'">
					<!--<div class="handle-text-blocking line-break-one">
							<a-input v-model="item.sendAddressPlaceName" placeholder="请输入地点名称" :maxLength="10"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.sendAddressPlaceName && item.sendAddressPlaceName.length || 0}} / 10</span>
					</div>
					<div class="line-break-one">
						<a-input v-model="item.sendAddressLongitude" placeholder="请输入经度"  size="small" />
						<a-input v-model="item.sendAddressLatitude" style="margin-top: 6px;" placeholder="请输入纬度"  size="small" />
					</div>-->
					<!--10.12新增引用，统一字段-->
					<div v-if="!pageParameters.showQuote" class="handle-text-blocking line-break-one">
							<a-input v-model="item.originalSendAddressPlaceName" placeholder="请输入地点名称" :maxLength="10"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.originalSendAddressPlaceName && item.originalSendAddressPlaceName.length || 0}} / 10</span>
					</div>
					<div v-else class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalSendAddressPlaceName' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入地点名称"  :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
					</div>
					<div class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalSendAddressLongitude' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入经度"  :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
					</div>
					<div class="txt-limit-div line-break-one"  :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
						<roInputAboutQuoteOne :inputAboutQuoteOne="item"  quoteKey='originalSendAddressLatitude' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" size="small" placeholder="请输入纬度"  :showQuote="pageParameters.showQuote"></roInputAboutQuoteOne>
					</div>
				</template>

				<!--0721新增设置日历提醒-->
				<template v-if="item.type == 'calendar'">
          <a-range-picker
							class="line-break-one"
							:defaultValue="item.chooseTime[0] ? [moment(item.chooseTime[0]) || '', moment(item.chooseTime[1]) || ''] : []"
				      :show-time="{
				      		defaultValue: [moment(item.chooseTime[0], 'HH:mm'), moment(item.chooseTime[1], 'HH:mm')],
				      }"
				      @change="item.chooseTime = $event"
				      format="YYYY-MM-DD HH:mm"
				      :placeholder="['开始时间（必填）', '结束日期（必填）']"
				      size="small"
				      style="width: 100%;"
				    />

					<div  class="handle-text-blocking1 presend-content line-break-one" >
							<a-input v-model="item.title" type="textarea"  :rows="1"  placeholder="请输入标题" :maxLength="100"  size="small" />
							<span class="txt-limit1" style="right: 34px;">{{item.title && item.title.length || 0}} / 100</span>
					</div>
					<div  class="presend-content1 line-break-one"  >
							<a-input v-model="item.characterization" type="textarea" :rows="4"  placeholder="请输入说明" :maxLength="500"  size="small"/>
							<span class="txt-limit2" style="right: 34px;">{{item.characterization && item.characterization.length || 0}} / 500</span>
					</div>
				</template>

			</div>
		</div>
		<!--判断上限之后，需要修改按钮状态-->
		<template v-if="addButtonType == 'menuButton'">
			<div v-if="!showMaxCardsTishi"  @click="clickAll" data-type="addList" class="draw-flex-center draw-cursor-pointer add-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]">
					<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
					添加菜单按钮
				</div>
				<div v-else class="draw-flex-center add-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]" style="color:#A9AAB1">
					<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
					按钮数量已达上限
				</div>
		</template>
		<template v-else>
			<div  v-if="!showMaxCardsTishi"  @click="clickAll" data-type="addList" class="draw-flex-center add-button add-fixed-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]">
				<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
				添加快捷按钮
			</div>
			<!--0514新增-->
			<div v-else class="draw-flex-center add-button" :class="[{ 'add-fixed-left': (buttonStyle != 'center') },]" style="color:#A9AAB1">
					<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
					快捷按钮和设置中的固定按钮总和不能超过{{maxFixedButton}}个
				</div>
		</template>
	</div>
</template>
<script>
	//ButtonReply对象
	import catDrawListData from './catDrawListData'

	import roInputAboutQuoteOne from '../roInputAboutQuoteOne/roInputAboutQuoteOne'  //新增带上引用和emoji输入的input输入框

	import moment from 'moment';
	import 'moment/locale/zh-cn';  // 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale

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
			//请输入按钮文案
			buttons: {
				type: Array,
				default: function() {
					return []
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
			//0814新增className，用于设置font-size
			dropdownClassName: {
				type: String,
				default: ''
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
						label: '跳转按钮'
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
//						{
//							value: 'calendar',
//							label: '设置日历提醒'
//						},
				],
				showMaxCardsTishi: false, //是否显示最多的提示

				//是否需要换行显示
				lineBreak: false,
				
				maxFixedButton: 11,  //上限数
				
				//11.13新增打开url的方式
				openUrlList: [
					{
							value: 'webview',
							label: 'webview打开' //默认值
						},
						{
							value: 'browser',
							label: '浏览器打开'
						},
				],
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
							var maxNumber = this.maxFixedButton //固定按钮限制最多10个
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
			moment,
			//清空数据
			handleChange(value, index) {
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
			addList() {
				var that = this
				var ButtonReply = catDrawListData.ButtonReply
				this.buttons.push(new ButtonReply())
			},
			removeList(index) {
				var that = this
				this.buttons.splice(index, 1)
			},
			//新增设置content值
			buttonInputOnChange(event, item) {
				if(item.type == 'reply') {
					item.content = item.description //reply的时候需要取设置相等的值
				}
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
	@import '../assets/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	/*新增组件css*/
	/*新增文字长度提示限制*/

	.txt-limit-div {
		/deep/ .ant-input {
			resize: none;
		}
	}

	/*0508新增挡住文字的问题,如果有文字长度限制就加上这个*/
	.handle-text-blocking {
		/deep/ .ant-input {
			padding-right: 43px !important;
		}
	}
	/*超过100的时候，需要增加*/
	.handle-text-blocking1 {
		/deep/ .ant-input {
			padding-right: 55px !important;
		}
	}

	.presend-content {
		/deep/ .ant-input {
			padding: 2px 7px;
	    height: 24px;
	    border-radius: 3px;
	    min-height: auto;
	    resize: none;
		}
		textarea.ant-input{
			height: inherit;
			padding: 4px 7px;
		}
	}

	/*0721新增日历选择*/
	.presend-content1 {
		/deep/ .ant-input {
			padding: 2px 7px;
	    border-radius: 3px;
	    min-height: auto;
	    resize: none;

	  	 height: auto;
	  	 padding-bottom: 20px;
		}
	}
	.txt-limit2 {
		position: absolute;
		bottom: 1px;
		right: 5px;
		background: #fff;
		height: 22px;
		line-height: 22px;
		color: #000;
		border-radius: 4px;
		opacity: 0.25;
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
		height: 36px;
		background: rgba(0, 0, 0, 0.02);
		color: rgba(24, 144, 255, 1);
		line-height: 36px;
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
		width: 100%;
	}
	.no-line-break {
		width:120px;
		margin-right: 15px;
		flex-shrink: 0;
	}
	.line-break-one {
		margin-top: 6px;
		padding-right: 28px;
		width: 100%;
		position: relative;

		/*0814新增覆盖冲突的样式*/
		/deep/ .ant-calendar-range-picker-input {
			color: inherit;
		}
	}
	.line-break-one-new {
		padding-right: 0;
		position: relative;
	}
</style>
