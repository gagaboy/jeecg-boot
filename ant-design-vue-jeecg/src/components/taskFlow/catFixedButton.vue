<template>
	<!--配置页面添加固定按钮-->
	<div :style="listStyle">
		<div class="default-onceReplyModeLabel">
			<div v-if="showOnceReplyModeLabel" class="draw-flex-center onceReplyModeLabel-radio">
				<RadioGroup v-model="fixedButtonObj.buttonRange">
					<Radio v-for="(val,key,index) in replys" :key="index" :label="key">
						{{val}}
					</Radio>
				</RadioGroup>
			</div>

			<!--添加的类型-->
			<catDrawListAddButton addButtonType="fixedButton" :buttons="fixedButtonObj.buttons" ></catDrawListAddButton>
		</div>
	</div>
</template>
<script>
	import catDrawListAddButton from './cardType/catDrawListAddButton' //添加菜单

	export default {
		name: 'catFixedButton',
		props: {
			listStyle: {
				width: '480px'
			},
			fixedButtonObj: {
				type: Object,
				default: function() {
					return {
						buttonRange: 1, //1是否在默认回复中显示，还是2在全部中显示
						buttons: [
//							{
//					      "type": "url",  //reply/url/openApp
//					      "description": "",
//					      "content": "",
//					      openAppAndroid: "",
//					      openAppIos: "",
//					    }
						]
					}
				},
			},
			showOnceReplyModeLabel: {
				type: Boolean,
				default: true,
			}
		},
		components: {
			catDrawListAddButton, //添加按钮
		},
		data: function() {
			return {
				replys: {
					1: '只在默认回复中显示',
					2: '在所有下发消息中显示',
				},
			}
		},
		methods: {
			clickAll(e) {
				var that = this
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				if(typeof this[clickType] == 'function') {
					this[clickType]()
					return
				}
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
	}

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
	}
</style>