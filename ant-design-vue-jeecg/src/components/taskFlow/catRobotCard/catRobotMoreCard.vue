<template>
	<div class="cat-robot-content" :class="catRobotMoreCardId" style="margin-bottom: 12px;">
	<div  class="draw-flex-center more-card" :class="response.length > 1 ? 'more-list' : '' " >
    <!-- 单卡 -->
    <div v-if="msgType == 'singleCard'"  class="draw-flex-center cropper more-list-li ">
      <template v-for="(item, index) in response" >
      <!-- 单卡垂直 -->
      <template v-if="layout.cardOrientation == 'VERTICAL'">
        <div @click="playVideo(index)" class="loop-img-play draw-cursor-pointer">
          <img v-if="item.media.cspMediaUrl" class="draw-cat-more-card-img cropper-img" :class="response[0].media.height" :src="item.media.cspMediaUrl" alt="" />
          	<!--<div v-else class="cropper-img" style="height: 1px;"></div>-->
          <!-- 蒙层 -->
          <div v-if="item.media.mediaType != 'pic'" class="play-icon">
            <img v-if="item.media.mediaType == 'video'" class="loop-card-play" :src="require('../assets/cardPlay.png')" alt="" />
            <img v-else-if="item.media.mediaType == 'voice'" class="loop-card-play" :src="require('../assets/cardPlayAudio.png')" alt="" />
          </div>
        </div>
        <div class="text-one cropper-title">
          {{item.title}}
        </div>
        <div v-if="item.description" class="div-long-text div-long-text1">
          <div class="text-one cropper-content long-text" :data-index="index">
            {{item.description}}
          </div>
          <span v-if="item.showMoreText" @click="showLongText(index)" class="more-text" :class="[ showPop ? 'cropper-button-notclickable' : '' ]">
            ...全文&nbsp;
          </span>
        </div>
      </template>

      <!-- 单卡水平 -->
      <div v-else-if="layout.cardOrientation == 'HORIZONTAL'" class="cropper-section">
        <!-- 图片显示在左边 -->
        <div v-if="layout.imageAlignment == 'LEFT'" @click="playVideo(index)" class="loop-img-play draw-cursor-pointer">
          <img v-if="item.media.cspMediaUrl" class="draw-cat-more-card-img cropper-level-img " :class="response[0].media.height"  :src="item.media.cspMediaUrl" alt="" />
          <!--<div v-else class="cropper-level-img " style="height: 1px;"></div>-->
          <!-- 蒙层 -->
          <div v-if="item.media.mediaType != 'pic'" class="play-icon">
            <img v-if="item.media.mediaType == 'video'" class="loop-card-play" :src="require('../assets/cardPlay.png')" alt="" />
            <img v-else-if="item.media.mediaType == 'voice'" class="loop-card-play" :src="require('../assets/cardPlayAudio.png')" alt="" />
          </div>
        </div>

        <div class="draw-flex-center cropper-detail">
          <div class="text-one cropper-level-title">
            {{item.title}}
          </div>
          <div v-if="item.description" class="div-long-text div-long-text2">
            <div class="text-one cropper-level-content long-text"  :data-index="index">
              {{item.description}}
            </div>
            <span v-if="item.showMoreText" @click="showLongText(index)" class="more-text" :class="['more-text-vertical', showPop ? 'cropper-button-notclickable' : '']">
                ...全文&nbsp;
              </span>
          </div>
        </div>
        <!-- 图片显示在右边 -->
        <div v-if="layout.imageAlignment == 'RIGHT'" @click="playVideo(index)" class="loop-img-play draw-cursor-pointer">
          <img v-if="item.media.cspMediaUrl" class="draw-cat-more-card-img cropper-level-img " :class="response[0].media.height" :src="item.media.cspMediaUrl" alt="" />
          <!--<div v-else class="cropper-level-img " style="height: 1px;"></div>-->
          <!-- 蒙层 -->
          <div v-if="item.media.mediaType != 'pic'" class="play-icon">
            <img v-if="item.media.mediaType == 'video'" class="loop-card-play" :src="require('../assets/cardPlay.png')" alt="" />
            <img v-else-if="item.media.mediaType == 'voice'" class="loop-card-play" :src="require('../assets/cardPlayAudio.png')" alt="" />
          </div>
        </div>
      </div>
      <!-- 底部的按钮 -->
      <template v-if="chatbotType == 'H5'">
	      <template v-for="(button, index) in item.buttons">
					<a v-if="button.type == 'call'" class="draw-text-two cropper-button" :class="[ layout.cardOrientation == 'VERTICAL' ? 'cropper-img' : 'cropper-section', showPop ? 'cropper-button-notclickable' : '' ]" :href="'tel:' + button.callPhone">{{button.description}}</a>
					<div v-else class="draw-text-two cropper-button" :class="[ layout.cardOrientation == 'VERTICAL' ? 'cropper-img' : 'cropper-section', showPop ? 'cropper-button-notclickable' : '' ]" @click="openUrlNew(button)">{{button.description}}</div>
				</template>
			</template>
      <template v-else>
	      <template v-for="(button, index) in item.buttons">
	        <div class="draw-text-two cropper-button" :class="[ layout.cardOrientation == 'VERTICAL' ? 'cropper-img' : 'cropper-section', showPop ? 'cropper-button-notclickable' : '' ]" @click="openUrlNew(button)">{{button.description}}</div>
	      </template>
      </template>

       <!--0528新增蒙层，不可点击操作-->
	    		<!--<div v-if="showPop" class="draw-preview-cover" style="display: block;"></div>-->

      </template>
    </div>

    <!-- 多卡 -->
    <div v-else-if="msgType == 'manyCards'" class="draw-flex-center" :class="response.length > 1 ? 'more-list' : '' ">
      <section v-for="(item, index) in response" class="loop draw-flex-center more-list-li">
        <!-- 轮播-小 -->
        <template v-if="layout.cardWidth == 'SMALL_WIDTH'">
          <div class="loop-img-play draw-cursor-pointer" @click="playVideo(index)">
            <img v-if="item.media.thumbnailMediaUrl" class="draw-cat-more-card-img loop-small-img" :class="response[0].media.height" :src="item.media.thumbnailMediaUrl" alt="">
            <!--<div v-else class="loop-small-img" style="height: 1px;"></div>-->
            <!-- 蒙层 -->
            <div v-if="item.media.mediaType != 'pic'" class="play-icon">
              <img v-if="item.media.mediaType == 'video'" class="loop-card-play" :src="require('../assets/cardPlay.png')" alt="" />
              <img v-else-if="item.media.mediaType == 'voice'" class="loop-card-play" :src="require('../assets/cardPlayAudio.png')" alt="" />
            </div>
          </div>
          <div class="text-one cropper-title loop-small-title loop-small-title-one" >
            {{item.title}}
          </div>
          <div v-if="item.description" class="div-long-text div-long-text3">
            <div class="text-one cropper-content loop-small-title long-text"  :data-index="index">
              {{item.description}}
            </div>
            <span v-if="item.showMoreText" @click="showLongText(index)" class="more-text" :class="[ showPop ? 'cropper-button-notclickable' : '' ]">
                ...全文&nbsp;
              </span>
          </div>
        </template>

        <!-- 轮播-中 -->
        <template v-else>
          <div class="loop-img-play draw-cursor-pointer" @click="playVideo(index)">
            <!-- 中width -->
            	<img v-if="item.media.thumbnailMediaUrl" class="draw-cat-more-card-img loop-img " :class="response[0].media.height" :src="item.media.thumbnailMediaUrl" alt="">
            <!--<div v-else class="loop-img " style="height: 1px;"></div>-->

            <!-- 蒙层 -->
            <div v-if="item.media.mediaType != 'pic'" class="play-icon">
              <img v-if="item.media.mediaType == 'video'" class="loop-card-play" :src="require('../assets/cardPlay.png')" alt="" />
              <img v-else-if="item.media.mediaType == 'voice'" class="loop-card-play" :src="require('../assets/cardPlayAudio.png')" alt="" />
            </div>
          </div>
          <div class="text-one cropper-title loop-title" >
            {{item.title}}
          </div>
          <div v-if="item.description" class="div-long-text div-long-text1">
            <div class="text-one cropper-content loop-title long-text"  :data-index="index">
              {{item.description}}
            </div>
            <span v-if="item.showMoreText" @click="showLongText(index)" class="more-text" :class="[ showPop ? 'cropper-button-notclickable' : '' ]">
                ...全文&nbsp;
              </span>
          </div>
        </template>

        <!-- 底部的按钮 -->
	      <template v-if="chatbotType == 'H5'">
	      <template v-for="(button, index) in item.buttons">
					<a v-if="button.type == 'call'" class="draw-text-two cropper-button" :class="[ layout.cardWidth == 'SMALL_WIDTH' ? 'loop-small-img' : 'loop-img', showPop ? 'cropper-button-notclickable' : '' ]" :href="'tel:' + button.callPhone">{{button.description}}</a>
					<div v-else class="draw-text-two cropper-button" :class="[ layout.cardWidth == 'SMALL_WIDTH' ? 'loop-small-img' : 'loop-img', showPop ? 'cropper-button-notclickable' : '' ]" @click="openUrlNew(button)">{{button.description}}</div>
				</template>
			</template>
      <template v-else>
	      <template v-for="(button, index) in item.buttons">
	        <div class="draw-text-two cropper-button" :class="[ layout.cardWidth == 'SMALL_WIDTH' ? 'loop-small-img' : 'loop-img', showPop ? 'cropper-button-notclickable' : '' ]" @click="openUrlNew(button)">{{button.description}}</div>
	      </template>
	     </template>

	      <!--0528新增蒙层，不可点击操作-->
	    		<!--<div v-if="showPop" class="draw-preview-cover" style="display: block;"></div>-->
      </section>
    </div>

    <!-- 显示长文本内容 -->
    <div v-if="longText" @click="clearLongText" class="draw-flex-center full-screen">
      <div class="full-screen-content">
        {{longText}}
      </div>
    </div>
  </div>
  </div>
