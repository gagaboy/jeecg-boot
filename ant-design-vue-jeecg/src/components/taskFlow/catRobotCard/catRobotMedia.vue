<template>
	<div class="cat-robot-content" style="margin-bottom: 12px;">
		<!--图片-->
				<!--<img v-if="mediaObject.replyType == 'image'" @click="openMedia" class="chat-detail-img draw-cursor-pointer" :src="mediaObject.reply && mediaObject.reply.mediaUrl" />-->
				<div v-if="mediaObject.replyType == 'image'"  @click="openMedia">
					<!--<catRobotImg :imgSrc="mediaObject.reply && mediaObject.reply.mediaUrl"></catRobotImg>-->
					<catRobotImg v-if="mediaObject.reply && mediaObject.reply.cspMediaUrl" :imgSrc="mediaObject.reply && mediaObject.reply.cspMediaUrl"></catRobotImg>
				</div>

				<!--0522修改视频显示问题-->
				<div v-if="mediaObject.replyType == 'video'" @click="openMedia" >
					<!--0529修改，如果有封面显示封面，没有显示视频-->
					<template v-if="mediaObject.reply">
						<catRobotImg v-if="mediaObject.reply.cspMediaUrl" :imgSrc="mediaObject.reply && mediaObject.reply.cspMediaUrl" :showCover="true"></catRobotImg>

						<div v-else class="draw-flex-center chat-detail-video draw-cursor-pointer">
							<video class="chat-detail-videoplay" :src="mediaObject.reply && mediaObject.reply.cspMediaUrl" proload="auto"></video>

							<div class="chat-detail-cover"></div>
							<div class="position-center chat-detail-play"></div>
<!--							<a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>-->
              <a-icon class="position-center" type="caret-right" style="margin-left: 2px; font-size: 30px; color: #fff;"></a-icon>
						</div>
					</template>
				</div>

		<!--播放音频组件-->
		<div v-if="mediaObject.replyType == 'voice'"  class="draw-flex-center chat-detail-audio">
				<catRobotAudio :source="mediaObject.reply && mediaObject.reply.cspMediaUrl" :audioName="mediaObject.reply.fileName" :audioInformation="mediaObject.reply"></catRobotAudio>
		</div>
		
		<!--10.20新增文件类型-->
		<div v-if="mediaObject.replyType === 'file'" class="media-bg">
            <div class="fileWrap">
              <div class="fileIcon">
                <img src="../assets/fileIcon.png" />
              </div>
              <div class="fileText">
                <!--<div class="fileSize" style="margin-top: 5px;">{{mediaObject.reply | materialFileName}}</div>-->
                <textOverflowSuffix class="fileSize" style="margin-top: 5px;" :textOverflow="mediaObject.reply | materialFileName"></textOverflowSuffix>
                <div class="fileSize" style="margin-top: 5px;">{{mediaObject.reply.fileSize | materialFileSize}}</div>
              </div>
            </div>
          </div>

		</div>
</template>
<script>
	import catRobotAudio from './catRobotAudio'
	import catRobotImg from './catRobotImg' //新增图片16：9的设置
	import textOverflowSuffix from '../menuCommon/textOverflowSuffix' //11.09新增文件名超出后显示后缀
	import { showEllipsis } from '../assets/js/util.js'  //js判断字符串真实长度
	
	export default {
		name: 'catRobotMedia',
		components: {
			catRobotAudio,
			catRobotImg,
			textOverflowSuffix,
		},
		props: {
			//传递过来的对象
			mediaObject: {
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
		},
		data: function() {
			return {
			}
		},
		created: function() {
		},
		filters: {
	      materialFileSize:function(limit){
	        var size = "";
	        limit = parseInt(limit)  //处理页面报错
	        if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
	          size = limit.toFixed(2) + "B"
	        }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
	          size = (limit/1024).toFixed(2) + "KB"
	        }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
	          size = (limit/(1024 * 1024)).toFixed(2) + "MB"
	        }else{                                            //其他转化成GB
	          size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
	        }
	
	        var sizeStr = size + "";                        //转成字符串
	        var index = sizeStr.indexOf(".");                    //获取小数点处的索引
	        var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
	        if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
	          return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
	        }
	        return size;
	      },
	      materialFileName(reply = {}) {
	      	var fileName = reply.fileName
	      	var materialFileType = reply.materialFileType
	      	var name = fileName
	      	if(fileName && materialFileType) {
	      		name =  fileName + '.' + materialFileType
	      	}
	      	return name
//	      	return showEllipsis(name, 22)
	      },
	  },
		mounted() {},
		methods: {
			//在新窗口打开链接
			openMedia() {
				var mediaUrl = this.mediaObject.reply.mediaUrl
				window.open(mediaUrl,"_blank");
			}
		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	@default: #EBEEF5;
	.chat-detail {
		background: rgba(24, 144, 255, 1);
		border-radius: 4px;
		font-size: 14px;
		color: rgba(255, 255, 255, 1);
		line-height: 20px;
		padding: 8px 16px 5px;
		margin-bottom: 12px;
		display: inline-block;
		word-break: break-all;
	}
	/*新增样式*/

	.position-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	/*20200309新增///////////////////////////*/

	.chat-detail-img {
		width: 164px;
		height: 95px;
	}

	.chat-detail-video {
		width: 164px;
		height: 164px;
		position: relative;
		/*//超过直接隐藏*/
    overflow: hidden;
	}

  .chat-detail-videoplay {
    width: 164px;
    height: 164px;
  }

	.chat-detail-cover {
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(169, 170, 177, 0.25);
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

	.chat-detail-audio {
		width: 237px;
		height: 64px;
		background: rgba(247, 247, 247, 1);
		border-radius: 4px;
	}

	.chat-detail-audioplay {
		width: 32px;
		height: 32px;
		background: rgba(214, 214, 214, 1);
		border-radius: 50%;

		margin-right: 12px;
	}
	
	/*10.20新增文件类型展示*/
	 .media-bg, audio::-webkit-media-controls-panel{
	    background: #f1f3f4;
	  }
	  .media-bg{
	    text-align: center;
	    width: 250px;
	    img{
	      width: 60%;
	    }
	  }
	.fileWrap {
	    display: flex;
	    width: 100%;
	    border: 1px solid #dbdbdb;
	    .fileIcon {
	      width: 50px;
	      height: 50px;
	      line-height: 50px;
	    }
	    .fileText {
	      width: 20px;
	      flex: 1;
	      padding: 0 6px;
	      text-align: left;
	      display: flex;
	      flex-direction: column;
	      justify-content: center;
	      background: #fff;
	      .fileName {
	        overflow:hidden; 
	        text-overflow:ellipsis; 
	        white-space:nowrap;
	      }
	    }
	  }
</style>
