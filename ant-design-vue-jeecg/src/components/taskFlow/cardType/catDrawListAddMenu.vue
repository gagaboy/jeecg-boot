<template>
	<div :style="listStyle">
		<div class="draw-flex-center add-content" style="color:rgba(0,0,0,1); align-items: flex-start;">
			<template v-if="!showMaxMenus">
				<div class="cat-draw-title">
					添加内容
				</div>
				<div class="draw-flex-center " style="flex-wrap: wrap; justify-content: flex-start;  align-items: flex-start;">
					<template v-for="(item, index) in menus" >
						<template v-if="!item.hide">
							<div v-if="!selectOnlyOne"  @click="addMenu"  :data-type="item.type" class="draw-flex-center add-content-txt add-content-txt1">
								<img class="add-content-img" :src="item.img" /> {{item.txt}}
							</div>
							<div v-else :class="{'add-content-txt1' : selectOnlyOneObj.replyType == item.type}" @click="addMenu"  :data-type="item.type" class="draw-flex-center add-content-txt">
								<img class="add-content-img" :src="selectOnlyOneObj.replyType == item.type ? item.img : item.img1" /> {{item.txt}}
							</div>
						</template>
					</template>
				</div>
			</template>

			<!--已达上限-->
			<!--<div v-else class="content-limit-reached">内容数量已达上限</div>-->
			<div v-else class="draw-flex-center add-button"  style="color:#A9AAB1">
					<a-icon type="plus" style="margin-right: 6px;" ></a-icon>
					内容数量已达上限
				</div>
		</div>

	</div>
</template>
<script>
	export default {
		name: 'catDrawListAddMenu', //图片，音频和视频
		props: {
			listStyle: {
				width: '351px',
			},
			showMaxMenus: {
				type: Boolean,
				default: false, //是否显示上限按钮
			},
			selectOnlyOne: {
				type: Boolean,
				default: false, //0527新增是否值选择一个，默认是可以选择多个的
			},
			//0527新增是否值选择一个，默认是可以选择多个的
			selectOnlyOneObj: {
				type: Object,
				default: function() {
					return {
						nodeType: 'text',
					}
				},
			},
			
			//10.13新增隐藏转换模板选项--需要隐藏的数组
			hideMenus: {
				type: Array,
				default: function() {
					return []
				},
			},
		},
		components: {},
		data: function() {
			return {
				menus: [{
						txt: '文字',
						type: 'text',
						img: require('../assets/text.png'),
						img1: require('../assets/text1.png'), //未选中的状态
						hide: false,
					},
					{
						txt: '图片',
						type: 'image',
						img: require('../assets/images.png'),
						img1: require('../assets/images1.png'), //未选中的状态
						hide: false,
					},
					{
						txt: '音频',
						type: 'voice',
						img: require('../assets/audio.png'),
						img1: require('../assets/audio1.png'), //未选中的状态
						hide: false,
					},
					{
						txt: '视频',
						type: 'video',
						img: require('../assets/video.png'),
						img1: require('../assets/video1.png'), //未选中的状态
						hide: false,
					},
					{   //10.19新增
						txt: '文件',
						type: 'file',
						img: require('../assets/file.png'),
						img1: require('../assets/file1.png'), 
						hide: false,
					},
					{
						txt: '单卡',
						type: 'singleCard',
						img: require('../assets/simpleCard.png'),
						img1: require('../assets/simpleCard1.png'), //未选中的状态
						hide: false,
					},
					{
						txt: '多卡',
						type: 'manyCards',
						img: require('../assets/multipleCard.png'),
						img1: require('../assets/multipleCard1.png'), //未选中的状态
						hide: false,
					},
					{
						txt: '转换模板',
						type: 'conversionTemplate',
						img: require('../assets/conversionTemplate.png'),
						img1: require('../assets/conversionTemplate1.png'), //未选中的状态
						hide: false,
					},
				]
			}
		},
		methods: {
			addMenu(e) {
				var that = this
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type
				this.$emit("addMenu", {
					addMenuType: clickType
				}); //自定义事件 此方法直接出发父组件中的显示数据的方法
			},
		},
		created() {
			//10.13新增隐藏转换模板选项--需要隐藏的数组
			var hideMenus = this.hideMenus
			var menus = this.menus
			menus.forEach((item) => {
				if(hideMenus.indexOf(item.type) > -1) {
					//说明找到了，设置隐藏
					item.hide = true //设置隐藏
				}
			})
		},
		mounted() {},
		destroyed() {
			document.body.style.overflow = 'auto' //处理弹窗导致无法关闭的bug
		},
	}
</script>
<style lang='less' scoped>
	@import '../assets/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	.add-content {
		font-size: 14px;
		line-height: 22px;
		cursor: pointer;
		height: inherit;
		justify-content: flex-start;
		/*padding: 17px 16px;*/
		padding: 12px 16px;
	}

	.add-content-icon {
		margin-right: 6px;
	}

	.add-content-txt {
		font-size: 14px;
		/*color: rgba(24, 144, 255, 1);*/
		margin-left: 11px;
		/*移上去显示手指*/
		cursor: pointer;

		color: #979797;
	}

	.add-content-txt1 {
		color: rgba(24, 144, 255, 1);
	}

	.add-content-img {
		width: 12px;
		height: 12px;
		margin-right: 6px;
	}

	.cat-draw-title {
		min-width: 60px;
	}

	/*新增回复已达上限*/
	.content-limit-reached {
		font-size:14px;
		color:rgba(0,0,0,0.25);
	}
	.add-button {
		font-size: 12px;
		border-radius: 0 0 4px 4px;
		padding: 0 16px;
		cursor: pointer;
	}
</style>