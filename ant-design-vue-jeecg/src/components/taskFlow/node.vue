<template>
  <div ref="node" :style="nodeContainerStyle" @click.stop="stickyNode" @mouseenter="mouseenter" @mouseleave="mouseleave"  @mousedown="changeNodePosition($event)">
			<cat-draw-card :node="node"
				@addNode="addNode"
				@editNode="editNode"
				@deleteNode="deleteNode"
				@nodeRightMenu="nodeRightMenu"
				></cat-draw-card>
		</div>
</template>

<script>
	import catDrawCard from './catDrawCard' //卡片
	import { querySelector } from './assets/js/util.js'
	
	export default {
		name: 'flowNode',
		components: {
			catDrawCard,
		},
		props: {
			node: Object
		},
		data() {
			return {
				mouseEnter: false, //显示节点信息
			}
		},
		computed: {
			// 节点容器样式
			nodeContainerStyle() {
			  //新增去除顶部的tab高度
			  var top = this.node.top
				return {
					position: 'absolute',
					top: top,
					left: this.node.left,
          boxShadow: this.mouseEnter ? 'rgba(102,166,224, 0.4) 0px 0px 12px 0px' : '',
					backgroundColor: 'transparent'
				}
			},
			nodeIcoClass() {
				var nodeIcoClass = {}
				nodeIcoClass[this.node.ico] = true
				// 添加该class可以推拽连线出来
				nodeIcoClass['flow-node-drag'] = true
				return nodeIcoClass
			}
		},
		methods: {
      stickyNode() {
        var that = this
				var hierarchys = document.getElementsByClassName('display-hierarchy');//数组
			for (var i = 0; i < hierarchys.length; i++) {
			  hierarchys[i].classList.remove('display-hierarchy')
			}

        var divId = this.node.jsplumbNodeId
        querySelector(`#${divId}`) && querySelector(`#${divId}`).classList.add('display-hierarchy')
      },
			mouseenter() {
				this.mouseEnter = true
        // 节点点击后再置顶，鼠标悬浮时不用置顶-
				// var divId = this.node.jsplumbNodeId
				// $(`#${divId}`).addClass('display-hierarchy')
			},
			mouseleave() {
				this.mouseEnter = false
        // // 节点点击后再置顶，鼠标悬浮时不用置顶
				// var divId = this.node.jsplumbNodeId
				// $(`#${divId}`).removeClass('display-hierarchy')
			},
			//0511修改判断节点修改
			addNode(jsplumbNodeId) {
				if(this.handShowDoc()) {
          this.$emit('addNode', jsplumbNodeId)
        }
			},
//			addNode(jsplumbNodeId) {
//      if(this.handShowDoc()) {
//        this.$emit('addNode', this.node.jsplumbNodeId)
//      }
//			},
			// 删除节点
			deleteNode() {
        if(this.handShowDoc()) {
          this.$emit('deleteNode', this.node.jsplumbNodeId)
        }
			},
			//打开侧边栏
			nodeRightMenu() {
			  if(this.handShowDoc()) {
          this.$emit('nodeRightMenu', this.node.jsplumbNodeId)
        }
			},
			// 编辑节点
			editNode() {
        if(this.handShowDoc()) {
          this.$emit('editNode', this.node.jsplumbNodeId)
        }
			},
      handShowDoc() {
			  var res = false
        //判断是否是点击事件，还是拖拽事件
        let isClick = this.$refs.node.getAttribute('flag')
        if(isClick ==='true') {
          res = true
        }
        return res
      },
      changeNodePosition(event) {
        this.$refs.node.setAttribute('flag', false)
        const firstTime = new Date().getTime()
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
          // onmouseup 时的时间，并计算差值
          const lastTime = new Date().getTime()
          if ((lastTime - firstTime) < 200) {
            this.$refs.node.setAttribute('flag', true)
          } else {
            this.changeNodePositionOld(event)
          }
        }
      },
			// 鼠标移动后抬起
      changeNodePositionOld(event) {
				// 避免抖动
				if(this.node.left == this.$refs.node.style.left && this.node.top == this.$refs.node.style.top) {
					return;
				}
				this.$emit('changeNodeSite', {
					jsplumbNodeId: this.node.jsplumbNodeId,
					left: this.$refs.node.style.left,
					top: this.$refs.node.style.top,
				})
			}
		}
	}
</script>

<style lang='less' scoped>
	.display-hierarchy {
		z-index: 98 !important;
    box-shadow: 0px 0px 12px 0px #66a6e0 !important;
	}
</style>
