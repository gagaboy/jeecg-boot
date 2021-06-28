<template>
	<!--表情选择器-->
	<a-popover v-model="visible" trigger="click" :transfer="true" overlayClassName="cat-draw-emoji" placement="bottomRight" width="320" padding="0px">
		<a-icon v-if="showPoptip" class="draw-cursor-pointer" type="smile" size="16"></a-icon>

		<div class="instance-linkbox" slot="content">
			<!--放在内部显示和隐藏-->
			<roEmojiPicker :name="name" @selectEmoji="addCatEmoji"></roEmojiPicker>
		</div>
	</a-popover>
</template>
<script>
	import roEmojiPicker from "./roEmojiPicker/roEmojiPicker" //emoji输入框

	export default {
		name: 'roEmoji',
		props: {
			currentIndex: {
				type: Number,
				default: 0, //请求的地址
			},
			aboutObj: Object, //需要传递过来的值
		},
		components: {
			roEmojiPicker,
		},
		data: function() {
			return {
				showPoptip: true, //是否显示图标
				name: 'pick',

				visible: false,
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
			addCatEmoji(val) {
				var that = this
				//关闭弹窗
				this.visible = false

				this.$emit('addCatEmoji', {
					currentIndex: this.currentIndex,
					emoji: val,
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
	@import '../assets/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	.instance {
		border-bottom: 1px solid @defaultBorder;
	}

	.instance-top {
		height: 36px;
		line-height: 36px;
		justify-content: space-between;
		background: #FAFAFA;
		padding: 0 16px;
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