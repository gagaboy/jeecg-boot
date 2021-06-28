<template>
	<div>
		<!--发送消息动作-->
		<div class="draw-side-menu">
			<menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="发送消息动作"></menuCommonTop>
			<div class="draw-side-menu-trigger">
				<div class="draw-side-menu-trigger-title">动作主题</div>
				<div class="txt-limit-div" style="position: relative;">
           	<a-input  v-model="nowNode.nodeName" placeholder="请输入动作主题" :maxLength="25"></a-input>
            	<span class="txt-limit" >{{nowNode.nodeName && nowNode.nodeName.length || 0}} / 25</span>
          </div>

				<div class="draw-side-menu-trigger-title">消息内容</div>
				<!--输入内容列表-->
  				<catDrawList :eventList="nowNode" :nodeList="nodeList" :otherNodeList="otherNodeList" :pageParameters="pageParameters" :acceptUrl="acceptUrl" :messageConversionTemplates="messageConversionTemplates"></catDrawList>

  				<!--新增添加快捷按钮-->
  				<div class="draw-side-menu-trigger-title">快捷按钮</div>
  				<div style="margin-top: 10px; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 4px; width: 350px;">
					<!--<catDrawListAddButton :buttons="nowNode.buttons" :listStyle="{width: '350px'}" buttonStyle="left" :buttonNums="buttonNums" addButtonType="fixedButton" ></catDrawListAddButton>-->
					<!--10.13新增引用内容-->
					<catDrawListAddButton :buttons="nowNode.buttons" :listStyle="{width: '350px'}" buttonStyle="left" :buttonNums="buttonNums" addButtonType="fixedButton" :nodeList="nodeList" :otherNodeList="otherNodeList" :pageParameters="pageParameters" :nowNode="nowNode"></catDrawListAddButton>
				</div>

				<div style="margin-top: 24px;">
					<a-button v-dbClick @click="clickAll" data-type="save" class="draw-remove-button" type="primary" style="margin-right: 16px;">保存</a-button>
					<a-button @click="clickAll" data-type="cancel" class="draw-remove-button">取消</a-button>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
	import catDrawList from '../catDrawList' //添加输入内容
	import menuCommonTop from '../menuCommon/menuCommonTop' //0722顶部的title部分，新增返回按钮

	import catDrawListAddButton from '../cardType/catDrawListAddButton' //添加快捷按钮

	import {CatDrawJudge} from '../catDrawJudge'  //判断条件的处理

	import { removeEmoji } from '../assets/js/util.js'  //emoji表情

	export default {
		name: 'catDrawMenuSend',
		components: {
			catDrawList,

			catDrawListAddButton,
			menuCommonTop,
		},
		props: {
			nowNode: {
				type: Object,
				default: function() {
					return {
						nodeType: 'send',

						nodeName: '',
						onceReplyModeLabel: '随机发送一条',
						onceReplyMode: 1,
						inputContents: [],
				}
			},
			},
			nodeList: Array,
			otherNodeList: Array,
			buttonNums: Number,  //固定按钮个数

			//0528修改上传的地址
			acceptUrl: {
				type: Object,
				default: function() {
					return {
						uploadFiles: '/apps/Canvas/uploadMedia', //上传的地址
					}
				},
			},
			//0528修改上传的地址
			pageParameters: {
				type: Object,
				default: function() {
					return {
						showQuote: true, //新增是否显示引用的内容
					}
				},
			},

			showBackButton: Boolean,  //0721新增显示返回按钮
			
			messageConversionTemplates: Array, // 10.10新增转换模板列表
		},
		data: function() {
			return {
			}
		},
		methods: {
			clickAll(e) {
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				if(typeof this[clickType] == 'function') {
					this[clickType]()
					return
				}
			},
			decideInput(nodeName) {
				var result = true
				if((!this.nowNode.inputContents) || (this.nowNode.inputContents.length < 1)) {
					this.$message.warning('消息内容不能为空')
					return false
				}

					//0402新增判断回复内容不能为空
					if(!this.catDrawJudge.judgeEmpty(this.nowNode.inputContents, '', this.pageParameters)) {
						return false
					}
					//0402新增判断buttons不能为空
//					if(!this.catDrawJudge.judgeEmptyButtons(this.nowNode.buttons)) {
					if(!this.catDrawJudge.judgeEmptyButtons(this.nowNode.buttons, this.pageParameters)) {
						return false
					}
					return result
			},
			//判断是否非必填
			decide() {
				//判断不能为空
				if(!this.nowNode.nodeName) {
					this.$message.warning('动作主题不能为空')
					return false
				}else if(!removeEmoji.test(this.nowNode.nodeName)) {
					this.$message.warning('动作主题不能包含emoji')
					return false
				}

				if(!this.decideInput('inputContents')) {
					return false
				}
				return true
			},
			save() {
				//判断条件
				if(!this.decide()) {
					return
				}

				var nowNode = this.nowNode
				this.$emit('save', {
					eventObj: this.nowNode,
				})
			},
			cancel() {
				this.$emit('cancel')
			},
				catBackButton() {
	    		//返回按钮
	    		this.$emit('catBackButton')
	    	},
		},
		created() {
			var that = this
			this.catDrawJudge = new CatDrawJudge(this)
		},
		mounted() {

		},
		directives:{
        dbClick:{
            inserted(el, binding) {
                    el.addEventListener('click', e => {
                          if(!el.disabled) {
                           el.disabled = true;
                           let timer = setTimeout( () => {
                              el.disabled = false;
                           },1000)
                          }
                    })
                   }
        }
   },
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	/*----------*/
	/*新增文字长度提示限制*/
  .txt-limit-div {
    /deep/ .ant-input {
      padding-right: 43px;
    }
  }
  .txt-limit {
    position: absolute;
    top: 2px;
    right: 5px;
    background: #fff;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    opacity: 0.25;
  }
</style>
