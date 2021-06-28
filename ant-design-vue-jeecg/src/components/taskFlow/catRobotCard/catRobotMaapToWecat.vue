<template>
	<div @click="openUrl" class="draw-cursor-pointer cat-robot-content" style="margin-bottom: 12px;">
		<div class="draw-flex-center more-card">
			<div class="draw-flex-center cropper more-list-li ">
				<div class="cropper-section">
					<div class="draw-flex-center cropper-detail">
						<div class="text-one cropper-level-title">
							{{maapToWecatObj.reply.title}}
						</div>
						<div class="div-long-text">
							<div class="text-one cropper-level-content long-text">
								{{maapToWecatObj.reply.description}}
							</div>
						</div>
					</div>
					<!-- 图片显示在右边 -->
					<div class="loop-img-play draw-cursor-pointer">
						<img v-if="maapToWecatObj.reply.picurl" class="draw-cat-more-card-img cropper-level-img" :src="maapToWecatObj.reply.picurl" alt="" />
					</div>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
	import {getUUID} from '../assets/js/util.js'
	var isTest = false

	export default {
		name: 'catRobotMaapToWecat',
		components: {

		},
		props: {
			//传递过来的对象
			response: {
				type: Array,
				default: function() {
					return []
				},
			},
			msgType: {
				type: String,
				default: '',
			},
			maapToWecatObj: {
				type: Object,
				default: function() {
					return {}
				},
			},
		},
		data: function() {
			return {
				media: {
//					title: '收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片',
//					description: '收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片收到一张图片',
//					thumbnailMediaUrl: '',
//					mediaType: 'voice',
				},

				catRobotMoreCardId: '', //方便获取元素
				longText: '', //显示的内容
			}
		},
		created: function() {
		},
		mounted() {},
		methods: {
			//在新窗口打开链接
			openUrl() {
				var mediaUrl = this.maapToWecatObj.reply.url
				window.open(mediaUrl,"_blank");
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	@default: #EBEEF5;
	.text-one {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		/* autoprefixer: off */
-webkit-box-orient: vertical;
/* autoprefixer: on */
		-webkit-line-clamp: 1;
	}
	/*20200310新增单卡多卡///////////////*/
	@rem: 1px;
	@subtractionWidth: 18px;
	.cropper {
		position: relative;
		flex-direction: column;
		/*padding-bottom: 5*@rem;*/
		background: #F7F7F7;
		&-img {
			/*width: 342*@rem;*/
			width: 342*@rem - @subtractionWidth;
			height: 175*@rem;
		}
		.title {
			width: 308*@rem - @subtractionWidth;
			color: rgba(0, 0, 0, 1);
			line-height: 24*@rem;
		}
		&-title {
			font-size: 15*@rem;
			.title();
			-webkit-line-clamp: 2;
			margin-top: 13*@rem;
		}
		&-content {
			font-size: 13*@rem;
			.title();
			-webkit-line-clamp: 3;
			margin: 6*@rem 0 13*@rem;
			line-height: 20*@rem;
		}
		&-button {
			width: 100%;
			height: 24*@rem;
			font-size: 15*@rem;
			font-weight: 500;
			color: rgba(74, 144, 226, 1);
			line-height: 24*@rem;
			cursor: pointer;
			text-align: center;
			margin-bottom: 8*@rem;
		}
		/*// 水平显示*/
		&-section {
			/*width: 342*@rem - @subtractionWidth;*/
			/*width: 313*@rem;*/
			/*padding: 17*@rem;*/
			width: 300*@rem;
			height: 96*@rem;
			padding: 12*@rem;
			justify-content: space-between;
			display: flex;
		}
		&-level-img {
			width: 72*@rem;
			height: 72*@rem;
		}
		&-detail {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;

			margin-right: 20*@rem;
			align-items: flex-start;
		}
		.level-title {
			/*width: 185*@rem - @subtractionWidth;*/
			color: rgba(0, 0, 0, 1);
			/*line-height: 24*@rem;*/
		}
		&-level-title {
			font-size: 15*@rem;
			.level-title();
			-webkit-line-clamp: 1;
		}
		&-level-content {
			font-size: 13*@rem;
			.level-title();
			-webkit-line-clamp: 2;

			margin-top: 6*@rem;

			word-break:break-all;
		}
	}

	.loop {
		position: relative;
		background: #F7F7F7;
		flex-direction: column;
		&-img {
			width: 242*@rem;
			height: 117*@rem;
		}
		&-title {
			width: 208*@rem;
		}
		&-small-img {
			width: 125*@rem;
			height: 117*@rem;
		}
		&-small-title {
			width: 98*@rem;
			-webkit-line-clamp: 2;
		}
		&-small-title-one {
			-webkit-line-clamp: 1;
		}
		&-img-play {
			position: relative;
			.play-icon {
				width: 100%;
				height: 100%;
				background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.5) 100%);
				position: absolute;
				top: 0;
				left: 0;
			}
			img {
				vertical-align: bottom;
			}
		}
		&-card-play {
			width: 38*@rem;
			height: 38*@rem;
			cursor: pointer;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.more-card {
		justify-content: flex-start;
	}
	/*// 多个时候，需要显示*/
	.more-list {
		justify-content: flex-start;
		overflow: auto;
	}

	/*// 显示全文外层div*/
	.div-long-text {
		position: relative;
		font-size: 13*@rem;
		line-height: 20*@rem;
	}
</style>