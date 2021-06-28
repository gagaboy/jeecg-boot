<template>
	<div style="position: relative;">
		<template v-if="imgConfiguration.width && imgConfiguration.height && imgConfiguration.widthDivideHeight">
			<template v-if="imgConfiguration.widthDivideHeight >= 16 / 9">
				<div v-if="imgConfiguration.height <= 168" class='draw-flex-center divimg-style1 draw-cursor-pointer'>
					<!--直接设置图片本来宽高-->
					<img class="img-style" :style="{ width: imgConfiguration.width + 'px', height: imgConfiguration.height + 'px' }" :src="imgSrc" />
					<template v-if="showCover">
						<div class="chat-detail-cover"></div>
						<div class="position-center chat-detail-play"></div>
						<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
					</template>
				</div>
				<div v-else class='draw-flex-center divimg-style1 draw-cursor-pointer'>
					<!--width需要乘以比例，高度是168px-->
					<img class="img-style" style="height: 168px;" :style="{ width: (imgConfiguration.widthDivideHeight * 168) + 'px' }" :src="imgSrc" />
					<template v-if="showCover">
						<div class="chat-detail-cover"></div>
						<div class="position-center chat-detail-play"></div>
						<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
					</template>
				</div>
			</template>
			<template v-if="imgConfiguration.widthDivideHeight <= 9 / 16">
				<div v-if="imgConfiguration.width <= 94" class='draw-flex-center divimg-style2 draw-cursor-pointer'>
					<!--直接设置图片本来宽高-->
					<img class="img-style"  :style="{ width: imgConfiguration.width + 'px', height: imgConfiguration.height + 'px' }" :src="imgSrc" />
					<template v-if="showCover">
						<div class="chat-detail-cover"></div>
						<div class="position-center chat-detail-play"></div>
						<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
					</template>
				</div>
				<div v-else class='draw-flex-center divimg-style2 draw-cursor-pointer'>
					<!--width固定是94，高度除以比例-->
					<img class="img-style" style="width: 94px;" :style="{ height: (94 / imgConfiguration.widthDivideHeight) + 'px' }" :src="imgSrc" />
					<template v-if="showCover">
						<div class="chat-detail-cover"></div>
						<div class="position-center chat-detail-play"></div>
						<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
					</template>
				</div>
			</template>
			<template v-if="(imgConfiguration.widthDivideHeight < 16 / 9) && imgConfiguration.widthDivideHeight > 9 / 16">
				<!--情况2-->
				<div v-if="imgConfiguration.width <= 296 && imgConfiguration.height <= 168" class="draw-cursor-pointer" style="position: relative;" :style="{ width: imgConfiguration.width + 'px', height: imgConfiguration.height + 'px' }">
					<img class="img-style" :style="{ width: imgConfiguration.width + 'px', height: imgConfiguration.height + 'px' }" :src="imgSrc" />
					<template v-if="showCover">
						<div class="chat-detail-cover" ></div>
						<div class="position-center chat-detail-play"></div>
						<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
					</template>
				</div>
				<!--情况1-->
				<div v-else class='divimg-style3 draw-cursor-pointer'>
					<img class="img-style" style="object-fit: contain; width: 100%; height: 100%;" :src="imgSrc" />
					<template v-if="showCover">
						<div class="chat-detail-cover"></div>
						<div class="position-center chat-detail-play"></div>
						<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
					</template>
				</div>
			</template>
		</template>
		<!--设置默认封面图-->
		<!--<template v-else>
			<div class='draw-flex-center divimg-style1'></div>
		</template>-->
		<template v-else>
			<div class='draw-flex-center divimg-style1'>
				<!--没有设置封面图-->
					<template v-if="showCover">
						<div class="chat-detail-cover"></div>
						<div class="position-center chat-detail-play"></div>
						<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
					</template>
			</div>
		</template>

		<!--<div class='draw-flex-center divimg-style1'>
				<img style="width: 400px; height: 	100px;"  src="../rcsTestImg/400x100.png" />
			</div>
			<div  class='draw-flex-center divimg-style1'>
				<img style="width: 336px; height: 168px;" src="../rcsTestImg/400x200.png" />
			</div>
			<div class='draw-flex-center divimg-style2'>
					<img style="width: 90px; height: 180px;" src="../rcsTestImg/90x180.png" />
				</div>
				<div  class='draw-flex-center divimg-style2'>
					<img style="width: 94px; height: 188px; " src="../rcsTestImg/100x200.png" />
				</div>
		<div class='divimg-style3'>
			<img style="object-fit: contain; width: 100%; height: 100%;" src="../rcsTestImg/200.png" />
		</div>
		<div >
			<img style="width: 50px; height: 50px;" src="../rcsTestImg/50.png" />
		</div>-->
	</div>
