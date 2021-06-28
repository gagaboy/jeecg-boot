<template>
	<div :style="listStyle">
		<div class="draw-flex-center instance-top-content">
			<div style="width: 278px; height: 166px; ">
				<ro-upload :disabled="!pageParameters.needUpload" type="drag" field="mediaUrl" ref="upload" :show-upload-list="false" :on-success="handleSuccess" :data="{'mediaType': uploadType.mediaType}" :format="uploadType.format" :accept="uploadType.accept" :max-size="uploadType.maxSize" sendKey="ajaxUpload" :before-upload="handleUpload" id="ImportTargetForm_fileUrl" fieldTitle="上传文件" :validate="'required'" :deleteFailFile="true" :autoUpload="true" :action="acceptUrl.uploadFiles">
					<div @click="openMaterialModal" class="draw-flex-center" style="width: 278px; height: 166px; flex-direction: column; background: #FAFAFA; font-size: 12px;">
						<template v-if='item.reply && item.reply.fileName'>
							<div class="draw-flex-center upload-img">
								<img v-if="item.replyType == 'image'" class="upload-img" :src="item.reply.mediaUrl" />
								<img v-else-if="item.replyType == 'voice'" class="upload-img" :src="require('../assets/audioIcon.png')" />
								<!--如果是视频，需显示封面图-->
								<img v-else-if="item.replyType == 'video' && item.reply.thumbnailMediaUrl" class="upload-img" :src="item.reply.thumbnailMediaUrl"></img>
								<!--10.19新增文件类型， 如果需要上传，后期需要单独做处理-->
								<img v-else-if="item.replyType == 'file'" style="width: 48px; height: 48px;" :src="require('../assets/fileIcon.png')" />
								<!-- 视频蒙层 -->
						          <div v-if="item.replyType == 'video'" class="play-icon">
						            <img class="loop-card-play" :src="require('../assets/cardPlay.png')" alt="" />
						          </div>
							</div>
							<div class="upload-img-text" style="width: 260px;">{{item.reply.fileName}}</div>
							<!--10.20新增显示文件后缀-->
							<div v-if="item.replyType == 'file'" class="upload-img-text" style="width: 260px;">{{item.reply.materialFileType}}</div>
						</template>
						<!--上传前-->
						<template v-else >
							<!--<Icon type="ios-plus-empty" size="52" style="color: #260000"></Icon>-->
							<a-icon type="plus" style="color: #260000; font-size: 30px;" ></a-icon>

								<p class="draw-upload-title">{{pageParameters.needUpload ? uploadType.tishiTitle : uploadType.tishiTitle1}}</p>
								<p class="draw-upload-title" style="line-height:22px; width: 221px;">{{pageParameters.needUpload ? uploadType.tishi : ''}}</p>
						</template>
					</div>
				</ro-upload>
			</div>
		</div>
	</div>
