<template>
	<div>
		<!--任务切换动作-->
		<div class="draw-side-menu">
			<menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="变量管理"></menuCommonTop>
			<div class="draw-side-menu-trigger">
				<div class="draw-side-menu-trigger-title">变量管理主题</div>
					<div class="txt-limit-div" style="position: relative;">
            <a-input  v-model="nowNode.nodeName" placeholder="请输入变量管理主题" :maxLength="25"></a-input>
            <span class="txt-limit" >{{nowNode.nodeName && nowNode.nodeName.length || 0}} / 25</span>
          </div>

				<div class="draw-side-menu-trigger-title">配置</div>
				<div style="margin-top: 10px; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 4px; width: 350px;">
					<div style="width: 100%;" >
						<div v-for="(item, index) in nowNode.variableConfig" :key="index">
							<div class="draw-flex-center add-content"  >
								<div class="draw-flex-center" style="position: relative">
									<a-select v-model="item.varSlot" @change="handleChange($event, index)" placeholder="选择变量" :transfer="true" class="line-break" style="width: 289px;" size="small" :dropdownMatchSelectWidth="false" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
										<a-select-option v-for="item in variableSlotList" :value="item.variableId" :key="item.variableId" >{{ item.variableName }}</a-select-option>
									</a-select>

									<!--删除按钮-->
									<a-icon @click="removeList(index)" class="draw-cursor-pointer" type="delete" size="16" color="#515a6e" style="color: #515a6e; font-size: 14px;"></a-icon>
								</div>

								<div  class="line-break-one" :class="[pageParameters.showQuote ? 'line-break-one-new' : '' ]">
									<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalVarSlotValue' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode"  size="small" :showQuote="pageParameters.showQuote" placeholder="请输入变量值"></roInputAboutQuoteOne>
								</div>

							</div>
						</div>
						<div   @click="clickAll" data-type="addList" class="draw-flex-center add-button add-fixed-button add-fixed-left" >
							<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
							添加变量配置
						</div>
					</div>
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
	import { removeEmoji } from '../assets/js/util.js'  //emoji表情
	import menuCommonTop from '../menuCommon/menuCommonTop' //0722顶部的title部分，新增返回按钮

	import roInputAboutQuoteOne from '../roInputAboutQuoteOne/roInputAboutQuoteOne'  //新增带上引用和emoji输入的input输入框

	import abuotNode from '../abuotNode.js'

	export default {
		name: 'catDrawMenuManageVariables',
		components: {
			menuCommonTop,
			roInputAboutQuoteOne,
		},
		props: {
			nowNode: Object, //新增当前节点的数据，用于去除当前的节点

			nodeList: Array, //数组
			otherNodeList: Array,
			variableSlotList: {
				type: Array,
				default: function() {
					return []
				},
			},
			//新增页面传递过去的参数
			pageParameters: {
				type: Object,
				default: function() {
					return {
						showQuote: true,
					}
				},
			},

			showBackButton: Boolean,  //0721新增显示返回按钮
		},
		data: function() {
			return {}
		},
		methods: {
			//判断是否非必填
			decide() {
				//判断不能为空
				if(!this.nowNode.nodeName) {
					this.$message.warning('变量管理主题不能为空')
					return false
				}else if(!removeEmoji.test(this.nowNode.nodeName)) {
					this.$message.warning('变量管理主题不能包含emoji')
					return false
				}

				//20.10.09判断添加的内容不能为空
				var variableConfig = this.nowNode.variableConfig || []
				if(variableConfig.length == 0) {
					this.$message.warning('变量配置不能为空')
					return false
				}
				for(var i = 0; i < variableConfig.length; i++) {
					var item = variableConfig[i]
					item.originalVarSlotValue = item.originalVarSlotValue.trim()  //设置成空
					var originalVarSlotValue = item.originalVarSlotValue
					if((!item.varSlot || !originalVarSlotValue)) {
						this.$message.warning('配置内容添加后不可为空')
						return false
						break
					}
				}

				return true
			},
			save() {
				//判断条件
				if(!this.decide()) {
					return
				}
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
			setVarSlotNames() {
				var res = {}
				var variableSlotList = this.variableSlotList || []
				variableSlotList.forEach((item) => {
					res[item.variableId] = item.variableName
				})
				return res
			},
	    	handleChange(value, index) {
	    		var varSlotNames = this.setVarSlotNames()

	    		var variableConfig = this.nowNode.variableConfig || []
	    		variableConfig[index].varSlotName = varSlotNames[value] //id转成名字
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
				this.nowNode.variableConfig.push(new abuotNode.manageVariablesOne())  //添加变量配置
			},
			removeList(index) {
				var that = this
				this.nowNode.variableConfig.splice(index, 1)
			},
		},
		created() {
			var that = this
		},
		mounted() {},
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
	@import '../assets/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
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

	/*.presend-content {
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
	}*/

	/*.txt-limit2 {
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
	}*/
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
		margin: 0 auto;
		border-radius: 4px 4px 0 0;
	}

	.add-fixed-button {
		background: #fff;
	}

	.add-fixed-left {
		justify-content: flex-start;
	}

	/*.add-content-icon {
		margin-right: 6px;
	}*/

	.add-fixed-button-max {
		color:#A9AAB1;
	}
	/*新增需要换行显示*/
	.line-break {
		margin-right: 15px;
		width: 100%;
	}
	/*.no-line-break {
		width:120px;
		margin-right: 15px;
		flex-shrink: 0;
	}*/
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