</template>
<script>
	import {CatRobotImgCalculation} from './catRobotImgCalculation.js'

//	若，宽高比>=16 : 9时，展示大小为296*168
//若高度<=168，居中显示宽度超出296的部分左右剪裁。
//若高度 > 168，则等比例缩放至高度=168，居中显示。宽度超出部分左右剪裁。
//
//
//若，宽高比<=9 : 16时，展示大小为94*168
//若宽度<=94，居中显示高度超出168的部分上下剪裁
//若宽度 > 94，则等比例缩放至宽度=94，居中显示。高度超出部分上下剪裁
//
//
//若，9 : 16 < 宽高比 < 16 : 9 ,展示区域为296*168
//按大边缩放至展示区域内完全显示，
//若不超过展示区域直接显示
//
//视频添加一层0.25#000000的蒙版

	export default {
		name: 'catRobotImg',
		components: {},
		props: {
			imgSrc: {
				type: String,
				default: ''
			},
			showCover: {
				type: Boolean,
				default: false
			},  //视频需要显示蒙层，是否显示蒙层
		},
		data: function() {
			return {
				imgConfiguration: {
					width: 0,
					height: 0,
					widthDivideHeight: 0,  //宽高比例
				}
			}
		},
		watch:{
		  imgSrc: {
		      handler(newName, oldName) {
						if(newName) {
							if(!this.catRobotImgCalculation) {
								this.catRobotImgCalculation = new CatRobotImgCalculation()
							}
							this.catRobotImgCalculation.getImgSize(newName).then((result) => {
								this.imgConfiguration = result
							})
						}
		      },
		      immediate: true,
		      deep: true
		  },
		},
		created: function() {},
		mounted() {},
		methods: {

		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	.divimg-style1 {
		width:296px;
		height:168px;
		background: #F7F7F7;
		overflow: hidden;
		position: relative;
	}
	.divimg-style2 {
		width:94px;
		height:168px;
		background: #F7F7F7;
		overflow: hidden;
		/*resize: both;*/
		position: relative;
	}
	.divimg-style3 {
		width:296px;
		height:168px;
		background: #F7F7F7;
		overflow: hidden;
		/*resize: both;*/
		position: relative;
	}
	.img-style {
		display: block; /*去除图片间距*/
	}
	.fill { object-fit: fill; }
	.contain { object-fit: contain; }
	.cover { object-fit: cover; }
	.none { object-fit: none; }
	.scale-down { object-fit: scale-down; }


	/*蒙层新增样式*/

	.position-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.chat-detail-cover {
		position: absolute;
		left: 0;
		top: 0;
		/*background:rgba(0,0,0,0.25);*/
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.5) 100%);
		width: 100%;
		height: 100%;
	}

	.chat-detail-play {
		width: 42px;
		height: 42px;
		background: rgba(255, 255, 255, 1);
		opacity: 0.25;
		border-radius: 50%;
	}

	.chat-detail {
		padding: 8px 16px !important;
		max-width: 240px;
	}
	/*蒙层*/
	.play-icon {
		width: 100%;
    height: 100%;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.5) 100%);
		position: absolute;
		top: 0;
		left: 0;
	}
	.loop-card-play {
		width: 38px;
		height: 38px;
		cursor: pointer;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