</template>
<script>
	import {dealNoFileType, producedAllCaseCombination, getUUID, setMediaType} from '../assets/js/util'  //处理没有file.type的问题
	import catDrawListData from './catDrawListData'  //初始化media

	import roUpload from '../roUpload' //ivew多文件上传组件

	export default {
		name: 'catDrawListImg', //图片，音频和视频
		props: {
			listStyle: {
						width: '351px'
					},
			//新增上传组件
			acceptUrl: {
				type: Object,
				default: function() {
					return {
						uploadFiles: '/apps/Canvas/uploadMedia', //上传的地址
					}
				},
			},
			//传递过来的对象
			item: {
				type: Object,
				default: function() {
					return {
						replyType: 'image',
						reply: {
							'mediaUrl': '',  //上传的文件名
							"mediaContentType": "", //上传的文件后缀
						},
					}
				},
			},

			//0610新增页面传递过去的参数
			pageParameters: {
				type: Object,
				default: function() {
					return {}
				},
			},
		},
		components: {
			roUpload,
		},
		data: function() {
			return {
				//上传的限制条件
				uploadTypes: {
					image: {
						upLoadData: {
							mediaType: 'pic',
						},
						mediaType: 'pic',
						format: producedAllCaseCombination(['jpg','gif','png', 'bmp']),  //限制上传格式
						accept: '.jpg, .gif, .png, .bmp',
						tishiTitle: '上传图片',
//						maxSize: 2048,  //小于2m
//						tishi: '请上传JPG、PNG、GIF、BMP格式，并小于2M的图片',
						maxSize: 10240,  //小于2m
						tishi: '请上传JPG、PNG、GIF、BMP格式，并小于10M的图片',
						tishiTitle1: '选择图片',
					},
					voice: {
						upLoadData: {
							mediaType: 'voice',
						},
						mediaType: 'voice',
						format: producedAllCaseCombination(['mp3','amr']),
						accept: '.mp3, .amr',
						tishiTitle: '上传音频',
//						maxSize: 2048,   //小于2m
//						tishi: '请上传MP3、AMR格式，小于2M，时长小于60秒的音频',
						maxSize: 20480,   //小于2m
						tishi: '请上传MP3、AMR格式，小于20M的音频',
						tishiTitle1: '选择音频',
					},
					video: {
						upLoadData: {
							mediaType: 'video',
						},
						mediaType: 'video',
						format: producedAllCaseCombination(['3gp','mp4']),
						accept: '.mp4, .3gp',
						tishiTitle: '上传视频',
//						maxSize: 10240,  //小于10m
//						tishi: '请上传3GP、MP4格式，小于10M，时长小于90秒的视频',
						maxSize: 512000,  //小于10m
						tishi: '请上传3GP、MP4格式，小于500M的视频',
						tishiTitle1: '选择视频',
					},
					//10.19新增文件类型
					file: {
						upLoadData: {
							mediaType: 'file',
						},
						mediaType: 'file',
						format: producedAllCaseCombination([]),
						accept: '',
						tishiTitle: '上传文件',
						maxSize: 0,  //小于10m
						tishi: '',
						tishiTitle1: '选择文件',
					},
				},
				uploadType: {},
				//0608新增本地选择素材
				modalId: getUUID(),
				//显示顶部的菜单栏
				catChooseShow: {
						showPic: true, //显示图片
						showVoice: true, //显示音频
						showVideo: true, //显示视频
					},
			}
		},
		watch:{
		  item: {
		      handler(newName, oldName) {
						if(newName && newName.replyType) {
							this.uploadType = this.uploadTypes[newName.replyType]

							//0608新增本地选择素材
							this.setCatChooseShow(newName.replyType)
						}
		      },
		      immediate: true,
		      deep: true
		  },
		},
		methods: {
			playVideo() {

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
			//新增上传组件
			handleUpload(file) {
				dealNoFileType(file)

//				//清空之前的数据
//				var res = new catDrawListData.CatMedia()
//				var reply = this.item.reply
//					for(var key in res) {
//						reply[key] = res[key]
//					}
//					reply.mediaContentType = file.catFileType  //类型

				return true
			},
			handleError(error, file) {
				this.$Spin.hide();
				document.body.style.overflow = 'auto'
				this.$message.error({
          content: '上传文件异常提醒',
					desc: '您的文件' + file.name + '未上传成功！',
					duration: 0
				});
			},
			handleSuccess(response, file, fileList) {
				this.$Spin.hide();
				document.body.style.overflow = 'auto'
				if(response.status == '0') {
					this.$message.success("文件上传成功");
					var reply = this.item.reply
					var res = response.result
					for(var key in res) {
						reply[key] = res[key]
					}
					reply.mediaContentType = file.fileData.catFileType  //类型
				} else {
					//提示信息
					response.message && this.$message.error(response.message);
				}
			},
			//0608新增打开弹窗
			openMaterialModal() {
				if(this.pageParameters.needUpload) {
					return
				}
				 //0609新增弹窗
				this.$root.eventBus.$emit("modal_material_modal", {
					mediaReply: this.item.reply,
					catChooseShow: this.catChooseShow,
					modalId: this.modalId,
				})
			},
			//0608新增本地选择素材
			setCatChooseShow(replyType) {
				var res = {
						image: 'showPic',
						voice: 'showVoice',
						video: 'showVideo',
						file: 'showFile',
					}
					for(var key in res) {
						var value = res[key]
						this.catChooseShow[value] = (key == replyType) //设置是否展示
					}
			},
			chooseMaterial(obj1) {
				var obj = this.item.reply
				var res = obj1.materialObj
					for(var key in res) {
						obj[key] = res[key]
					}
//					obj.mediaContentType = res.mediaContentType  //类型
					obj.mediaType = setMediaType(obj.mediaContentType) //类型
			},
		},
		created() {

		},
		mounted() {
			 //0609新增弹窗
				this.$root.eventBus.$on("modal_material_modal_media", (obj) => {
					if(obj.modalId == this.modalId) {
						this.chooseMaterial(obj)
					}
				})
		},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug

			this.$root.eventBus.$off("modal_material_modal_media")
		},
	}
</script>
<style lang='less' scoped>
	@import '../assets/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	.instance-top-content {
		width: 100%;
		height: 198px;
		background: rgba(255, 255, 255, 1);
	}

	.upload-img {
		width: 116px;
		height: 116px;

		object-fit: cover;
		position: relative;
	}
	.upload-img-text {
		font-size:12px;
		color:rgba(0,0,0,0.65);
		line-height:22px;
		overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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
