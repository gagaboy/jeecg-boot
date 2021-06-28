<template>
  <div class="bottom-buttons ">
  	<template v-if="chatbotType == 'H5'">
      	<div v-for="(item, index) in buttons" :key="index">
				<a v-if="item.type == 'call'" :href="'tel:' + item.callPhone" class="reply-button draw-cursor-pointer " :class="[ showPop ? 'cropper-button-notclickable' : '' ]" @click="openUrlNewCall(item)">{{item.description}}</a>
				<span v-else @click="openUrlNew(item)" class="reply-button draw-cursor-pointer " :class="[ showPop ? 'cropper-button-notclickable' : '' ]">{{item.description}}</span>
			</div>
      </template> 	
      
  	<template v-else>
    <div v-for="(item, index) in buttons" :key="index">
      <span @click="openUrlNew(item)" class="reply-button draw-cursor-pointer " :class="[ showPop ? 'cropper-button-notclickable' : '' ]">
				{{item.description}}
			</span>
    </div>
    </template>
      
    <!--0628新增蒙层-->
    <div v-if="showPrompt" class="disable-prompt1"></div>
  </div>
</template>
<script type="text/ecmascript-6">
	import { openAppCallappLib } from '../catRobotH5/openAppCallappLib.js' //10.21新增体验机器人使用

  export default {
  	name: 'catRobotButtons',
    props: {
      buttons: {
				type: Array,
				default: function() {
					return []
				},
			},
			//是否被禁用，需要显示蒙层
			showPrompt: {
				type: Boolean,
				default: false,
			},
			//0629新增是否遮盖
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
    data() {
      return {

      }
    },
    methods: {
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

				//0716艺刚说:不清，这个操作不在流程的规范交互内，不算做正常的点击，只辅助提示一下
				if(button.type == 'url' || button.type == 'addressLocation' || button.type == 'reply') {
					//0628新增清空底部的悬浮按钮
					this.$emit('clearButtons')
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

				//0716艺刚说不清，这个操作不在流程的规范交互内，不算做正常的点击，只辅助提示一下
				if(button.type == 'url' || button.type == 'openApp' || button.type == 'addressLocation' || button.type == 'reply') {
					//0628新增清空底部的悬浮按钮
					this.$emit('clearButtons')
				}
			},
			//0720新增清除底部的按钮
			openUrlNewCall() {
				this.$emit('clearButtons')
			},
    }
  }
</script>

<style lang="less" scoped>
@default: #ebeef5;
.bottom-buttons {
  white-space: nowrap;
  /*overflow-x: scroll;*/
 	overflow-x: auto;
  overflow-y: hidden;

  display: flex;
  flex-direction: row-reverse;

 	width: 100%;
 	/*max-width: 99%;*/
  position: absolute;
  bottom: 53px;
  right: 0;
  padding-bottom: 12px;
}
.reply-one {
  margin-left: 24px;
}
.reply-button {
  display: inline-block;
  padding: 0 12px;
  background: rgba(247, 247, 247, 1);
  border-radius: 4px;
  height: 36px;
  line-height: 36px;
  font-size: 12px;
  color: rgba(74, 144, 226, 1);

  margin-right: 24px;
}

/*新增禁用的浮层*/
.disable-prompt1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
}

.draw-preview-cover:hover {
  background-color: transparent !important;
}

/*设置按钮不可点击的状态*/
		.cropper-button-notclickable {
			cursor: default !important;
		}
</style>
