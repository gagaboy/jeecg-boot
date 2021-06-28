<template>
	<div>
		<!--移除用户组动作-->
		<div class="draw-side-menu">
			<menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="组中移除用户动作"></menuCommonTop>
			<div class="draw-side-menu-trigger">
				<div class="draw-side-menu-trigger-title">动作主题</div>
					<div class="txt-limit-div" style="position: relative;">
           	<a-input  v-model="nowNode.nodeName" placeholder="请输入动作主题" :maxLength="25"></a-input>
            	<span class="txt-limit" >{{nowNode.nodeName && nowNode.nodeName.length || 0}} / 25</span>
          </div>

				<div class="draw-side-menu-trigger-title">将当前用户从下方组中移除</div>
				<a-select :default-value="nowNode.groupId ? { key: nowNode.groupId } : undefined" style="width:352px" @change="onChange" label-in-value  placeholder="请选择用户组" :getPopupContainer="triggerNode => { return triggerNode.parentNode }">
					<a-select-option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.groupName }}</a-select-option>
				</a-select>
				<!--从用户组中移除-->
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
		name: 'catDrawMenuRemoveUserGroup',
		components: {
			menuCommonTop,
		},
		props: {
			nowNode: Object,
			groupList: Array,

			showBackButton: Boolean,  //0721新增显示返回按钮
			groupList: Array, //用户组数组
		},
		data: function() {
			return {}
		},
		methods: {
			onChange(obj) {
				this.nowNode.groupId = obj.key
				this.nowNode.groupName = obj.label //设置value的值
			},
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
				//判断不能为空
				if(!this.nowNode.nodeName) {
					this.$message.warning('动作主题不能为空')
					return false
				}else if(!removeEmoji.test(this.nowNode.nodeName)) {
					this.$message.warning('动作主题不能包含emoji')
					return false
				}
				if(!this.nowNode.groupId) {
					this.$message.warning('用户组不能为空')
					return false
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
