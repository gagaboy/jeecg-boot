<template>
  <div class="chat-detail chat-content-answer1 cat-robot-content">
  		<div class="msgmenu-title">{{msgmenu.head_content}}</div>
  		<div v-for="(item, index) in msgmenu.list" :key="item.id" @click="openUrlNew(item)"class="draw-cursor-pointer draw-text-two cropper-button">{{item.content}}</div>
			</div>
</template>
<script type="text/ecmascript-6">
  //系统任务消息
  export default {
  		name: 'catRobotMsgmenu',
    props: {
     //传递过来的对象
			msgmenu: {
				type: Object,
				default: function() {
					return {
			        "head_content":"哎呀，我没有明白您的意思，请问您是要：",
			        "list":[
//			            {
//			                "id":"1",
//			                "content":"系统任务2"
//			            },
//			            {
//			                "id":"2",
//			                "content":"系统任务1"
//			            }
			        ],
//			        "tail_content":"" //这个没有
			    }
				},
			},
    },
    data() {
      return {

      }
    },
    methods: {
			// 点击按钮打开新页面
			openUrlNew(button) {
				this.$emit('sendInputValue', button.content)
			},
    }
  }

</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	.chat-detail {
    background: #1890ff;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    line-height: 20px;
    padding: 8px 16px;
    margin-bottom: 12px;
    display: inline-block;
    word-break: break-all;
    padding: 8px 16px!important;
    max-width: 300px;
}

.chat-content-answer1 {
		background:rgba(255,255,255,1);
		box-shadow:0px 1px 2px 0px rgba(0,0,0,0.1);
		color:rgba(0,0,0,0.85);;
	}

	/*新增换个位置*/
		.cropper-button {
			height: 24px;
			font-size: 15;
			font-weight: 500;
			color: rgba(74, 144, 226, 1);
			line-height: 24px;

			/*新增超过显示省略号*/
			-webkit-line-clamp: 1;
			display: -webkit-box;
		}
		.msgmenu-title {
			margin-bottom: 5px;
			/*0520新增自动换行*/
			white-space:pre-wrap;
		}
</style>
