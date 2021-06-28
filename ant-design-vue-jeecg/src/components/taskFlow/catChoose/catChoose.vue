<template>
	<!--选择素材的弹窗-->
	<a-modal  :maskClosable="false"   :visible="cspVisible" :footer="null" :id="id" :title="modalTitle" :width="780" :height="600" @cancel="confirmDelete" :bodyStyle="{paddingTop: '0px'}" :destroyOnClose="true">
		<a-spin :spinning="loading">
		<div v-if="showListArr.length">
				<div v-if="showListArr.length > 1" class="ant-tabs-nav-scroll" style="margin-bottom: 10px;">
			   <div v-for="(item,index) in showListArr" :key="index"  @click="changTab(item)" :class="{'ant-tabs-tab-focused' : (materialType == item), 'ant-tabs-tab-active' : (materialType == item),}" class="ant-tabs-nav">
			    <div v-if="materialType == item" class="ant-tabs-ink-bar ant-tabs-ink-bar-animated" style="visibility: visible; width: 60px; transform: translate3d(0px, 0px, 0px);" ></div>
			    <div class="ant-tabs-tab">
			     {{titlesMateria[item]}}
			    </div>
			   </div>
			 </div>

			<div label="图片" name="pic" v-show="catChooseShow.showPic && materialType == 'pic'">
				<div id="zhl_scroll" class="choose-template">
					<div v-if="!materialList.picAuthority">
						<div class="nodata">没有访问权限。</div>
					</div>
					<template v-else>
					<div v-if="materialList.picList" class="draw-flex-center pop-list1">
						<template v-if="materialList.picList.length == 0">
							<div class="nodata">暂无素材</div>
						</template>
						<template v-else>
							<div v-for="(img,index) in materialList.picList" :key="index" class="pop-listli" @click="selectThis(index)">
								<div class="template-li" v-bind:class="{ 'template-li-checked':img.checked}">
									<div class="template-litop-img">
										<img class="template-litop-img" :src="img.materialUrl" />
									</div>

									<!--0724新增左上角的素材状态--10.19 v1.2.1版本去掉素材状态-->
									<!--<div v-if="img.auditStatus" class="template-li-auditStatus" :style="auditStatusList[img.auditStatus].style">
											{{auditStatusList[img.auditStatus].title}}<a-icon v-if="img.auditStatus == '2'" type="info-circle" style="margin-left: 4px;"></a-icon>
									</div>-->

									<div v-if="img.checked" class="template-li-checkmark">
											<a-icon class="template-li-icon" type="check"  style="color: #fff;"></a-icon>
									</div>

									<div class="draw-text-two template-litop-title">
										{{img.fileName}}
									</div>
								</div>
							</div>
						</template>
					</div>
					</template>
				</div>
			</div>
			<div label="音频" name="voice" v-show="catChooseShow.showVoice && materialType == 'voice'">
				<div id="zhl_scroll1" class="choose-template">
					<div v-if="!materialList.voiceAuthority">
						<div class="nodata">没有访问权限。</div>
					</div>
					<template v-else>
					<div v-if="materialList.voiceList" class="draw-flex-center pop-list1">
						<template v-if="materialList.voiceList.length == 0">
							<div class="nodata">暂无素材</div>
						</template>
						<template v-else>
							<div v-for="(img,index) in materialList.voiceList" :key="index" class="pop-listli" @click="selectThis(index)">
								<div class="template-li" v-bind:class="{ 'template-li-checked':img.checked}">
									<div class="template-litop-img">
										<div class="chat-detail-cover"></div>
										<div class="position-center chat-detail-play"></div>
										<div class="position-center chat-detail-play1"></div>
										<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 18px; color: rgba(255,255,255,0.85);"></a-icon>
									</div>

									<!--0724新增左上角的素材状态--10.19 v1.2.1版本去掉素材状态-->
									<!--<div v-if="img.auditStatus" class="template-li-auditStatus" :style="auditStatusList[img.auditStatus].style">
											{{auditStatusList[img.auditStatus].title}}<a-icon v-if="img.auditStatus == '2'" type="info-circle" style="margin-left: 4px;"></a-icon>
									</div>-->

									<div v-if="img.checked" class="template-li-checkmark">
											<a-icon class="template-li-icon" type="check"  style="color: #fff;"></a-icon>
									</div>

									<div class="draw-text-two template-litop-title">
										{{img.fileName}}
									</div>
								</div>
							</div>
						</template>
					</div>
					</template>
				</div>
			</div>
			<div label="视频" name="video" v-show="catChooseShow.showVideo && materialType == 'video'">
				<div id="zhl_scroll2" class="choose-template">
					<div v-if="!materialList.videoAuthority">
						<div class="nodata">没有访问权限。</div>
					</div>
					<template v-else>
					<div v-if="materialList.videoList" class="draw-flex-center pop-list1">
						<template v-if="materialList.videoList.length == 0">
							<div class="nodata">暂无素材</div>
						</template>
						<template v-else>
							<div v-for="(img,index) in materialList.videoList" :key="index" class="pop-listli" @click="selectThis(index)">
								<div class="template-li" v-bind:class="{ 'template-li-checked':img.checked}">
									<div class="template-litop-img">
										<img v-if="img.thumbnailMediaUrl" class="template-litop-img" :src="img.thumbnailMediaUrl">
										<video v-else class="template-litop-img" :src="img.materialUrl"></video>

										<div class="chat-detail-cover"></div>
										<div class="position-center chat-detail-play"></div>
										<div class="position-center chat-detail-play1"></div>
										<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 18px; color: rgba(255,255,255,0.85);"></a-icon>
									</div>

									<!--0724新增左上角的素材状态--10.19 v1.2.1版本去掉素材状态-->
									<!--<div v-if="img.auditStatus" class="template-li-auditStatus" :style="auditStatusList[img.auditStatus].style">
											{{auditStatusList[img.auditStatus].title}}<a-icon v-if="img.auditStatus == '2'" type="info-circle" style="margin-left: 4px;"></a-icon>
									</div>-->

									<div v-if="img.checked" class="template-li-checkmark">
											<a-icon class="template-li-icon" type="check"  style="color: #fff;"></a-icon>
									</div>

									<div class="draw-text-two template-litop-title">
										{{img.fileName}}
									</div>
								</div>
							</div>
						</template>
					</div>
					</template>
				</div>
			</div>

			<div label="文件" name="file" v-show="catChooseShow.showFile && materialType == 'file'">
				<div id="zhl_scroll3" class="choose-template">
					<div v-if="!materialList.fileAuthority">
						<div class="nodata">没有访问权限。</div>
					</div>
					<template v-else>
					<div v-if="materialList.fileList" class="draw-flex-center pop-list1">
						<template v-if="materialList.fileList.length == 0">
							<div class="nodata">暂无素材</div>
						</template>
						<template v-else>
							<div v-for="(file,index) in materialList.fileList" :key="index" class="pop-listli" @click="selectThis(index)">
								<div class="template-li" v-bind:class="{ 'template-li-checked':file.checked}">
									<div class="template-litop-img">
										<img class="position-center file-img" src="../assets/fileIcon.png">
									</div>

									<!--0724新增左上角的素材状态--10.19 v1.2.1版本去掉素材状态-->
									<!--<div v-if="img.auditStatus" class="template-li-auditStatus" :style="auditStatusList[img.auditStatus].style">
											{{auditStatusList[img.auditStatus].title}}<a-icon v-if="img.auditStatus == '2'" type="info-circle" style="margin-left: 4px;"></a-icon>
									</div>-->

									<div v-if="file.checked" class="template-li-checkmark">
											<a-icon class="template-li-icon" type="check"  style="color: #fff;"></a-icon>
									</div>
									<div class="draw-flex-center file-material">
										<div class="draw-text-two template-litop-title" style="text-align: start;">{{file.fileName}}</div>
										<div style="width: 60px; text-align: end;">{{file.materialFileType}}</div>
									</div>
								</div>
							</div>
						</template>
					</div>
					</template>
				</div>
			</div>


		</div>
		</a-spin>

		<div class="section--pager">
			<a-pagination
				v-model="pager.currentPage"
				:total="pager.total"
				show-less-items
				show-quick-jumper
				show-size-changer
				:show-total="total => `共 ${total} 条`"
				@change="pageChange"
				@showSizeChange="sizeChange"
				size="small"
			/>
		</div>

		<slot name="footer">
			<div class="draw-pop-footer">
				<a-button :disabled="!fileList.checked" type="primary" @click="rejectConfirm" style="margin-right: 24px;">确认</a-button>
				<a-button @click="confirmDelete">取消</a-button>
			</div>
		</slot>
	</a-modal>
