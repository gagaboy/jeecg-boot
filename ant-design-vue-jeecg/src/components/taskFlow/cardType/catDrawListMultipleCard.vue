<template>
	<div :style="listStyle">
		<div style="padding: 16px 16px;">
			<div class="draw-flex-center" style="justify-content: flex-start; ">
				<div class="single-card-title single-card-title-top">宽：</div>
				<a-radio-group v-model="reply.cardWidth" size="small">
					<a-radio v-for="(val,key,index) in widths" :key="index" :label="key" :value="key" style="font-size: 12px;">
						{{val}}
					</a-radio>
				</a-radio-group>
			</div>
			<!--小宽仅有大/小两个选项-->
			<div v-show="reply.cardWidth != 'SMALL_WIDTH'" class="draw-flex-center" style="justify-content: flex-start;">
				<div class="single-card-title single-card-title-top">高：</div>
				<a-radio-group v-model="reply.cardHeight" @change="onChange" size="small">
					<a-radio v-for="(val,key,index) in heights" :key="index" :label="key" :value="key" style="font-size: 12px;">
						{{val}}
					</a-radio>
				</a-radio-group>
			</div>
			<div v-show="reply.cardWidth == 'SMALL_WIDTH'" class="draw-flex-center" style="justify-content: flex-start;">
				<div class="single-card-title single-card-title-top">高：</div>
				<a-radio-group v-model="reply.cardHeight" @change="onChange" size="small">
					<a-radio v-for="(val,key,index) in heights1" :key="index" :label="key" :value="key" style="font-size: 12px;">
						{{val}}
					</a-radio>
				</a-radio-group>
			</div>

		</div>
		<div style="border-top: 1px solid #EBEEF5; ">
			<div v-for="(item, index) in reply.cards" :key="index" style="padding: 0 16px; ">
				<div style="border: 1px dashed #EBEEF5; margin-top: 16px;">
					<div class="draw-flex-center instance-top" style="border-bottom: 1px solid #EBEEF5;">
						<!--新增-->
						<div class="draw-flex-center add-content-txt" style="font-size: 12px; margin-left: 0; margin-right: 18px; color: inherit">
							多卡{{index + 1}}
						</div>
						<div>
							<!--<Icon @click="removeList(index)" class="draw-cursor-pointer" type="trash-b" size="16"></Icon>-->
							<a-icon @click="removeList(index)" class="draw-cursor-pointer" type="delete" size="16"></a-icon>
						</div>
					</div>

					<div style="padding: 16px; background: #FAFAFA;">
						<div class="draw-flex-center" style="justify-content: flex-start; margin-bottom: 18px; position: relative;">
						<div class="single-card-title single-card-title1">标题：</div>
						<div class="txt-limit-div txt-limit-div1" style="">
							<!--<roInputAboutQuoteOne  :inputAboutQuoteOne="item" quoteKey='originalTitle' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :maxlength="24" :showQuote="pageParameters.showQuote" :showQuoteEmoji="true" placeholder="请输入标题"></roInputAboutQuoteOne>-->
							<roInputAboutQuoteOne  :inputAboutQuoteOne="item" quoteKey='originalTitle' :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :maxlength="pageParameters.showQuote ? 0 : 24" :showQuote="pageParameters.showQuote" :showQuoteEmoji="true" placeholder="请输入标题"></roInputAboutQuoteOne>
						</div>
					</div>
					<div class="draw-flex-center" style="justify-content: flex-start; margin-bottom: 18px; position: relative;">
						<div class="single-card-title single-card-title1">描述：</div>
						<!--新增引用的内容-->
						<div class="txt-limit-div1 text-description" >
							<roInputAboutQuoteOne :inputAboutQuoteOne="item" quoteKey='originalDescription' type="textarea" :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :showQuote="pageParameters.showQuote" :showQuoteEmoji="true" placeholder="请输入描述"></roInputAboutQuoteOne>
						</div>
					</div>
					<div class="draw-flex-center" style="justify-content: flex-start; margin-bottom: 18px; position: relative;">
						<div class="single-card-title single-card-title1">媒体：</div>
						<div style="padding-left: 40px;">
							<!--<ro-upload :disabled="!pageParameters.needUpload" type="drag" field="mediaUrl"  ref="upload" :takeParameters="{'index': index}" :show-upload-list="false" :on-success="handleSuccess" :data="item.media" :format="uploadType.format" :accept="uploadType.accept" :max-size="uploadType.maxSize" sendKey="ajaxUpload"-->
						<ro-upload :disabled="!pageParameters.needUpload" type="drag" field="mediaUrl"  ref="upload" :takeParameters="{'index': index}" :show-upload-list="false" :on-success="handleSuccess" :data="copyObj" :format="uploadType.format" :accept="uploadType.accept" :max-size="uploadType.maxSize" sendKey="ajaxUpload"
								:before-upload="handleUpload" id="ImportTargetForm_fileUrl" fieldTitle="上传文件" :validate="'required'" :deleteFailFile="true" :autoUpload="true" :action="acceptUrl.uploadFiles">
								<div @click="openMaterialModal(index)" class="draw-flex-center" style="height: 78px; width: 141px;flex-direction: column; background: #FAFAFA; font-size: 12px;">
									<!--已上传后显示-->
									<template v-if='item.media && item.media.mediaUrl || item.media.thumbnailMediaUrl'>
										<img v-if="item.media.mediaType == 'pic'" class="upload-img" :src="item.media.mediaUrl" />
										<img v-else-if="item.media.mediaType == 'voice'" class="upload-img" :src="require('../assets/audioIcon.png')" />
										<!--<img v-else-if="item.media.mediaType == 'video'" class="upload-img" :src="item.media.thumbnailMediaUrl"></img>-->
										<!--0630新增视频提示-->
										<div v-else-if="item.media.mediaType == 'video'" class="upload-img" style="position: relative;">
											<img class="upload-img" :src="item.media.thumbnailMediaUrl"></img>
											<!-- 视频蒙层 -->
						          <div class="play-icon">
						            <img class="loop-card-play" :src="require('../assets/cardPlay.png')" alt="" />
						          </div>
										</div>

										<div class="upload-img-text" style="width: 130px;">{{item.media.fileName}}</div>
									</template>
									<!--上传前-->
									<template v-else >
											<!--<Icon type="ios-plus-empty" size="52" style="color: #260000"></Icon>-->
											<a-icon type="plus" style="color: #260000; font-size: 30px;"></a-icon>
											<p class="draw-upload-title">{{pageParameters.needUpload ? uploadType.tishiTitle : uploadType.tishiTitle1}}</p>
									</template>
								</div>
							</ro-upload>
						</div>
					</div>
						<!--添加菜单按钮-->
						<catDrawListAddButton :buttons="item.buttons" class="list-add-button"  style="margin-top: 8px; font-size: 12px;"  :nodeList="nodeList" :otherNodeList="otherNodeList" :nowNode="nowNode" :pageParameters="pageParameters" :showQuote="pageParameters.showQuote"></catDrawListAddButton>
					</div>
				</div>
			</div>
			<div style="padding: 0 16px;">
				<div v-if="!showMaxCardsTishi"  @click="clickAll" data-type="addList" class="draw-flex-center draw-cursor-pointer add-button" style="border: 1px dashed #EBEEF5; margin: 16px 0;">
					<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
					添加卡片
				</div>
				<div v-else class="draw-flex-center draw-cursor-pointer add-button" style="border: 1px dashed #EBEEF5; margin: 16px 0; color:#A9AAB1">
					<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
					卡片数量已达上限
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import catDrawListAddButton from './catDrawListAddButton' //添加菜单

		import catDrawListData from './catDrawListData'  //添加卡片的class

		import roInputAboutQuoteOne from '../roInputAboutQuoteOne/roInputAboutQuoteOne'  //新增带上引用和emoji输入的input输入框

		import {dealNoFileType, producedAllCaseCombination, getUUID, setMediaType} from '../assets/js/util'  ////处理没有file.type的问题

		import roUpload from '../roUpload' //ivew多文件上传组件

	export default {
		name: 'catDrawListMultipleCard', //图片，音频和视频
		components: {
			catDrawListAddButton,

			roInputAboutQuoteOne,

			roUpload,
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
			//多卡
			reply: {
				type: Object,
				default: function() {
					return {
						"cardWidth": "", //SMALL_WIDTH
						cards: [
				      {
				        "media": {
				          "mediaUrl": "",
				          "mediaContentType": "image/png",
				          "height": ""
				        },
				        "title": "",
				        "description": "",
				        "buttons": [
				        ]
				      }
				    ],
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
		},
		data: function() {
			return {
				widths: {
					'MEDIUM_WIDTH': '大',
					'SMALL_WIDTH': '小',
				},
				heights: {
					'TALL_HEIGHT': '大',
					'MEDIUM_HEIGHT': '中',
					'SHORT_HEIGHT': '小',
				},
				heights1: {
					'TALL_HEIGHT': '大',
					'SHORT_HEIGHT': '小',
				},
				uploadType: {
					upLoadData: {
						mediaType: 'pic', //	图片就是pic，音频是audio，视频是video
					},
					format: producedAllCaseCombination(['jpg','gif','png', 'bmp', 'mp3','amr', '3gp','mp4']),
					accept: '.jpg, .gif, .png, .bmp, .mp3, .amr, .mp4, .3gp',
//					maxSize: 10240,  //小于10m
					maxSize: 512000,  //小于500m
					tishiTitle: '上传图片/视频/音频',
					tishiTitle1: '选择图片/视频/音频',
				}, //上传的要求

				maxCardsLen: 10, //多卡最多10个
				showMaxCardsTishi: false, //是否显示最多的提示

				//0608新增本地选择素材
				modalId: getUUID(),
				//显示顶部的菜单栏
				catChooseShow: {
						showPic: true, //显示图片
						showVoice: true, //显示音频
						showVideo: true, //显示视频
					},
					chooseIndex: 0,

					copyObj: {
						mediaType: 'pic'
					}, //0624新增保存修改的素材
			}
		},
		watch:{
		  reply: {
		      handler(newName, oldName) {
						if(newName && newName.cards && newName.cards.length) {
							var len = newName.cards.length
							if(len >= this.maxCardsLen) {
								this.showMaxCardsTishi = true
							} else {
								this.showMaxCardsTishi = false
							}
						}
		      },
		      immediate: true,
		      deep: true
		  },
		},
		methods: {
			onChange(e) {
				var val = e.target.value
				var cards = this.reply.cards || []
				cards.forEach((item) => {
					item.media.height = val  //设置到界面中去
				})
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
			//添加多卡
			addList() {
				var that = this
				var Card = catDrawListData.Card
				this.reply.cards.push(new Card())
			},
			removeList(index) {
				var that = this
				this.reply.cards.splice(index, 1)
			},
			//新增上传组件
			handleUpload(file, takeParameters) {
				dealNoFileType(file)

//				//0624新增复制之前的素材
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
				this.$message.error({
          content: '上传文件异常提醒',
					desc: '您的文件' + file.name + '未上传成功！',
					duration: 0
				});
			},
			handleSuccess(response, file, fileList, takeParameters) {
				this.$Spin.hide();
				document.body.style.overflow = 'auto'
				if(response.status == '0') {
					this.$message.success("文件上传成功");
					var index = takeParameters.index || 0
					var obj = this.reply.cards[index].media
					var res = response.result
					for(var key in res) {
						obj[key] = res[key]
					}
					obj.mediaContentType = file.fileData.catFileType  //类型
						//设置类型
					obj.mediaType = setMediaType(file.fileData.catFileType)
				} else {
					 this.$message.error(response.message);
				}
		},
//			//0608新增打开弹窗
			openMaterialModal(index) {
				if(this.pageParameters.needUpload) {
					return
				}

				this.chooseIndex = index  //0624新增多卡选择素材
				//0609新增弹窗
				this.$root.eventBus.$emit("modal_material_modal", {
					mediaReply: this.reply.cards[index].media,
					modalId: this.modalId,
				})
			},
			chooseMaterial(obj1) {
				var index = this.chooseIndex || 0// 设置选择的index
					var obj = this.reply.cards[index].media
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
	/*新增*/
	.add-content {
		height: 46px;
		font-size: 14px;
		line-height: 22px;
		justify-content: flex-start;
		padding: 0 16px;
		cursor: pointer;

		height: inherit;
		justify-content: flex-start;
		padding: 17px 16px;
		border-bottom: 1px solid @defaultBorder;
	}

	.add-content-icon {
		margin-right: 6px;
	}

	.instance {
		border-bottom: 1px solid @defaultBorder;
	}

	.instance-input {
		/deep/ .ant-input {
			border: none !important;
			height: 112px !important;
			padding: 12px 16px !important;
		}
	}

	.instance-top {
		height: 36px;
		line-height: 36px;
		justify-content: space-between;
		background: #FAFAFA;
		padding: 0 16px;
	}

	.instance-top-link {
		margin-right: 15px;
		transform: rotate(-45deg);
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
	/*新增组件css*/
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
	.add-content-txt {
		font-size: 14px;
		color: rgba(24, 144, 255, 1);
		margin-left: 20px;
	}

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
	.add-button {
		height: 46px;
		background: rgba(0, 0, 0, 0.02);
		border-radius: 4px;
		font-size: 12px;
		color: rgba(24, 144, 255, 1);
		line-height: 46px;
		margin: 0 auto;
	}
	.txt-limit-div1 {
		position: relative;
		width: 100%;
		padding-left: 40px;

		/*0814修改样式*/
		/deep/ .ant-input {
	    font-size: 12px;
	    min-height: auto;
		}
		/deep/ .txt-limit {
	    font-size: 12px;
		}
	}
	.single-card-title {
		width: 40px;
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
	.single-card-title-top {
		width: 27px;
		height: 30px;
		line-height: 30px;
	}

	/*新增去除描述提示*/
	/*.text-description {
		/deep/ .ant-input {
	    font-size: 12px;
	    min-height: auto;
		}
	}*/

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

	.list-add-button {
		/deep/ .ant-input {
			font-size: 12px;
		}
		/deep/ .add-content {
			font-size: 12px;
		}
		/deep/ .ant-select {
			font-size: 12px;
		}
	}
</style>
