<template>
	<div class="mainpart">
		<!-- 原生音频文件 -->
		<div class="originalAudio">
			<audio ref='audioEl' autobuffer controls="controls" @canplaythrough="oncanplaythrough">
				<source :src="source" type="audio/mpeg">
			</audio>
		</div>

		<!--原来的样式-->
		<div class="draw-flex-center chat-detail-audio">
			<div @click="playBtn" class="draw-cursor-pointer draw-flex-center chat-detail-audioplay">
<!--				<Icon v-if="!isPlay" type="ios-play" size="20" color="#fff" style="margin-left: 2px;"></Icon>-->
<!--				<Icon v-else type="ios-pause" size="20" color="#fff"></Icon>-->
        <a-icon v-if="!isPlay" type="caret-right" style="margin-left: 2px; font-size: 20px; color: #fff;"></a-icon>
        <a-icon v-else type="pause" style="font-size: 20px; color: #fff;" />
			</div>
			<div class="chat-detail-audioright">
				<div class="audioright-txt">
					{{audioName}}
				</div>
				<div class="draw-flex-center audioright-txt1">
					{{countTime}}
					<div class="chat-detail-slider">
<!--						<Slider v-model="accomplishData" show-tip="never" @on-change="sliderOnChange"></Slider>-->
            <a-slider v-model="accomplishData" :tooltip-visible="false" @change="sliderOnChange" />
					</div>
					{{altogetherTimer}}
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	import { getUUID } from '../assets/js/util.js'
	
	export default {
		name: 'catRobotAudio',
		props: {
			source: {
				type: String,
				default: '', //mp3地址
			},
			audioName: {
				type: String,
				default: '', //mp3名字
			},
			//音频的信息
			audioInformation: {
				type: Object,
				default: function() {
					return {
						playingLength: 7, //音频和视频播放的长度
					}
				},
			},
		},
		data() {
			return {
				playButtConText: '▶',
				//      altogetherTimer: null, //音频总时长
				altogetherTimer: '00:00', //音频总时长
				scheduleTimer: 0, //当前播放进度时间
				//      accomplishData: null, // 当前播放进度比
				accomplishData: 0, // 当前播放进度比
				//      countTime: '00:00:00', // 倒计时时间
				countTime: '00:00', // 倒计时时间
				unit: '%', //单位
				isTransition: true,
				ismouseDown: false,
				lastMoveVal: 0,

				isPlay: 0, //是否播放
				playValue: 0, //播放进度

				canPlay: false, //是否可以播放
				audioPlayId: getUUID(),  //设置当前id，用于排除当前id
				timer:null,  //定时器id
			}
		},
		created: function() {
			//首先判断获取的地址信息
			var audioInformation = this.audioInformation
			if(audioInformation.playingLength) {
				this.altogetherTimer = this.realFormatSecond(audioInformation.playingLength)
			}

			//0824关闭其他所有的播放器
			this.$root.eventBus.$on("close_all_audio", (obj) => {
				try {
					if(obj.audioPlayId != this.audioPlayId) {
						this.closeAudio()
					}
				}
				catch(err) {
				}
			})
		},
		methods: {
			setPlayURL(url) {
				this.videoURL = url + '?' + new Date().getTime()
				//			  // 如果动态切换src地址，也要加上下面的事件（前提是src地址已切换或已重新赋值，再走这个事件）
				this.$nextTick(() => {
					this.$refs.audioEl.load()
				})
			},
			// oncanplaythrough 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发
			oncanplaythrough() {
				let time = Math.round(this.$refs.audioEl.duration) === Infinity ? 0 : Math.round(this.$refs.audioEl.duration)
				this.canPlay = true
				this.altogetherTimer = this.realFormatSecond(time);
			},
			// 正在播放时音频轨迹的状态
			myAudioPlay(PercentageData) {
				let audioEl = this.$refs.audioEl

				this.unit = '%'
				this.accomplishData = PercentageData * 100
				if(audioEl.currentTime == audioEl.duration) {
					this.playButtConText = '▶'
					this.isPlay = 0
					this.clearTimer() //清除定时器
				}
			},
			playBtn() {
				this.closeAllAudio()  //0824新增关闭所有的播放器
				
				if(this.canPlay) {
					this.playBtnNew()
				} else {
					if(!this.source) {
						//链接无效
						return
					}
					//重新去请求一遍
					this.setPlayURL(this.source)
					//开始播放
					this.$nextTick(() => {
						this.playBtnNew()
					})
				}
			},
			playBtnNew() {
				let audioEl = this.$refs.audioEl
				if(!audioEl.duration) {
//					//不支持播放
//					this.$message.warning('当前音频不支持播放');
					//0831新增不支持的，直接新窗口打开播放
					this.openUrl(this.source)
					return
				}				
				if(this.$refs.audioEl.paused) {
					if(audioEl.currentTime == audioEl.duration) {
						this.accomplishData = 0
					}
					audioEl.play()
					this.clearTimer() //清除定时器
					this.playButtConText = '■'
					this.isPlay = 1

					try {
						this.timer = setInterval(() => {
							this.myAudioPlay(audioEl.currentTime / audioEl.duration) // 计算播放进度百分比
							let time = Math.round(audioEl.currentTime);
							this.countTime = this.realFormatSecond(time)
						}, 1000)
					}
					catch(err) {
						this.closeAudio()
					}
				} else {
					this.closeAudio()
				}
			},
			closeAudio() {
				let audioEl = this.$refs.audioEl
				audioEl && audioEl.pause()
				this.clearTimer() //清除定时器
				this.playButtConText = '▶'
				this.isPlay = 0
			},
			trackFn(ev) {
				let audioTrack = this.$refs.audioTrack // 音频轨迹
				let audioEl = this.$refs.audioEl
				let audioTrackW = audioTrack.offsetWidth // 读取音频轨迹的长度
				this.unit = 'px'
				this.accomplishData = ev.layerX
				let cilckPercentage = ev.layerX / audioTrackW
				audioEl.currentTime = cilckPercentage * audioEl.duration
				let time = Math.round(audioEl.currentTime)
				this.countTime = this.realFormatSecond(time);
			},
			// 点击音频轨迹
			trackDown(ev) {
				this.ismouseDown = true
				this.unit = 'px'
				this.accomplishData = ev.layerX
			},
			trackMove(ev) {
				if(this.ismouseDown) {
					this.trackFn(ev)
				}
			},
			trackUp(ev) {
				this.ismouseDown = false
				this.trackFn(ev)
				if(this.$refs.audioEl.paused) {
					this.playBtn()
				}
			},
			// 将整数转换成 时：分：秒的格式
			realFormatSecond(s) {
				let t;
				if(s > -1) {
					let hour = Math.floor(s / 3600);
					let min = Math.floor(s / 60) % 60;
					let sec = s % 60;
					//        if (hour < 10) {
					//          t = '0' + hour + ":";
					//        } else {
					//          t = hour + ":";
					//        }
					//        if (min < 10) {
					//          t += "0";
					//        }
					//        t += min + ":";
					if(min < 10) {
						t = '0' + min + ":";
					} else {
						t = min + ":";
					}
					if(sec < 10) {
						t += "0";
					}
					t += sec;
				}
				return t;
			},

			sliderOnChange(value) {
				var that = this
				let audioTrack = this.$refs.audioTrack // 音频轨迹
				let audioEl = this.$refs.audioEl
				if(!audioEl.duration) {
					return
				}
				audioEl.currentTime = (value / 100) * audioEl.duration
				let time = Math.round(audioEl.currentTime)
				this.countTime = this.realFormatSecond(time);
			},
			//0824关闭其他所有的播放器
			closeAllAudio() {
				this.$root.eventBus.$emit("close_all_audio", {
					audioPlayId: this.audioPlayId,
				})
			},
			// 点击按钮打开新页面
			openUrl(url) {
				if(url) {
					window.open(url,"_blank");  //新窗口打开文件
				} else {
					this.$message.warning('文件地址不存在');
				}
			},
			clearTimer() {
				if(this.timer) {
					 clearInterval(this.timer) // 清除计时器
					 this.timer = null
				}
			}
		},
		//分发注销播放
		beforeDestroy() {
			this.clearTimer() //清除定时器
			this.$root.eventBus.$off("close_all_audio")
		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	@default: #EBEEF5;
	.operationBox {
		height: 30px;
		display: flex;
		align-items: center;
		background-color: #000000;
		color: #fff;
	}

	.playButtCon {
		width: 40px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #fff;
		font-weight: 700;
		cursor: pointer;
	}

	.audioTrack {
		cursor: pointer;
		width: 100%;
		height: 10px;
		border-radius: 2px;
		position: relative;
		background-color: #7B7979;
	}

	.audioPercentage {
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #fff;
		opacity: .85;
		transition: all .05s;
		border-radius: 2px
	}

	.audioName {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #333;
		position: absolute;
		user-select: none;
	}

	.start_time,
	.end_time {
		padding: 0 10px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.originalAudio {
		display: none;
	}
	/*原来的样式*/

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

	.chat-detail-slider {
		width: 96px;
		height: 20px;
		margin: 0 8px;
		/deep/ .ant-slider {
			margin: 7px 0;
			height: 2px;
		}
		/deep/ .ant-slider-rail {
			top: 2px;
			height: 2px;
			background-color: #e8eaec;
		}
		/deep/ .ant-slider-track {
			top: 2px;
			height: 2px;
			background: #4B4B4B;
		}
		/deep/ .ant-slider-handle {
			background: #4B4B4B;
			border: none;
			width: 8px;
			height: 8px;
		}
	}

	.top-cover {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow: auto;
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
		height: 398px;
		overflow: auto;
	}

	.full-screen-img {
		width: 100%;
		height: 200px;
	}
	/*新增切换聊天类型*/

	.switch-chat-li {
		width: 48px;
		height: 24px;
		background: rgba(255, 255, 255, 1);
		border-radius: 4px 0px 0px 4px;
		border: 1px solid #D9D9D9;
		text-align: center;
		font-size: 12px;
		line-height: 22px;
		color: rgba(0, 0, 0, 0.65);
		cursor: pointer;
	}

	.switch-chat-mapp {
		border: 1px solid #1890FF;
		color: #1890FF;
	}

	.switch-chat-mapp1 {
		border-right: none;
	}

	.switch-chat-wecat {
		border-radius: 0px 4px 4px 0px;
		border: 1px solid #A9E97A;
		color: #A9E97A;
	}

	.switch-chat-wecat1 {
		border-radius: 0px 4px 4px 0px;
		border-left: none;
	}

	.chat-icon-refresh {
		margin-left: 16px;
		cursor: pointer;
	}

	.audioright-txt {
		width: 157px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