</template>
<script>
	var isTest = false //是否是测试环境
	import { AboutMaterial } from './aboutMaterial.js' //选择素材的弹窗

	//引入去除的正则表达式
	import { transformTime, checkURL, dealNoFileType, producedAllCaseCombination, removeEmoji, removeEmojiFrontSpace, removeEmojiAllSpaceChinese, removeEmojiHttpsChinese, getUUID, setMediaType, auditStatusList, querySelector } from '../assets/js/util.js' //时间戳转时间,用于排序

	import catDrawListData from '../cardType/catDrawListData'  //初始化media

	export default {
		name: 'catChoose',
		props: {
			botId: {
				type: String,
				default: '102658',
			},
			id: {
				type: String,
				default: '',
			},
//			//0608新增设置素材
//			materialList: {
//				type: Object,
//				default: function() {
//					return {
//						picList: [],
//						voiceList: [],
//						videoList: [],
//					}
//				},
//			},
			acceptUrl: {
				type: Object,
				default: function() {
					return {
						'queryMaterialsByType': '/material/listByMaterialType', //获取选择素材
					}
				},
			},
		},
		components: {
		},
		data: function() {
			return {
				maapApplyInfo: {
					botId: '',
					//					remark: '',
					chatbotName: ''
				},
				maapApplyValidate: {
					botId: [{
						required: true,
						message: '归属机器人不能为空',
						trigger: 'change'
					}, ],
				},
				chatbotList: [],
				uploadFileList: [],
				chatbotData: {
					chatbotName: ''
				},

				baseInfo: {
					templateName: '',
					templateDesc: '',
					templateLogo: '',
				},
				uploadType: {
					upLoadData: {
						mediaType: 'video',
					},
					mediaType: 'video',
					format: producedAllCaseCombination(['3gp', 'mp4']), //限制上传格式
					maxSize: 512000, //小于500m
					tishiTitle: '上传视频',
					accept: ".mp4, .3gp",
					data: {
						'mediaType': 'video',
						'botId': this.botId
					}
				},
				uploadTypePic: {
					upLoadData: {
						mediaType: 'pic',
					},
					mediaType: 'pic',
					format: producedAllCaseCombination(['jpg', 'gif', 'png', 'bmp']), //限制上传格式
					//					maxSize: 2048, //小于2m
					tishiTitle: '上传封面',
          accept: '.jpg, .gif, .png, .bmp',
					data: {
						'mediaType': 'pic',
						'botId': this.botId,
						isCoverPic: true,
					}
				},
				videoResponse: {},
				picResponse: {},

				fileList: {}, //选择的对象
				showLoading: false, //是否显示loading动画

								materialType: 'pic', //图片素材

				showListArr: [], //可以展示列表的权限
				catChooseShow: {
					showPic: true, //显示图片
						showVoice: true, //显示音频
						showVideo: true, //显示视频
				},
				modalId: '',

				titlesMateria: {
					pic: '图片',
					voice: '音频',
					video: '视频',
					file: '文件',
				},

				modalTitle: '选择素材',  //设置title名字

				auditStatusList, ////0724新增素材状态

				cspVisible: false, //显示弹窗

				//0819新增翻页功能
				pager: {
					currentPage: 1,
					total: 0,
					pageSize: 10,
					pageSizes: [10, 20, 50, 100]
				},
				materialList: {
						picList: [],
						voiceList: [],
						videoList: [],
						fileList: [],
						picAuthority: true,
						voiceAuthority: true,
						videoAuthority: true,
						fileAuthority: true,
				},
				loading: false, //显示loading
			}
		},
		computed:{
	    currentPage(){
	      return `${this.pagination.current}-${this.pagination.pageSize}`
	    }
	  },
		methods: {
			//改变当前的tab
			changTab(materialType) {
				this.materialType = materialType //设置类型

				this.clearPager()  //0819新增翻页素材
			},
			confirmDelete() {
//				//新增关闭弹窗
//				this.$root.eventBus.$emit("modal_visible_change_" + this.id)
				this.cspVisible = false  //关闭弹窗
			},
			rejectConfirm() {
				if(!this.fileList.checked) {
//		   		this.$message.info("未选择素材");
					this.picResponse = {}
					return  //0629新增未选择素材，不让提交
				} else {
					this.picResponse = this.fileList
				}

				this.confirmDelete() //关闭当前的弹窗

				 //0609新增弹窗
				this.$root.eventBus.$emit("modal_material_modal_media", {
					materialObj: this.picResponse.materialFileProperty || new catDrawListData.CatMedia(), //选择的素材obj
					modalId: this.modalId,
				})
			},
			selectThis: function(i, isTrue) {
				var materialType = this.materialType
				var list = this.materialList[materialType + 'List']
				list.forEach(function(t, index) {
					if(index != i) {
						t.checked = false;
					}
				})
				var obj = list[i]

//				obj.checked = true  //选中的状态
				if(isTrue) {
					obj.checked = isTrue
				} else {
					obj.checked = !obj.checked
				}

				this.fileList = obj.checked ? obj : {}
//				//清空其他2个tab下选择的
				this.clearOther(materialType)

				this.$set(this.materialList[materialType + 'List'], i, obj) //这里需要改变数组，需要使用$set
			},
			clearOther(materialType) {
				//清空其他2个tab下选择的
				var list1 = {
					'voice': ('voice' + 'List'),
					'pic': ('pic' + 'List'),
					'video': ('video' + 'List'),
					'file': ('file' + 'List'),
				}
				var list = {
					'pic': 'showPic',
					'voice': 'showVoice',
					'video': 'showVideo',
					'file': 'showFile',
				}
				for(var key in list1) {
					if(key != materialType && this.catChooseShow[list[key]]) {
						var value = list1[key]
						var arr = this.materialList[value] || []
						arr.forEach((t, i) => {
							var obj = t
							obj.checked = false;
							this.$set(this.materialList[value], i, obj) //这里需要改变数组，需要使用$set
						})
					}
				}
			},
			//得到所有的需展示list的数组
			showArr() {
				var list = {
						'pic': 'showPic',
						'voice': 'showVoice',
						'video': 'showVideo',
						'file': 'showFile',
					}
					var result = []
					for(var key in list) {
						if(this.catChooseShow[list[key]]) {
							result.push(key)
						}
					}
					this.showListArr = result
					this.materialType = this.showListArr[0] //显示第一个
					return result
			},
			setChooseStyle(obj) {
				this.setChooseStyleNew(obj)
			},
			//根据之前的去展示对应的选中状态
			setChooseStyleNew(obj) {
				var item = obj.mediaReply
				this.catChooseShow = obj.catChooseShow  //设置菜单
				this.modalId = obj.modalId
						//设置权限
					this.showArr()

				var materialId = item.materialId || ''
				this.materialId = materialId
				if(!materialId || !item.mediaUrl) {
					this.clearOther()

					//0629新增设置弹窗title
					this.setTitle()

					this.fileList = {}  //清空之前的数据
					return
				}

//				//0629新增没有添加mediaType
				var materialType = item.mediaType || setMediaType(item.mediaContentType)  //设置第几个tab

				this.materialType = materialType || 'pic'  //设置materialType

				//0629新增设置弹窗title
				this.setTitle()
			},
			//0629新增设置弹窗title
			setTitle() {
				var showListArr = this.showListArr || []
				var materialType = this.materialType || 'pic'
				var list = {
						'pic': '选择图片',
						'voice': '选择音频',
						'video': '选择视频',
						'file': '选择文件',
					}
				if(showListArr.length == 1) {
					this.modalTitle = list[materialType]
				} else {
					this.modalTitle = '选择素材'
				}

				this.clearPager()  //0819新增重新请求素材
			},
			//0829新增返回后设置选中状态
			setChooseMaterial() {
				var materialId = this.materialId
				if(!materialId) {
					return
				}
				var materialType = this.materialType || 'pic'

				var list1 = {
					'voice': ('voice' + 'List'),
					'pic': ('pic' + 'List'),
					'video': ('video' + 'List'),
					'file': ('file' + 'List'),
				}
				var list = this.materialList[list1[materialType]] || []
				var index = -1
				list.forEach((item1, i) => {
					if(item1.materialId == materialId) {
						index = i
					}
				})
				if(index > -1) {
					this.selectThis(index, true)
				}
			},
			pageChange(page){
				this.pager.currentPage = page

				this.getAllMaterial()
			},
			sizeChange(page, size){
				this.pager.currentPage = page
				this.pager.pageSize = size

				this.getAllMaterial()
			},
			//清空原来数据
			clearPager() {
				this.pager.currentPage = 1
				this.pager.total = 0
				this.pager.pageSize = 10
				this.getAllMaterial()
			},
			 //0608新增获取所有的素材列表
			getAllMaterial() {
				this.loading = true
				return new Promise((resolve, reject) => {
					this.aboutMaterial.getMaterials(this.materialType, '', {
						pageNo: this.pager.currentPage,
						pageSize: this.pager.pageSize,
					}).then((res) => {
						let { total, records = [] } = res.result

						this.pager.total = total

						this.setChooseMaterial()  //设置选中的状态

						this.scrollTop()//0915新增滚动到顶部

						this.loading = false
						resolve()
					}).catch(() => {
						this.loading = false
					})
				})
			},
			//0915新增滚动到顶部
			scrollTop() {
				//原来只是打开弹窗的时候，会滚动到顶部
				this.$nextTick(() => {
					if(querySelector('#zhl_scroll')) {
						querySelector('#zhl_scroll').scrollTop = 0
					}
					if(querySelector('#zhl_scroll1')) {
						querySelector('#zhl_scroll1').scrollTop = 0
					}
					if(querySelector('#zhl_scroll2')) {
						querySelector('#zhl_scroll2').scrollTop = 0
					}
					if(querySelector('#zhl_scroll3')) {
						querySelector('#zhl_scroll3').scrollTop = 0
					}
				})
			},

		},
		created() {
			this.aboutMaterial = new AboutMaterial(this)
		},
		mounted() {},
		destroyed() {
			this.$root.eventBus.$off("modal_material_modal_media")  //0624新增销毁eventBus
		},
	}
