<template>
	<div :style="listStyle">
		<div style="padding: 16px 16px;">
					<div class="flex-center" style="justify-content: flex-start; margin-bottom: 18px; position: relative;">
						<div class="single-card-title single-card-title1 required">标题：</div>
						<div class="txt-limit-div txt-limit-div1" style="">
							<roInputAboutQuoteOne :inputAboutQuoteOne="reply.card" quoteKey='originalTitle' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :maxlength="24" :showQuote="pageParameters.showQuote" :showQuoteEmoji="true" :showQuoteVarText="true"></roInputAboutQuoteOne>
						</div>
					</div>

					<div class="flex-center" style="justify-content: flex-start; margin-bottom: 18px; position: relative;">
						<div class="single-card-title single-card-title1" style="padding-left: 12px;">描述：</div>
						<div class="txt-limit-div1 text-description" >
							<roInputAboutQuoteOne :inputAboutQuoteOne="reply.card" quoteKey='originalDescription' type="textarea" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :showQuote="pageParameters.showQuote" :showQuoteEmoji="true" :showQuoteVarText="true"></roInputAboutQuoteOne>
						</div>
					</div>
					<div class="flex-center" style="justify-content: flex-start; margin-bottom: 18px; position: relative;">
						<div class="single-card-title single-card-title1" style="padding-left: 12px;">素材：</div>
						<div style="padding-left: 50px;">
							<!--<ro-upload :disabled="!pageParameters.needUpload" type="drag" field="mediaUrl"  ref="upload" :show-upload-list="false" :on-success="handleSuccess" :data="reply.card.media" :format="uploadType.format" :accept="uploadType.accept" :max-size="uploadType.maxSize" sendKey="ajaxUpload" :before-upload="handleUpload" id="ImportTargetForm_fileUrl" fieldTitle="上传文件" :validate="'required'" :deleteFailFile="true" :autoUpload="true" :action="acceptUrl.uploadFiles">-->
							<ro-upload :disabled="!pageParameters.needUpload" type="drag" field="mediaUrl"  ref="upload" :show-upload-list="false" :on-success="handleSuccess" :data="copyObj" :format="uploadType.format" :accept="uploadType.accept" :max-size="uploadType.maxSize" sendKey="ajaxUpload" :before-upload="handleUpload" id="ImportTargetForm_fileUrl" fieldTitle="上传文件" :validate="'required'" :deleteFailFile="true" :autoUpload="true" :action="acceptUrl.uploadFiles">
								<div @click="openMaterialModal" class="flex-center" style="width: 141px; height: 78px; flex-direction: column; background: #FAFAFA;">
									<!--已上传后显示-->
									<template v-if='reply.card.media && reply.card.media.mediaUrl || reply.card.media.thumbnailMediaUrl'>
										<img v-if="reply.card.media.mediaType == 'image'" class="upload-img" :src="reply.card.media.cspMediaUrl || reply.card.media.imosMediaUrl || reply.card.media.mediaUrl" />
										<img v-else-if="reply.card.media.mediaType == 'audio'" class="upload-img" src="~@/assets/img/audioIcon.png" />
										<!--<img v-else-if="reply.card.media.mediaType == 'video'" class="upload-img" :src="reply.card.media.thumbnailMediaUrl"></img>-->
										
										<!--0630新增视频提示-->
										<div v-else-if="reply.card.media.mediaType == 'video'" class="upload-img" style="position: relative;">
											<img class="upload-img" :src="reply.card.media.cspThumbnailMediaUrl || reply.card.media.thumbnailMediaUrl"></img>
											<!-- 视频蒙层 -->
						          <div class="play-icon">
						            <img class="loop-card-play" src="~@/assets/img/cardPlay.png" alt="" />
						          </div>
										</div>
										
										<div class="upload-img-text" style="width: 130px;">{{reply.card.media.fileName}}</div>
									</template>
									<!--上传前-->
									<template v-else >
											<!-- <Icon type="ios-plus-empty" size="52" style="color: #260000"></Icon> -->
											<a-icon type="plus"   style="color: #260000;font-size:30px;padding-top: 20px;"/>
											<p class="upload-title" style="font-size:12px;color:#515a6e;">{{pageParameters.needUpload ? uploadType.tishiTitle : uploadType.tishiTitle1}}</p>
									</template>
								</div>
							</ro-upload>
						</div>
					</div>

					<div class="flex-center" style="justify-content: flex-start; position: relative;">
						<div class="single-card-title single-card-top required">布局：</div>
						<!-- <RadioGroup v-model="reply.cardOrientation" @on-change="onChangeCardOrientations">
							<Radio v-for="(val,key,index) in cardOrientations" :key="index" :label="key">
								{{val}}
							</Radio>
						</RadioGroup> -->
						<a-radio-group v-model="reply.cardOrientation" @change="onChangeCardOrientations">
							<a-radio v-for="item in cardOrientations" :key="item.id"  :value="item.value" :disabled="item.disabled">
								<span>{{item.label}}</span>
							</a-radio>
						</a-radio-group>
					</div>
					<!--0618单卡的横向布局隐藏尺寸设置，先设置一个默认值-->
					<div v-show="reply.cardOrientation == 'VERTICAL'" class="flex-center" style="justify-content: flex-start;  position: relative;">
						<div class="single-card-title single-card-top required">尺寸：</div>
						<!-- <RadioGroup v-model="reply.height" @on-change="onChange">
							<Radio v-for="(val,key,index) in sizes" :key="index" :label="key">
								{{val}}
							</Radio>
						</RadioGroup> -->
						<a-radio-group v-model="reply.height" @change="onChange">
							<a-radio v-for="item in sizes" :key="item.id"  :value="item.value" :disabled="item.disabled">
								<span>{{item.label}}</span>
							</a-radio>
						</a-radio-group>
					</div>

					<!--添加菜单按钮-->
					<catDrawListAddButton :buttons="reply.card.buttons" style="margin-top: 8px;" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :pageParameters="pageParameters" :showQuote="pageParameters.showQuote"></catDrawListAddButton>
			</div>
	</div>
