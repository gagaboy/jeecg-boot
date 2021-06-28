/**
 * 筛选表单自适应扩展
 * <a-form v-filterFormAutoUi="{expand: false, colConfig: { xs: 12, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6 }}" />
 */

export default {
  inserted(el, binding, vnode) {
    const formItems = el.getElementsByClassName('ant-form-item')
    // formItem的所有父容器
    const colItems = []

    // 默认情况超小屏幕一行2个，pad，一行3个，大屏幕一行4个
    const colConfig = (binding.value && binding.value.colConfig) || { xs: 24, sm: 24, md: 8, lg: 6, xl: 6, xxl: 6 }
    const formItemLength = formItems.length
    el.expand = binding.value && binding.value.expand
    // 仅使用form-item的padding
    el.parentNode.style.paddingBottom = 0

    // 为form-item添加自适应布局class
    let colClassText = ''

    for (let key in colConfig) {
      colClassText += ` ant-col-${key}-${colConfig[key]}`
    }

    // 修改form-item为flex布局
    for (let i = 0; i < formItemLength; i++) {
      const formItemWrapper = formItems[i].getElementsByClassName('ant-form-item-control-wrapper')
      formItems[i].style.display = 'flex'
      formItemWrapper[0].style.flex = 1
      formItems[i].parentNode.className += colClassText
      colItems.push(formItems[i].parentNode)
    }

    // 如果不添加配置，只会将筛选表单修改为flex布局
    if (!binding.value) return

    // 最后一个formItem，这里作为搜索按钮及展开按钮容器
    const lastColItem = colItems[colItems.length - 1]


    el.resizeHandler = e => {
      // 窗口size
      let size = 'xxl'
      let w = window.innerWidth
      // 开始隐藏的起始索引
      let hideStartIndex = 3

      if (w >= 1600) {
        size = 'xxl'
      } else if (w < 1600 && w >= 1200) {
        size = 'xl'
      } else if (w < 1200 && w >= 992) {
        size = 'lg'
      } else if (w < 992 && w >= 768) {
        size = 'md'
      } else if (w < 768 && w >= 576) {
        size = 'sm'
      } else {
        size = 'xs'
      }

      // 隐藏的起始索引最小为1
      hideStartIndex = colConfig[size] === 12
        ? 1
        : (24 / colConfig[size] - 1)

      for (let i = 0; i < colItems.length - 1; i++) {
        colItems[i].style.display = (i >= hideStartIndex && !el.expand) ? 'none' : 'block'
      }

      // 单列占用空间
      const colSpans = colConfig[size]

      // 当前每行多少列
      const colNum = 24 / colSpans
      // 剩余
      const surplus = formItemLength % colNum
      // offset 数量
      const spans = surplus === 0 ? 0 : (colNum - surplus) * colSpans

      // 控制最后一个formItem容器的 className
      const className = lastColItem.className
      const offsetReg = / +ant-col-offset-\d+/g

      // 控制 offset 数量
      if (el.expand) {
        lastColItem.className = offsetReg.test(className)
          ? className.replace(offsetReg, ` ant-col-offset-${spans}`)
          : className + ` ant-col-offset-${spans}`
      } else {
        lastColItem.className = className.replace(/ +ant-col-offset-\d+/g, '')
      }

      // vnode.componentInstance.$emit('resize', {
      //   size
      // })
    }
    el.resizeHandler()
    window.addEventListener('resize', el.resizeHandler, false)
  },
  update(el, binding) {
    if (!binding.value) return
    el.expand = binding.value.expand
    el.resizeHandler()
  },
  unbind(el) {
    window.removeEventListener('resize', el.resizeHandler, false)
  }
}
