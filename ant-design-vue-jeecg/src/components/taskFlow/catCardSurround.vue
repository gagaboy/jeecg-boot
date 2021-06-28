<template>
	<div class="c-full-container">
  <section class="css-167b8qn">
  		<slot name="catdrawTop"></slot>
   <section id="_canvasWrap" class="css-ltwxr0">
   	<slot name="catdrawContainer"></slot>
   </section>
  </section>
	</div>
</template>
<script>
	//画布外层结构
	export default {
		name: 'catCardSurround',
		props: {
			
		},
		components: {
			
		},
		data: function() {
			return {
				
			}
		},
		methods: {
			
		},
		created() {},
		mounted() {},
		destroyed() {},
	}
</script>
<style lang='less' scoped>
	@import './assets/css/default.css';
	@default: #8C8C8C;
	@defaultBorder: #EBEEF5;
	
	.c-full-container {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    position: relative;
}
.css-167b8qn {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
    width: 100%;
    height: 100%;
    color: rgb(0, 0, 0);
    font-family: PingFang-SC;
    font-size: 14px;
    user-select: none;
    padding: 0px;
    margin: 0px;
}
.css-ltwxr0{
    position: absolute;
  		top: 81px;
   left: 0;
    bottom: 0px;
    right: 0px;
    touch-action: none;
    overflow: auto;
}
</style>