</script>
<style lang='less' scoped>
	@import '../assets/css/default.css';
	@default: #E2E2E2;
	.add-button {
		width: 100%;
		margin-top: 24px;
	}

	.draw-upload-title {
		height: 22px;
		line-height: 22px;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.43);
		margin-top: 5px;
	}
	/*0601新增样式*/

	.upload-frame {
		width: 482px;
		height: 226px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px;
		flex-direction: column;
	}

	.upload-frame-div {
		/deep/ .ant-upload-drag {
			border: 1px solid rgba(151, 151, 151, 0.15);
		}
	}

	.upload-before {
		width: 278px;
		height: 156px;
		border-radius: 4px;
		border: 1px dashed rgba(0, 0, 0, 0.15);
		flex-direction: column;
	}

	.play-video-icon {
		width: 36px;
		height: 36px;
		background: #EBEEF5;
		border-radius: 4px;
	}
	/*0604新增样式*/

	.search-li {
		margin-left: 24px;
	}

	.search-li-title {
		width: 84px;
		text-align: end;
	}

	.phone-input {
		width: 274px;
	}

	.template-ul {
		flex-wrap: wrap;
	}

	.template-li {
		/*width: 312px;*/
		/*width: 200px;*/
		height: 210px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 2px 2px 16px 0px rgba(0, 0, 0, 0.05);
		border-radius: 2px;
		position: relative;
		overflow: hidden;
	}

	.template-litop-img {
		width: 100%;
		/*width: 312px;*/
		/*width: 200px;*/
		height: 154px;
		position: relative;
		object-fit: contain;
	}

	.template-litop-title {
		width: 100%;
		height: 56px;
		line-height: 56px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.9);
		text-align: center;
		-webkit-line-clamp: 1;
		white-space: inherit;
	}

	.choose-template {
		max-height: 520px;
		overflow-y: auto;
		background: #fff;

		height: 480px;
		overflow: auto;
	}

	.pop-list1 {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		padding-top: 2px;
		padding-left: 2px;
		.pop-listli {
			flex-basis: 50%;
			margin-bottom: 36px;

			padding-right:48px ;
		}
	}


	.nodata {
		width: 100%;
		text-align: center;
		margin: 100px 0;
	}

	.outline-blank {
		position: absolute;
		top: 17px;
		right: 104px;
	}

	.img-checked {
		display: block;
		background-color: rgba(67, 129, 230, 0.2) !important;
		box-shadow: none !important;
	}
	/*0608新增选择素材*/
	.chat-detail-cover {
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(169, 170, 177, 0.25);
		width: 100%;
		height: 100%;
	}

	.chat-detail-play {
		width: 50px;
		height: 50px;
		background: rgba(0, 0, 0, 0.65);
		border-radius: 50%;
		opacity: 0.3;
	}

	.chat-detail-play1 {
		width: 30px;
		height: 30px;
		background: rgba(255, 255, 255, 1);
		border-radius: 50%;
		opacity: 0.25;
	}

	.position-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		/*0821去除小手状态*/
		cursor:default;
	}
	/*0624修改选中状态*/
	.template-li:hover {
		border: 1px solid rgba(24,144,255,0.5);
	}
	.template-li-checked {
		border: 2px solid #1890ff !important;
	}
	.template-li-checkmark {
		position: absolute;
		right: 0;
		top: 0;

		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 36px 36px 0;
		border-color: transparent #1890ff transparent transparent;
	}
	.template-li-icon {
		position: absolute;
		right: -33px;
    top: 2px;
	}

	/*0724新增素材状态*/
	.template-li-auditStatus {
		position: absolute;
		left: 0;
		top: 0;

		width: 120px;
		height: 32px;
		line-height: 32px;
		background-color: rgba(82, 187, 144, 1);
		color: rgba(255, 255, 255, 1);
		font-size: 14px;
		text-align: center;
		font-family: Roboto;
	}
	/*设置底部翻页的样式*/
	.section--pager {
		padding: 10px 15px;
    text-align: right;
	}
	.file-img {
		width: 48px;
		height: 48px;
	}
	.file-material {
		padding: 0 10px;
		justify-content: space-between;
	}
</style>
