<template>
	<div>
			<!--文字显示-->
			<div v-if="coverObject.longText" class="top-cover" style="background: #fff;">
				<div class="top-cover-surround">
					<div class="draw-flex-center chat-box-top">
						<div @click="clearLongText" class="draw-cursor-pointer top-cover-back">
<!--							<Icon type="ios-arrow-back" size="20" />-->
              <a-icon type="left" style="font-size: 20px;" />
						</div>
					</div>
					<!--全屏显示文字-->
					<div class="top-cover-bottom">
						{{coverObject.longText}}
					</div>
					<!--底部设置间距-->
					<div class='draw-flex-center chat-box-bottom'></div>
				</div>
			</div>
	</div>
</template>
<script>
	export default {
		name: 'catRobotCover',
		components: {},
		props: {
			coverObject: {
				type: Object,
				default: function() {
					return {
						longText: '',
					}
				},
			},
		},
		data: function() {
			return {}
		},
		created: function() {
		},
		mounted() {},
		methods: {
			// 关闭全文内容
			clearLongText() {
				this.coverObject.longText = ''
			},
		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';

	@default: #EBEEF5;
	.chat-box {
		width: 375px;
		height: 450px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.15);
		border-radius: 4px;

		position: relative;
	}

	.chat-box-top {
		justify-content: space-between;
		padding: 0 24px;
		height: 52px;
		line-height: 52px;
		border-bottom: 1px solid @default;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.85);
		position: relative;
		width: 100%;

		position: absolute;
		top: 0;
		left: 0;
		background: #fff;
		/*border-radius: 24px 24px 0 0;*/
		z-index: 2;
	}

	.top-cover {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow: auto;
		z-index: 2;
	}

	.top-cover-player {
		width: 100%;
		height: 250px;
	}

	.top-cover-surround {
		width: 100%;
		height: 100%;
	}

	.top-cover-bottom {
		height: 100%;
		overflow: auto;

		padding: 18px 24px;
		padding-top: 70px;
		padding-bottom: 24px;

    word-break: break-all;
	}

	.full-screen-img {
		width: 100%;
		height: 200px;
	}
	.chat-box-bottom {
		height: 16px;
		width: 100%;
		position: absolute;
		bottom: 0;
		background: #fff;
		/*border-radius: 0 0 24px 24px;*/
		z-index: 2;
	}
</style>
