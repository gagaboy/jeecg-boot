<template>
	<div>
		<!--触发器-->
		<div class="draw-side-menu">
			<menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="触发器"></menuCommonTop>
			<div class="draw-side-menu-trigger">
				<div class="draw-side-menu-trigger-title">关键词触发</div>
				<a-input  v-model="nowNode.inputName" type="textarea" :rows="8" placeholder="用户会输入什么来触发这个任务？请以每行一个的格式输入相似触发语句"></a-input>

				<div class="draw-side-menu-trigger-title">内容符合正则触发</div>
				<a-input  v-model="nowNode.ruleExpr" type="textarea" :rows="4" placeholder="请输入正则表达式"></a-input>

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

	export default {
		name: 'catDrawMenuTrigger',
		components: {
			menuCommonTop,
		},
		props: {
			nowNode: Object,

			showBackButton: Boolean,  //0721新增显示返回按钮
		},
		data: function() {
			return {}
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
			//判断是否非必填
			decide() {
				if(!removeEmoji.test(this.nowNode.inputName)) {
					this.$message.warning('关键词触发不能包含emoji')
					return false
				}

				if(!removeEmoji.test(this.nowNode.ruleExpr)) {
					this.$message.warning('内容符合正则触发不能包含emoji')
					return false
				}

	    		//判断名字不能重复
	    		return true
			},
			//	    	分割输入内容
			splitInput() {
				var that = this
				var inputName = this.nowNode.inputName
				var result = []
				//如果有就添加到下面，否则不添加到数组中去
				if(inputName) {
					var res = inputName.split('\n') || []
          res.forEach((item) => {
            if(item) {
              result.push(item)
            }
          })
				}
				return result
			},
			save() {
				var that = this
				var nowNode = this.nowNode
				nowNode.inputContents = this.splitInput() //分割成数组形式

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
		},
		created() {
			var that = this
		},
		mounted() {

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
	@import '../assets/css/default.css';
	.draw-side-menu {
		/*去除输入框缩放问题*/
		/deep/ .ant-input {
      resize: none;
    }
	}
</style>
