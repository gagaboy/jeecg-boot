<template>
	<div class="draw-flex-center draw-borderbottom draw-side-menu-title">
			<a-icon v-if="showBackButton" @click="catBackButton" type="left" class="draw-cursor-pointer" style="margin-right: 14px;" />

			<div style="width: 100%;">{{topTitle}}</div>
	</div>
</template>
<script>
	//	这个是顶部的title部分，新增了返回按钮。画布公共组件
	export default {
		name: 'menuCommonTop',
		components: {},
		props: {
			showBackButton: Boolean,  //0721新增显示返回按钮
			topTitle: String, //节点类型
		},
		data: function() {
			return {}
		},
		methods: {
			//返回按钮
			catBackButton() {
	    		//返回按钮
	    		this.$emit('catBackButton')
	    	},
		},
		created() {},
		mounted() {},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	.draw-side-menu-title {
		width: 400px;
		height: 58px;
		line-height: 58px;
		background: rgba(255, 255, 255, 1);
		font-size: 16px;
		font-weight: 500;
		padding: 0 24px;
	}
</style>