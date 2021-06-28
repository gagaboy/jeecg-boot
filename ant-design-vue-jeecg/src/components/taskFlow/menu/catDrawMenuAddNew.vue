<template>
	<div>
		<div class="draw-side-menu">
			<menuCommonTop @catBackButton="catBackButton" :showBackButton="showBackButton" topTitle="新建节点"></menuCommonTop>

			<div class="draw-borderbottom">
				<div @click.stop="clickAll" data-type="packUp" data-name="judge"  class="draw-cursor-pointer draw-flex-center draw-side-menu-node">
					<span class="draw-side-menu-node-txt">判断</span>
					<a-icon v-if="config.judge" type="down" :style="{ fontSize: '14px'}" />
					<a-icon v-else type="up"></a-icon>
				</div>

				<template v-if="config.judge">
					<div v-for="(item, index) in judge" :key="index"  class="draw-flex-center add-button">
						<div v-dbClick @click="clickAll" data-type="addEvent" :data-name="nowNode.addNewMenus[item.type] ? item.type : ''" >
							<div :class="[ nowNode.addNewMenus[item.type] ? '' : 'no-click' ]" class="draw-cursor-pointer draw-flex-center draw-side-menu-node-card ">
								<span class="draw-flex-center card-round" style="background: #4791FB;">
			  						<a-icon :type="item.iconType" :style="{ fontSize: '10px', color: '#ffffff' }" />
			  					</span> {{item.title}}
							</div>
	  					</div>
					</div>
				</template>
			</div>

			<div class="draw-borderbottom">
				<div @click.stop="clickAll" data-type="packUp" data-name="todo" class="draw-cursor-pointer draw-flex-center draw-side-menu-node">
					<span class="draw-side-menu-node-txt">动作</span>
					<a-icon v-if="config.todo" type="down" :style="{ fontSize: '14px'}" />
					<a-icon v-else type="up"></a-icon>
				</div>
				<template v-if="config.todo">
					<div v-for="(item, index) in todo" :key="index"   class="draw-flex-center add-button">
	  					<div v-dbClick @click="clickAll" data-type="addEvent" :data-name="nowNode.addNewMenus[item.type] ? item.type : ''">
	  						<div :data-name="nowNode.addNewMenus[item.type] ? item.type : ''" :class="[ nowNode.addNewMenus[item.type] ? '' : 'no-click' ]" class="draw-cursor-pointer draw-flex-center draw-side-menu-node-card ">
								<span class="draw-flex-center card-round" style="background: #4791FB;">
			  						<svg v-if="item.type == 'send'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10px" height="10px" viewBox="0 0 24 24" version="1.1">
											<g stroke="#fff" stroke-width="1" fill="none" fill-rule="evenodd">
													<path d="M3,13.5 L19,12 L3,10.5 L3,3.7732928 C3,3.70255344 3.01501031,3.63261921 3.04403925,3.56811047 C3.15735832,3.3162903 3.45336217,3.20401298 3.70518234,3.31733205 L21.9867539,11.5440392 C22.098181,11.5941815 22.1873901,11.6833905 22.2375323,11.7948177 C22.3508514,12.0466378 22.2385741,12.3426417 21.9867539,12.4559608 L3.70518234,20.6826679 C3.64067359,20.7116969 3.57073936,20.7267072 3.5,20.7267072 C3.22385763,20.7267072 3,20.5028496 3,20.2267072 L3,13.5 Z" fill="#FFFFFF"/>
											</g>
									</svg>
			  						<svg v-else-if="item.type == 'exchange'" t="1597216726074" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1883" width="10" height="10"><path d="M566.933333 353.525333A254.965333 254.965333 0 0 0 512 512c0 60-15.477333 116.373333-42.666667 165.376a342.026667 342.026667 0 0 1-54.890666 73.546667C352.501333 814.112 266.154667 853.333333 170.666667 853.333333H85.333333a42.666667 42.666667 0 0 1 0-85.333333h85.333334c81.546667 0 154.186667-38.122667 201.066666-97.525333A254.965333 254.965333 0 0 0 426.666667 512c0-60 15.477333-116.373333 42.666666-165.376a342.293333 342.293333 0 0 1 54.890667-73.546667C586.165333 209.888 672.512 170.666667 768 170.666667h67.658667l-97.824-97.834667a42.666667 42.666667 0 0 1 59.274666-61.376c0.362667 0.341333 0.704 0.693333 1.056 1.045333l170.666667 170.666667a42.666667 42.666667 0 0 1 0 60.330667l-170.666667 170.666666C789.834667 422.496 778.912 426.666667 768 426.666667s-21.834667-4.170667-30.165333-12.501334a42.666667 42.666667 0 0 1 0-60.330666L835.658667 256H768c-81.546667 0-154.186667 38.122667-201.066667 97.525333zM85.333333 256h85.333334c81.546667 0 154.186667 38.122667 201.066666 97.525333a425.728 425.728 0 0 1 42.72-80.437333C352.501333 209.888 266.154667 170.666667 170.666667 170.666667H85.333333a42.666667 42.666667 0 0 0 0 85.333333z m712.832 353.834667a42.666667 42.666667 0 0 0-61.376 59.274666c0.330667 0.362667 0.682667 0.704 1.045334 1.056L835.658667 768H768c-81.546667 0-154.186667-38.122667-201.066667-97.525333a425.493333 425.493333 0 0 1-42.730666 80.437333C586.165333 814.112 672.512 853.333333 768 853.333333h67.658667l-97.824 97.834667a42.666667 42.666667 0 0 0 59.274666 61.376c0.362667-0.330667 0.704-0.682667 1.056-1.045333l170.666667-170.666667a42.666667 42.666667 0 0 0 0-60.330667l-170.666667-170.666666z" p-id="1884" fill="#ffffff"></path></svg>
									<svg v-else-if="item.type==='joinUserGroup'" t="1597217679136" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4411" width="10" height="10"><path d="M512 51.2C258.048 51.2 51.2 258.048 51.2 512s206.848 460.8 460.8 460.8 460.8-206.848 460.8-460.8S765.952 51.2 512 51.2z m235.52 481.28H532.48v215.04c0 11.264-9.216 20.48-20.48 20.48s-20.48-9.216-20.48-20.48V532.48H276.48c-11.264 0-20.48-9.216-20.48-20.48s9.216-20.48 20.48-20.48h215.04V276.48c0-11.264 9.216-20.48 20.48-20.48s20.48 9.216 20.48 20.48v215.04h215.04c11.264 0 20.48 9.216 20.48 20.48s-9.216 20.48-20.48 20.48z" p-id="4412" fill="#ffffff"></path></svg>
  									<svg v-else-if="item.type==='removeUserGroup'" t="1597217713399" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5252" width="10" height="10"><path d="M504.364889 16.445242c-277.865486 0-503.111837 225.245343-503.111837 503.111837S226.499403 1022.665894 504.364889 1022.665894c277.865486 0 503.109823-225.24333 503.109823-503.108816S782.230375 16.445242 504.364889 16.445242zM755.674123 535.769733c0 18.816426-15.281298 34.097724-34.122895 34.097724L286.660011 569.867457c-18.841598 0-34.097724-15.281298-34.097724-34.097724l0-7.27163c0-18.81844 15.256126-34.097724 34.097724-34.097724l434.891217 0c18.841598 0 34.122895 15.279284 34.122895 34.097724L755.674123 535.769733z" p-id="5253" fill="#ffffff"></path></svg>
			  						<svg v-else-if="item.type==='sendhttp'"  t="1597217343815" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2710" width="10" height="10"><path d="M763.733333 741.973333c-11.093333-34.133333-43.093333-59.306667-81.066666-59.306666h-42.666667v-128a42.666667 42.666667 0 0 0-42.666667-42.666667H341.333333v-85.333333h85.333334a42.666667 42.666667 0 0 0 42.666666-42.666667V298.666667h85.333334a85.333333 85.333333 0 0 0 85.333333-85.333334v-17.493333a340.650667 340.650667 0 0 1 123.733333 546.133333M469.333333 850.346667c-168.533333-20.906667-298.666667-164.266667-298.666666-338.346667 0-26.453333 3.413333-52.053333 8.96-76.373333L384 640v42.666667a85.333333 85.333333 0 0 0 85.333333 85.333333m42.666667-682.666667A426.666667 426.666667 0 0 0 85.333333 512a426.666667 426.666667 0 0 0 426.666667 426.666667 426.666667 426.666667 0 0 0 426.666667-426.666667A426.666667 426.666667 0 0 0 512 85.333333z" fill="#ffffff" p-id="2711"></path></svg>
  									<svg v-else-if="item.type==='defaultReply'" t="1597217430898" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3560" width="10" height="10"><path d="M322 321l384 0c-3.376-40-19.458-70.9-55.842-80.712-0.892-0.238-2.24-0.848-3.134-1.082-24.008-6.848-42.024-15.306-42.024-41.562L605 156.454C605 105.382 563.952 64 512.98 64c-50.932 0-91.98 41.382-91.98 92.454l0 41.19c0 26.256-17.184 34.338-41.194 41.186-0.894 0.234-1.6 1.22-2.532 1.458C340.892 250.1 325.854 281 322 321zM513.98 128.79c15.23 0 27.582 12.39 27.582 27.664 0 15.308-12.352 27.7-27.582 27.7-15.228 0-27.544-12.39-27.544-27.7C486.436 141.18 498.752 128.79 513.98 128.79z" p-id="3561" fill="#ffffff"></path><path d="M811.222 127 663 127l0 27.976c0 21.166 18.386 38.024 39.014 38.024l74.424 0c13.334 0 24.198 10.87 24.88 24.39l0.17 654.2c-0.644 12.864-10.606 23.092-23.028 24.034l-528.836 0.062c-12.422-0.942-22.298-11.39-22.944-24.252l-0.17-654.028c0.644-13.522 11.716-24.406 25.012-24.406l74.462 0c20.626 0 37.014-16.858 37.014-38.024L362.998 127l-146.262 0C186.5 127 161 152.116 161 183.15l0 720.76c0 31.004 25.5 57.09 55.738 57.09L513.98 961l297.242 0c30.276 0 53.778-26.086 53.778-57.09L865 183.15C865 152.116 841.498 127 811.222 127z" p-id="3562" fill="#ffffff"></path><path d="M289 385l224 0 0 64-224 0 0-64Z" p-id="3563" fill="#ffffff"></path><path d="M289 769l320 0 0 64-320 0 0-64Z" p-id="3564" fill="#ffffff"></path><path d="M289 641l258 0 0 64-258 0 0-64Z" p-id="3565" fill="#ffffff"></path><path d="M289 513l416 0 0 64-416 0 0-64Z" p-id="3566" fill="#ffffff"></path></svg>
  									<a-icon :type="item.iconType" :style="{ fontSize: '10px', color: '#ffffff' }" />

			  					</span> {{item.title}}
		  					</div>
	  					</div>
					</div>
				</template>
			</div>
		</div>

	</div>
