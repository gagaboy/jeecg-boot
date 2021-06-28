export const dropMixin = {
  methods: {
    Drop(event) { //开始拖动
      // 兼容火狐[拖动打开新页面BUG]
      document.body.ondrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
      }
      //离开区域即停止拖动
      document.onclick = () => this.noDrop()
      let box_object = this.handleBox(event)
      let box = box_object.box
      let boxPositionX = box_object.posX
    
      let e = event || window.event
      let originX = e.clientX
      this.isMouseDown = true
      // e.preventDefault()
      document.onmousemove = evt => {
        let x = evt.clientX
        let y = evt.clientY
        let scrollRange = evt.clientX - originX
        
        box.scrollLeft =  boxPositionX - scrollRange
      }
    },
    noDrop(event) { //停止拖动
      document.onmousemove = null
      document.body.ondrop = null
      this.isMouseDown = false
    },
    handleBox(evt) { //设置可拖动、滚轮操作的DIV对象
      let e = evt || window.event
      let target = e.target || e.srcElement
      let dragBox = this.getParentNode(evt)
      return {
        posX: dragBox.scrollLeft,
        box: dragBox
      }
    
    },
    getParentNode(evt) {
      var p = evt.target;
      while (!p.classList.contains('drop-handle')) {
          p = p.parentNode;
      }
      return p;
    }
  }
}