</template>
<script>
	import {getUUID, querySelector} from '../assets/js/util.js'
	import { openAppCallappLib } from '../catRobotH5/openAppCallappLib.js' //10.21新增体验机器人使用

	var isTest = false

	 // 配置参数
    //   单卡：
    // "cardOrientation": "HORIZONTAL", 水平
    // "imageAlignment": "LEFT/RIGHT"
    // "cardOrientation": "VERTICAL"  垂直

    // 多卡：
    // "cardWidth": "MEDIUM_WIDTH"
    // "cardWidth": "SMALL_WIDTH"

    // media中
    // "height": "MEDIUM_HEIGHT"
    // "height": "TALL_HEIGHT"
    // "height": "SHORT_HEIGHT"
	export default {
		name: 'catRobotMoreCard',
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
			layout: {
				type: Object,
				default: function() {
					return {}
				},
			},
			//0518新增是否显示蒙层
			showPop: {
				type: Boolean,
				default: false,
			},
			
			//10.21新增判断是调试机器人还是H5体验机器人
			chatbotType: {
				type: String,
				default: '',  //''表示是调试机器人，H5是体验机器人
			},
		},
		data: function() {
			return {
				catRobotMoreCardId: '',  //方便获取元素
        longText: '', //显示的内容
			}
		},
		created: function() {
			this.catRobotMoreCardId = getUUID()
		},
		mounted() {},
		watch:{
		  response: {
		      handler(newName, oldName) {
						if(newName) {
							// 设置是否显示全文按钮
							this.setLongText()
							// 设置最大高度以适应全部
							this.setMaxHeight()
						}
		      },
		      immediate: true,
		      deep: true
		  },
		},
		methods: {
			// 获取长度
			setLongText() {
				var that = this
				this.$nextTick(() => {
					var long1 = querySelector(`.${this.catRobotMoreCardId}`)
					if(!long1) {
						return
					}
					var long = long1.querySelectorAll('.long-text')
					if(!long) {
						return
					}
					long.forEach((item, index) => {
						var clientHeight = item.clientHeight //它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距
						var scrollHeight = item.scrollHeight //元素内容高度的度量
						if(clientHeight < scrollHeight) {
							//获取实际的id值，有些可能不存在
							var ind = item.getAttribute('data-index') || 0
//							// 说明需要显示全文
							this.$set(this.response[ind], "showMoreText", 1)

							this.$forceUpdate()  //手动去更新
						}
					})
				})
			},
			// 设置最大高度
			setMaxHeight() {
				var that = this
				var maxHeight = 0
				var len = this.response.length
				if(len <= 1) {
					return
				}

				this.$nextTick(() => {
					//获取层级
					var long1 = querySelector(`.${this.catRobotMoreCardId}`)
					if(!long1) {
						return
					}
					var long = long1.querySelectorAll('.more-list-li')
					if(!long) {
						return
					}
					long.forEach((item) => {
						var clientHeight = item.clientHeight //它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距
						if(maxHeight < clientHeight) {
							maxHeight = clientHeight
						}
					})
					long.forEach((item) => {
						item.style.height = maxHeight + 'px'
					})
				})

			},
			// 设置成需要的格式
			setList(result) {
				var that = this
				result.forEach((item) => {
					var content = item

//					if(isTest) {
//							item.media.height = 'TALL_HEIGHT'
//					}

					// 判断是否需要显示底部的按钮
					item.suggestions.forEach((buttons) => {
						var url = buttons.action && buttons.action.urlAction && buttons.action.urlAction.openUrl.url
						if(url && checkURL(url)) {
							buttons.showButton = true
							buttons.url = url
						}
					})
					// 设置播放的类型(显示不同的图标)
					item.media.mediaType = this.judgeMediaContentType(item.media)
				})
				this.response = result
				// 设置是否显示全文按钮
				this.setLongText()
				// 设置最大高度以适应全部
				this.setMaxHeight()
			},
			// 判断不同开头去处理
			judgeMediaContentType(media) {
				var first = media.mediaContentType
				var result = {
					a: 'voice',
					v: 'video',
					i: 'img'
				}
				return result[first[0]]
			},
			// 打开展示页面
			playVideo(index) {
				var obj = this.response[index]
				var type = obj.media.mediaType
				if(type == 'pic' || type == 'voice' || type == 'video') {
					var url = obj.media.mediaUrl
					this.openUrl(url)
				}
			},
			// 点击按钮打开新页面
			openUrl(url) {
				window.open(url,"_blank");
			},
			// 点击按钮打开新页面
			openUrlNew(button) {
				//0827新增判断是否有蒙层
				if(this.showPop) {
					return
				}
				
				//10.21新增体验机器人判断处理
				if(this.chatbotType == 'H5') {
					this.openUrlNewH5(button)
					return
				}
				
				if(button.type == 'url' || button.type == 'addressLocation') {
					this.openUrl(button.content)
				} else if(button.type == 'reply') {
					//触发发送消息
					this.$emit('buttonReply', button)
				} else {
//					this.$Message.info('【该类按钮当前环境无法操作】');
					this.$emit('noSupportedPrompt')
				}
			},
			// 点击按钮打开新页面
			openUrlNewH5(button) {
				//0720新增按钮兼容
				if(button.type == 'url' || button.type == 'addressLocation') {
					this.openUrl(button.content)
				} else if (button.type == 'openApp') {
					openAppCallappLib(button)
				} else if(button.type == 'reply') {
					//触发发送消息
					this.$emit('buttonReply', button)
				} else {
					this.$emit('noSupportedPrompt')
				}
			},
			// 展示全文内容
			showLongText(index) {
				//0827新增判断是否有蒙层
				if(this.showPop) {
					return
				}
				
				var content = this.response[index].description || ''
				this.$emit('transferLongText', {
	    			longText: content,
	    })
			},
			// 关闭全文内容
			clearLongText() {
				this.longText = ''
			},
		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	@default: #EBEEF5;

	.position-center-top {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.position-center-left {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	/* 超过显示... */
	.text-one {
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
		-webkit-line-clamp:1;

		/*0619数字新增换行*/
		word-break:break-all;
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
			width: 308*@rem - @subtractionWidth;;
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
		/*// 水平显示*/
		&-section {
			width: 342*@rem - @subtractionWidth;
			/*width: 313*@rem;*/

			/*padding: 17*@rem;*/
			padding: 17*@rem - 6;
			justify-content: space-between;
			display: flex;
		}
		&-level-img {
			width: 117*@rem;
			height: 117*@rem;
		}
		&-detail {
			display: flex;
			flex-direction: column;
		}
		.level-title {
			width:185*@rem - @subtractionWidth;
			color:rgba(0,0,0,1);
			line-height:24*@rem;
		}
		&-level-title {
			font-size: 15*@rem;
			.level-title();
			-webkit-line-clamp: 2;
		}
		&-level-content {
			font-size: 13*@rem;
			.level-title();
			-webkit-line-clamp: 3;
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

	.SHORT_HEIGHT {
		height: 117*@rem;
	}

	.MEDIUM_HEIGHT {
		height: 175*@rem;
	}

	.TALL_HEIGHT {
		height: 275*@rem;
	}

	.more-card {
		justify-content: flex-start;
	}
	/*// 多个时候，需要显示*/

	.more-list {
		justify-content: flex-start;

		/*width: 324px;*/
		overflow: auto;
		/*//如果是多个的需要加上*/
	}

	.more-list-li {
		/*margin-left: 9*@rem;*/
		margin-right: 9*@rem;
		/*//如果是多个的需要加上*/
		justify-content: flex-start;
	}

	.more-list-li:last-child {
		/*margin-right: 9*@rem;*/
		margin-right: 0;
	}
	/*// 显示全文外层div*/

	.div-long-text {
		position: relative;
		font-size: 13*@rem;
		line-height: 20*@rem;
	}

	.more-text {
		display: inline-block;
		position: absolute;
		bottom: 12*@rem;
		right: 0;
		background: #F7F7F7;
		color: #2B93E9;
		cursor: pointer;
	}
	/*// small*/
	.more-text-vertical {
		bottom: 0;
	}
	/*// 全屏显示详情*/

	.full-screen {
		background: #FFFFFF;
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		z-index: 20;
		filter: alpha(opacity=60);
		&-content {
			padding: 0 20*@rem;
		}
	}

		/*新增换个位置*/
		.cropper-button {
			/*width: 100%;*/
			height: 24*@rem;
			font-size: 15*@rem;
			font-weight: 500;
			color: rgba(74, 144, 226, 1);
			line-height: 24*@rem;
			cursor: pointer;
			text-align: center;
			margin-bottom: 8*@rem;
			/*新增超过显示省略号*/
			-webkit-line-clamp: 1;
			padding: 0 10px;
			display: -webkit-box;

      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
		}
		/*设置按钮不可点击的状态*/
		.cropper-button-notclickable {
			cursor: default;
		}

		.draw-preview-cover:hover {
			background-color: transparent !important;
		}

		/*0703测试显示全文按钮*/
		.div-long-text1 {
			height: 79*@rem;
		}
		.div-long-text2 {
			height: 72*@rem;
		}
		.div-long-text3 {
			height: 59*@rem;
		}
</style>
