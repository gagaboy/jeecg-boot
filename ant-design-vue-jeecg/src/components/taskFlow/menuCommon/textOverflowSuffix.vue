<template>
	<div  class="text-overflow-suffix">
		<div :id="textOverflowSuffixId" class="text-one">
			{{textOverflow}}
		</div>
		<div v-if="textOverflowSuffixText" class="more-text">
			{{textOverflowSuffixText}}
		</div>
	</div>
</template>
<script>
	import { getUUID, querySelector } from '../assets/js/util.js'

	//	文件名超出后显示后缀
	export default {
		name: 'textOverflowSuffix',
		components: {},
		props: {
			textOverflow: String, //给的文字
			//			listStyle: { 
			//				width: '350px' //:style="listStyle"
			//			}
		},
		data: function() {
			return {
				textOverflowSuffixId: '', //方便获取元素
				textOverflowSuffixText: '', //显示的后缀名
			}
		},
		watch:{
		  textOverflow: {
		      handler(newName, oldName) {
		      	this.textOverflowSuffixText = ''
				this.setLongText() //设置显示后缀
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
					var item = querySelector(`#${this.textOverflowSuffixId}`)
					if(!item) {
						return
					}
					var clientHeight = item.clientHeight //它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距
						var scrollHeight = item.scrollHeight //元素内容高度的度量
						if(clientHeight < scrollHeight) {
							//截取后缀
							var str = this.textOverflow
							if(!str) {
								return
							}
							var strArr = str.split('.')
							var lastStrLen = strArr[strArr.length - 1].length //取后缀的
							var lastStr1 = str.substring(str.length - (lastStrLen + 5)) //5是因为需要取后缀前5个--10.22修改取后4位
							
							this.textOverflowSuffixText = '...' + lastStr1
							//							this.$forceUpdate()  //手动去更新
						}
				})
			}
		},
		created() {
			this.textOverflowSuffixId = 'textOverflowSuffixId' + getUUID()

		},
		mounted() {
//			this.setLongText() //设置显示后缀
		},
	}
</script>

<style lang='less' scoped>
	/*@import '../assets/css/default.css';*/
	.text-overflow-suffix {
		width: 100%;
		position: relative;
		line-height: 20px;
		/*font-size: 16px;*/
	}
	/* 超过显示... */
	.text-one {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp: 1;
		/*0619数字新增换行*/
		word-break: break-all;
	}
	
	.more-text {
		display: inline-block;
		position: absolute;
		bottom: 0;
		right: 0;
		background: #fff;
	}
</style>