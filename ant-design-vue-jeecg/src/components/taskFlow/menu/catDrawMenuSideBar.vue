<template>
	<div class="draw-side-menu">
		<menuCommonTop :showBackButton="false" topTitle="操作菜单"></menuCommonTop>

		<ul>
			<li v-for="(item, index) in list" :key="index" class="draw-cursor-pointer">
				<template v-if="nowNode.todoMenus[item.type]">
					<div v-if="item.type != 'deleteNode'" @click="clickAll" :data-type="item.type" class="draw-borderbottom draw-flex-center menu-title-li">
						<a-icon :type="item.iconType" :style="{ color: '#4791FB' }"></a-icon>
						<span class="menu-title-txt1">{{item.title}}</span>
					</div>
					<a-popconfirm  v-else confirm title="确定删除此节点吗？" ok-text="确定" cancel-text="取消" @confirm="ok" @cancel="cancel">
						<div slot="title">
							<a-icon type="ios-alert" color="#f90" />
							<div style='padding-left: 20px;'>确定删除此节点吗？</div>
						</div>
						<div class="draw-borderbottom draw-flex-center menu-title-li">
							<a-icon :type="item.iconType"  :style="{ color: '#4791FB' }"></a-icon>
							<span class="menu-title-txt1">{{item.title}}</span>
						</div>
					</a-popconfirm>
				</template>
			</li>
		</ul>
	</div>
</template>
<script>
	import menuCommonTop from '../menuCommon/menuCommonTop' //0722顶部的title部分，新增返回按钮

	export default {
		name: 'catDrawMenuSideBar',
		components: {
			menuCommonTop,
		},
		props: {
			nowNode: Object,
		},
		data: function() {
			return {
				list: [{
						iconType: 'form',
						title: '编辑',
						type: 'editNode',
						show: true,
					},
					{
						iconType: 'delete',
						title: '删除',
						type: 'deleteNode',
						show: true,
					},
					{
						iconType: 'plus',
						title: '添加节点',
						type: 'addNode',
						show: true,
					},
				],
			}
		},
		methods: {
			ok() {
				this.$emit('sideBarEvent', {
					jsplumbNodeId: this.nowNode.jsplumbNodeId,
					clickType: 'deleteNode', //删除节点
				})
			},
			cancel() {},
			clickAll(e) {
				var dataset = e.currentTarget.dataset
				var clickType = dataset.type

				this.$emit('sideBarEvent', {
					jsplumbNodeId: this.nowNode.jsplumbNodeId,
					clickType,
				})
			}
		},
		created() {
			var that = this

		},
		mounted() {

		},
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	.draw-side-menu {
		.menu-title-li {
			justify-content: flex-start;
			padding:22px;
		}
		.menu-title-txt1 {
			font-size: 14px;
			margin-left: 10px;
		}
	}
</style>