</template>
<script>
	import catDrawListAddButton from './catDrawListAddButton'  //添加菜单

	// import roInputAboutQuoteOne from '../../roInputAboutQuoteOne/roInputAboutQuoteOne'  //新增带上引用和emoji输入的input输入框
	import roInputAboutQuoteOne from '@comp/taskFlow/roInputAboutQuoteOne/roInputAboutQuoteOne'
	import {dealNoFileType, producedAllCaseCombination, getUUID, deepCloneCat, setMediaType } from '../../util'  ////处理没有file.type的问题

	import catDrawListData from './catDrawListData'  //初始化media
	import roUpload from '../../roUpload/upload'
	export default {
		name: 'catDrawListSimpleCard', //图片，音频和视频
		components: {
			catDrawListAddButton,
			roInputAboutQuoteOne,
			roUpload
		},
		props: {
			currentIndex: {
				type: Number,
				default: 0, //请求的地址
			},
			aboutObj: Object, //需要传递过来的值
			nodeList: Array, //数组
			otherNodeList: Array,
			nowNode: Object, //新增当前节点的数据，用于去除当前的节点

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
			reply: {
				type: Object,
				default: function() {
					return {
								cardOrientation: '',
								imageAlignment: '',
								height: '',  //改变之后去改变下面的值
								card: {
									media: {
										mediaUrl: '',
										mediaContentType: "image/png",
										height: '',
									},
									title: '',
									description: '',
									buttons: [
//							        {
//							          "type": "reply",
//							          "description": "文案",
//							          "content": "回复内容/链接"
//							        }
							     ]
								}
							}
				},
			},

			//新增页面传递过去的参数
			pageParameters: {
				type: Object,
				default: function() {
					return {}
				},
			},
			propsName: String
		},
		data: function() {
			return {
				cardOrientations: [
					{label:'横向', value:'HORIZONTAL'},
					{label:'纵向', value:'VERTICAL'}
				],
				sizes: [
					{label:'大', value:'TALL_HEIGHT'},
					{label:'中', value:'MEDIUM_HEIGHT'},
					{label:'小', value:'SHORT_HEIGHT'},
				],
				uploadType: {
					mediaType: 'image', //	图片就是image，音频是audio，视频是video
					format: producedAllCaseCombination(['jpg','gif','png', 'bmp', 'mp3','amr', '3gp','mp4']),
					accept: '.jpg, .gif, .png, .bmp, .mp3, .amr, .mp4, .3gp',
//					maxSize: 10240,  //小于10m
					maxSize: 512000,  //小于500m
					tishiTitle: '上传图片/音频/视频',
					tishiTitle1: '选择图片/音频/视频',
				}, //上传的要求

				//0608新增本地选择素材
				modalId: getUUID(),
				
				copyObj: {
					mediaType: 'image'
				}, //0624新增保存修改的素材
			}
		},
		methods: {
			onChange(e) {
				let val = e.target.value
				this.reply.card.media.height = val  //设置到界面中去
				this.reply.height = val
			},
			onChangeCardOrientations(e) {
				let val = e.target.value
				//横向的时候，给一个默认值，因为终端不用去设置，但是机器人那里需要展示
				this.reply.cardOrientation = val
				if(val == 'HORIZONTAL') {
					this.reply.height = 'SHORT_HEIGHT'
					this.reply.card.media.height = 'SHORT_HEIGHT'  //设置到界面中去
				}
			},
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
				//0624新增复制之前的素材
				this.copyMedia(file)
				return true
			},
			//0624新增复制之前的素材
			copyMedia(file) {
				var that = this
					this.$set(this.copyObj, 'mediaType', setMediaType(file.catFileType))
			},
			handleRemove(file) {
				for(var i = 0; i < this.uploadFileList.length; i++) {
					if(this.uploadFileList[i].fileName == file.name) {
						this.uploadFileList.splice(i, 1);
					}
				}
			},
			handleError(error, file) {
				this.$Spin.hide();
				document.body.style.overflow = 'auto'
				this.$Notice.error({
					title: '上传文件异常提醒',
					desc: '您的文件' + file.name + '未上传成功！',
					duration: 0
				});
			},
			handleSuccess(response, file, fileList) {
				this.$Spin.hide();
				document.body.style.overflow = 'auto'
				if(response.status == '0') {
					this.$Message.success("文件上传成功");
					var obj = this.reply.card.media
					var res = response.result
					for(var key in res) {
						obj[key] = res[key]
					}
					obj.mediaContentType = file.fileData.catFileType  //类型

//						//设置类型
					obj.mediaType = setMediaType(file.fileData.catFileType)
				} else {
					 this.$Message.error(response.message);
				}
		},
		//0608新增打开弹窗
			openMaterialModal() {
				if(this.pageParameters.needUpload) {
					return
				}

				//0609新增弹窗
				this.$root.eventBus.$emit("modal_material_modal"+this.propsName, {
					mediaReply: this.reply.card.media,
					modalId: this.modalId,
					catChooseShow: {
						showimage: true, //显示图片
						showaudio: true, //显示音频
						showVideo: true, //显示视频
						showFile: false, //显示文件
					},
				})
			},
			chooseMaterial(obj1) {
				var obj = this.reply.card.media
				var res = obj1.materialObj
					for(var key in res) {
						obj[key] = res[key]
					}
//					obj.mediaContentType = res.fileContentType  //类型
					obj.mediaType = setMediaType(obj.mediaContentType)
			},
		},
		created() {
			
		},
		mounted() {
			//0609新增弹窗
				this.$root.eventBus.$on("modal_material_modal_media"+this.propsName, (obj) => {
						if(obj.modalId == this.modalId) {
							this.chooseMaterial(obj)
						}
				})
		},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
			this.$root.eventBus.$off("modal_material_modal_media"+this.propsName)
		},
	}
</script>
<style lang='less' scoped>
	@import '../../asset/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	.txt-limit-div1 {
		position: relative;
		width: 100%;
		padding-left: 50px;
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
	/*新增组件*/
	.upload-img {
		width: 50px;
		height: 50px;

		object-fit: cover;
	}
	.upload-img-text {
		font-size:12px;
		color:rgba(0,0,0,0.65);
		line-height:22px;
		overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
	}
	/*单卡和多卡*/
	.single-card-title {
		width: 50px;
		height: 32px;
		line-height: 32px;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.85);
	}
	.single-card-title1 {
		position: absolute;
		top: 0;
		left: 0;
	}
	.single-card-top {
		height: 30px;
	}
	/*新增去除描述提示*/
	.text-description {
		/deep/ .ivu-input {
	    font-size: 12px;
	    min-height: auto;
		}
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
	.required::before {
		display: inline-block;
		margin-right: 4px;
		color: #f5222d;
		font-size: 14px;
		font-family: SimSun, sans-serif;
		line-height: 1;
		content: '*';
	}
</style>