</template>
<script>
	import menuCommonTop from '../menuCommon/menuCommonTop' //0722顶部的title部分，新增返回按钮

	export default {
		name: 'catDrawMenuAddNew',
		components: {
			menuCommonTop,
		},
		props: {
			nowNode: Object,
			showBackButton: Boolean,  //0721新增显示返回按钮
		},
		data: function() {
			return {
				config: {
					todo: true, //是否展开
					judge: true, //是否展开
				},

				todo: [{
						iconType: 'question',
						title: '提问',
						type: 'ask',
					},
					{
						iconType: 'ios-paperplane',
						title: '发送消息',
						type: 'send',
					},
					{
						iconType: 'earth',
						title: '发送http请求',
						type: 'sendhttp',
					},
//					{
//						iconType: 'android-add-circle',
//						title: '加入用户组',
//						type: 'joinUserGroup',
//					},
//					{
//						iconType: 'android-remove-circle',
//						title: '组中移除用户',
//						type: 'removeUserGroup',
//					},
					{
						iconType: 'shuffle',
						title: '任务切换',
						type: 'exchange',
					},
					{
						iconType: 'clipboard',
						title: '发送默认回复',
						type: 'defaultReply',
					},
				],
				judge: [
				{
//						iconType: 'android-compass',
						iconType: 'compass',
						title: '判断',
						type: 'judge',
				},
				{
						iconType: 'search',
						title: '变量管理',
						type: 'manageVariables',
				},
				],
			}
		},
		methods: {
			clickAll(e) {
				var dataset = e.currentTarget.dataset
	    		var clickType = dataset.type
	    		if(typeof this[clickType] == 'function') {
		    			this[clickType](dataset)
		    			return
		    	}
	    		if(clickType == 'addEvent') {
	    			var name = dataset.name
	    			if(!name) {
	    				return
	    			}
	    			this.$emit('addEvent', {
	    				jsplumbNodeId: this.nowNode && this.nowNode.jsplumbNodeId, //如果是编辑，就传id过去
	    				name: name,
	    			})
	    		}
	    	},
	    	//展开和关闭
	    	packUp(dataset) {
	    		var name = dataset.name
	    		this.config[name] = !this.config[name]
	    	},
	    	catBackButton() {
	    		//返回按钮
	    		this.$emit('catBackButton')
	    	},
		},
		created() {
			var that = this
		},
		mounted() {

		},
		directives:{
        dbClick:{
            inserted(el, binding) {
			  el.addEventListener('click', e => {
				  if(!el.disabled) {
				   el.disabled = true;
				   let timer = setTimeout( () => {
				   	el.disabled = false;
				   },1000)
				  }
			  })
			 }
        }
   },
	}
</script>

<style lang='less' scoped>
	@import '../assets/css/default.css';
	/*----------*/
	.card-round {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #ffffff;
		margin-right: 10px;
	}

	.no-click {
		opacity:0.25;
	}
	.add-button {
		margin-bottom: 24px;
	}
</style>
